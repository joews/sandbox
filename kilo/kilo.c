#define _DEFAULT_SOURCE
#define _BSD_SOURCE
#define _GNU_SOURCE

#include <ctype.h>
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <termios.h>
#include <errno.h>
#include <sys/ioctl.h>
#include <sys/types.h>
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

enum editorKey {
  ARROW_LEFT = 1000,
  ARROW_RIGHT,
  ARROW_UP,
  ARROW_DOWN,
  DEL_KEY,
  PAGE_UP,
  PAGE_DOWN,
  HOME_KEY,
  END_KEY
};

//
// state
//

// a row of text
typedef struct erow {
  int size;
  char *chars;
} erow;

// the editor's state
typedef struct editorConfig {
  // cursor position
  int cx, cy;

  // screen dimensions
	int screenrows;
	int screencols;

  // the row we are scrolled to
  int rowoff;

  int numrows;
  erow *row;

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
int editorReadKey() {
  int nread;
  char c;

  while((nread = read(STDIN_FILENO, &c, 1)) != 1) {
    if (nread == -1 && errno != EAGAIN) {
      die("read");
    }
  }

  // escape sequence: check for arrow keys
  if (c == '\x1b') {
    char seq[3];

    // check for the full escape sequence within the read timeout
    // if we don't get it, assume the user just pressed escape.
    if (read(STDIN_FILENO, &seq[0], 1) != 1) return '\x1b';
    if (read(STDIN_FILENO, &seq[1], 1) != 1) return '\x1b';

    if (seq[0] == '[') {
      if (seq[1] >= '0' && seq[1] <= '9') {
        // page up/down, home, end
        // escape codes for home/end vary across OS and terminal emulator
        if (read(STDIN_FILENO, &seq[2], 1) != 1) return '\x1b';

        if (seq[2] == '~') {
          switch (seq[1]) {
            case '1': return HOME_KEY;
            case '3': return DEL_KEY;
            case '4': return END_KEY;
            case '5': return PAGE_UP;
            case '6': return PAGE_DOWN;
            case '7': return HOME_KEY;
            case '8': return END_KEY;
          }
        }


      } else {
        // arrow keys send [A-D
        switch (seq[1]) {
          case 'A': return ARROW_UP;
          case 'B': return ARROW_DOWN;
          case 'C': return ARROW_RIGHT;
          case 'D': return ARROW_LEFT;
          case 'H': return HOME_KEY;
          case 'F': return END_KEY;
        }
      }
    } else if (seq[0] == 'O') {
      switch (seq[1]) {
        case 'H': return HOME_KEY;
        case 'F': return END_KEY;
      }
    }

    return '\x1b';
  } else {
    return c;
  }
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
// row operations
//
void editorAppendRow(char *s, size_t len) {
  // make space for the new row
  E.row = realloc(E.row, sizeof(erow) * (E.numrows + 1));

  int at = E.numrows;
  E.row[at].size = len;
  E.row[at].chars = malloc(len + 1);
  memcpy(E.row[at].chars, s, len);
  E.row[at].chars[len] = '\0';
  E.numrows ++;
}

//
// file io
//
void editorOpen(char *filename) {
  FILE *fp = fopen(filename, "r");
  if (!fp) die("fopen");

  char *line = NULL;
  size_t linecap = 0;
  ssize_t linelen;

  // getline handles reading a line when you don't know how much memory
  // to allocate. It resizes the initial buffer (with size linecap) when
  // necessary.
  while ((linelen = getline(&line, &linecap, fp)) != -1) {
    // strip trailing newlines
    while (linelen > 0 && (line[linelen - 1] == '\n' ||
                           line[linelen - 1] == '\r')) {
      linelen--;
    }

    editorAppendRow(line, linelen);
  }

  free(line);
  fclose(fp);
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

void editorMoveCursor(int key) {
  switch (key) {
    case ARROW_LEFT:
      if (E.cx != 0) {
        E.cx--;
      }
      break;
    case ARROW_RIGHT:
      if (E.cx != E.screencols - 1) {
        E.cx++;
      }
      break;
    case ARROW_UP:
      if (E.cy != 0) {
        E.cy--;
      }
      break;
    case ARROW_DOWN:
      if (E.cy < E.numrows) {
        E.cy++;
      }
      break;
  }
}

void editorProcessKeypress() {
  int c = editorReadKey();

  switch (c) {
    case CTRL_KEY('q'):
      clearScreen();
      exit(0);
      break;
    case ARROW_UP:
    case ARROW_DOWN:
    case ARROW_LEFT:
    case ARROW_RIGHT:
      editorMoveCursor(c);
      break;
    case PAGE_UP:
    case PAGE_DOWN:
      {
        int times = E.screenrows;
        while (times--) {
          editorMoveCursor(c == PAGE_UP ? ARROW_UP : ARROW_DOWN);
        }
      }
      break;
    case HOME_KEY:
      E.cx = 0;
      break;
    case END_KEY:
      E.cx = E.screencols - 1;
      break;
    default:
      echoKey(c);
  }

}

//
// output
//

// check if the cursor has moved outside the viewport.
// if so, scroll the view.
void editorScroll() {
  if (E.cy < E.rowoff) {
    E.rowoff = E.cy;
  }

  if (E.cy >= E.rowoff + E.screenrows) {
    E.rowoff = E.cy - E.screenrows + 1;
  }
}

void editorDrawRows(abuf *ab) {
  int y;
  for (y = 0; y < E.screenrows; y++) {
    int filerow = y + E.rowoff;

    // lines with no content: show a tilde/welcome message
    if (filerow >= E.numrows) {
      // draw a welcome message (unless we've opened a file)
      if (E.numrows == 0 && E.screenrows / 3) {
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
    } else {
      // lines with content: render it!
      int len = E.row[filerow].size;
      if (len > E.screencols) len = E.screencols;
      abAppend(ab, E.row[filerow].chars, len);
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
   editorScroll();

  struct abuf ab = ABUF_INIT;

  abAppend(&ab, "\x1b[?25l", 6);  // hide cursor
  abAppend(&ab, "\x1b[H", 3);     // cursor top left

  editorDrawRows(&ab);

  // move the cursor to the position in E.cx|y
  // (terminal row/cols are 1-indexed)
  char buf[32];
  snprintf(buf, sizeof(buf), "\x1b[%d;%dH", E.cy - E.rowoff + 1, E.cx + 1);
  abAppend(&ab, buf, strlen(buf));

  abAppend(&ab, "\x1b[?25h", 6);  // show cursor
  write(STDOUT_FILENO, ab.b, ab.len);
  abFree(&ab);
}

//
// init
//
void initEditor() {
  E.cx = 0;
  E.cy = 0;
  E.rowoff = 0;
  E.numrows = 0;
  E.row = NULL;

  if (getWindowSize(&E.screenrows, &E.screencols) == -1) die("getWindowSize");
}

int main(int argc, char *argv[]) {
	initEditor();
  enableRawMode();

  if (argc >= 2) {
    editorOpen(argv[1]);
  }

  // polll stdin for keystrokes
  while(1) {
    editorRefreshScreen();
    editorProcessKeypress();
  }

  return 0;
}
