// gcc -ggdb -mpreferred-stack-boundary=2 -o target -z execstack stack_overflow_target.c

// test program with a buffer overflow vulnerability
// http://insecure.org/stf/smashstack.html
#include <string.h>

void main(int argc, char *argv[]) {
  char buffer[512];

  if (argc > 1)
    strcpy(buffer,argv[1]);
}
