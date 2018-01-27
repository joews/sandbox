#include <ctype.h>
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <termios.h>
#include <errno.h>

//
// kilo.c
// reconstructing @antirez's kilo editor: https://github.com/antirez/kilo
// with help from https://viewsourcecode.org/snaptoken/kilo/index.html
//

// ASCII control characters, like uppercase chars, are a bitmask away
// from the lowercase characters.
#define CTRL_KEY(k) ((k) & 0x1f)

//
// state
//

// the state of the terminal before starting the editor
struct termios orig_termios;

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
  if (tcsetattr(STDIN_FILENO, TCSAFLUSH, &orig_termios) == -1) {
    die("tcsetattr");
  }
}

// Terminal "raw" mode: allow this program to interpret
// terminal input directly by setting many flags.
// Interesting ones are commented; others are not really relevant
// to modern terminal emulators but they are part of a complete "raw mode".
void enableRawMode() {
  if (tcgetattr(STDIN_FILENO, &orig_termios) == -1) {
    die("tcgetattr");
  }

  atexit(disableRawMode);
  struct termios raw = orig_termios;

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

void editorDrawRows() {
  int y;
  for (y = 0; y < 24; y++) {
    write(STDOUT_FILENO, "~\r\n", 3);
  }
}

void editorRefreshScreen() {
  clearScreen();
  editorDrawRows();

  write(STDOUT_FILENO, "\x1b[H", 3);
}

//
// init
//
int main() {
  enableRawMode();


  // polll stdin for keystrokes
  while(1) {
    editorRefreshScreen();
    editorProcessKeypress();
  }

  return 0;
}
