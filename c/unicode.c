#include <stdio.h>
#include <stdlib.h>
#include <wchar.h>

int main(void) {
  // multibyte literals in char[] are fine, but each array element may only
  // be a *part* of a character, and the array length is the number of bytes,
  // not the number of characters.
  char s[] = "char 👀";
  printf("hello %s\n", s);

  int i;
  unsigned char c;
  do {
    c = s[i++];
    printf("%d\n", c);
  } while (c != 0);

  // wchar_t is designed for multibyte characters but the size is compiler-defined
  // any maybe as small as 1 byte.
  // TODO printing with %s prints a garbled character; %S fails to print the entire line.
  wchar_t t[] =  L"👀";
  printf("hello %S\n", t);
  printf("done with uint32_t\n");

  printf("DONE\n\n");
}
