// gcc -mpreferred-stack-boundary=2 -ggdb syscall_inline.c -o syscall_inline
// syscall.s in inline asm: print to stdout and exit from inline assembler
#include <stdio.h>

void f() {
  char* str = "hi\n";

  __asm__(
    // write str (first local variable, at %ebp-4)
    "movl $4, %eax \n\t"
    "movl $1, %ebx \n\t"
    "movl -4(%ebp), %ecx \n\t"
    "movl $3, %edx \n\t"
    "int $0x80 \n\t"

    // exit 0
    "movl $1, %eax; \n\t"
    "movl $0, %ebx; \n\t"
    "int $0x80; \n\t"
  );
}

int main(void) {
  f();

  // never called because exit
  printf("skipped\n");

  return 0;
}
