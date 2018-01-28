#include <ctype.h>
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <termios.h>
#include <errno.h>
#include <sys/ioctl.h>
#include <string.h>

//
// kilo.c
// reconstructing @antirez's kilo editor: https://github.com/antirez/kilo
// with help from https://viewsourcecode.org/snaptoken/kilo/index.html
//

// ASCII control characters, like uppercase chars, are a bitmask away
// from the lowercase characters.
#define CTRL_KEY(k) ((k) & 0x1f)

#define KILO_VERSION "0.0.1"

//
// state
//

typedef struct editorConfig {
	int screenrows;
	int screencols;

	// the state of the terminal before starting the editor
	struct termios orig_termios;
} editorConfig;

editorConfig E;

//
// terminal handling
//

void clearScreen() {
  // clear the screen
  // J: erase command
  // 2: erase command arg: clear the whole screen
  write(STDOUT_FILENO, "\x1b[2J", 4);

  // move cursor to top left
  write(STDOUT_FILENO, "\x1b[H", 3);
}

void die(const char *s) {
  clearScreen();

  // print a standard error message for the global `errno`,
  // which is populated by built in functions on error
  perror(s);
  exit(1);
}

void disableRawMode() {
  if (tcsetattr(STDIN_FILENO, TCSAFLUSH, &E.orig_termios) == -1) {
    die("tcsetattr");
  }
}

// Terminal "raw" mode: allow this program to interpret
// terminal input directly by setting many flags.
// Interesting ones are commented; others are not really relevant
// to modern terminal emulators but they are part of a complete "raw mode".
void enableRawMode() {
  if (tcgetattr(STDIN_FILENO, &E.orig_termios) == -1) {
    die("tcgetattr");
  }

  atexit(disableRawMode);
  struct termios raw = E.orig_termios;

  // Terminal "local"/misc flags
  // ~ECHO: don't print characters
  // ~ICANON: read input byte-by-byte, not line-by-line
  // ~SIG: don't send signals for ctrl-c, ctrl-z etc
  // ~IEXTEN: disable ctrl-v prompt for unescaped character input
  raw.c_lflag &= ~(ECHO | ICANON | ISIG | IEXTEN);

  // Terminal input flags
  // ~IXON: disable software flow control behaviour of ctrl-S and ctrl-q
  // ~CRNL: don't auto translate input \n into \rn
  raw.c_iflag &= ~(IXON | ICRNL | BRKINT | INPCK | ISTRIP);

  // Terminal output flags
  // ~OPOST: disable output post-processing, e.g. \n -> \r\n
  //  - that means we need to \r explicitly to
  raw.c_oflag &= ~(OPOST);

  // CS8: set character size to 8 bits per byte(!)
  raw.c_cflag |= (CS8);

  // c_cc: control characters
  // VMIN: min bytes needed before read() can return
  // VTIME: maximum time to wait before read returns (tenths of a second)
  raw.c_cc[VMIN] = 0;
  raw.c_cc[VTIME] = 1;

  if (tcsetattr(STDIN_FILENO, TCSAFLUSH, &raw) == -1) {
    die("tcsetattr");
  }
}

// debug helper
void echoKey(char c) {
  if (iscntrl(c)) {
    printf("%d\r\n", c);
  } else {
    printf("%c (%d)\r\n", c, c);
  }
}

// read a single key input, blocking until that happens
char editorReadKey() {
  int nread;
  char c;

  while((nread = read(STDIN_FILENO, &c, 1)) != 1) {
    if (nread == -1 && errno != EAGAIN) {
      die("read");
    }
  }

  return c;
}

int getCursorPosition(int *rows, int *cols) {
  char buf[32];
  unsigned int i = 0;
  if (write(STDOUT_FILENO, "\x1b[6n", 4) != 4) return -1;
  while (i < sizeof(buf) - 1) {
    if (read(STDIN_FILENO, &buf[i], 1) != 1) break;
    if (buf[i] == 'R') break;
    i++;
  }
  buf[i] = '\0';
  if (buf[0] != '\x1b' || buf[1] != '[') return -1;
  if (sscanf(&buf[2], "%d;%d", rows, cols) != 2) return -1;
  return 0;
}


// get window size from the ioctl system call
// this doesn't work on all systems, but the workaround is long and fiddly so
// I am leaving it out here - https://viewsourcecode.org/snaptoken/kilo/03.rawInputAndOutput.html
int getWindowSize(int *rows, int *cols) {
  struct winsize ws;
  if (ioctl(STDOUT_FILENO, TIOCGWINSZ, &ws) == -1 || ws.ws_col == 0) {
    // hack: if ioctl can't give us the real window size, move the cursor to
    // the bottom right and query its position
    if (write(STDOUT_FILENO, "\x1b[999C\x1b[999B", 12) != 12) return -1;
    return getCursorPosition(rows, cols);
  } else {
    *cols = ws.ws_col;
    *rows = ws.ws_row;
    return 0;
  }
}

//
// appendable buffer type
//
typedef struct abuf {
  char *b;
  int len;
} abuf;

# define ABUF_INIT {NULL, 0}

// s: string to append
void abAppend(abuf *ab, const char *s, int len) {
	char *new = realloc(ab->b, ab->len + len);

	if (new == NULL) return;
  memcpy(&new[ab->len], s, len);
  ab->b = new;
  ab->len += len;
}

void abFree(struct abuf *ab) {
  free(ab->b);
}

//


// input
//

void editorProcessKeypress() {
  char c = editorReadKey();

  switch (c) {
    case CTRL_KEY('q'):
      clearScreen();
      exit(0);
      break;
    default:
      echoKey(c);
  }

}

//
// output
//

void editorDrawRows(abuf *ab) {
  int y;
  for (y = 0; y < E.screenrows; y++) {
    // draw a welcome message
    if (y == E.screenrows / 3) {
      char welcome[80];
      int welcomelen = snprintf(welcome, sizeof(welcome), "Kilo editor -- version %s", KILO_VERSION);
      if (welcomelen > E.screencols) {
        welcomelen = E.screencols;
      }

      int padding = (E.screencols - welcomelen) / 2;
      if (padding) {
        abAppend(ab, "~", 1);
        padding --;
      }

      while (padding--) {
        abAppend(ab, " ", 1);
      }

      abAppend(ab, welcome, welcomelen);
    } else {
      abAppend(ab, "~", 1);
    }

    abAppend(ab, "\x1b[K", 3); // clear line

		if (y < E.screenrows - 1) {
			abAppend(ab, "\r\n", 2);
    }
  }
}

// write screen updates to an appendable buffer and write
// in a single `write` call to avoid flicker
void editorRefreshScreen() {
  struct abuf ab = ABUF_INIT;


  abAppend(&ab, "\x1b[?25l", 6);  // hide cursor
  abAppend(&ab, "\x1b[H", 3);     // cursor top left

  editorDrawRows(&ab);


  abAppend(&ab, "\x1b[H", 3);     // cursor top left
  abAppend(&ab, "\x1b[?25h", 6);  // show cursor
  write(STDOUT_FILENO, ab.b, ab.len);
  abFree(&ab);
}

//
// init
//
void initEditor() {
  if (getWindowSize(&E.screenrows, &E.screencols) == -1) die("getWindowSize");
}

int main() {
	initEditor();
  enableRawMode();


  // polll stdin for keystrokes
  while(1) {
    editorRefreshScreen();
    editorProcessKeypress();
  }

  return 0;
}
