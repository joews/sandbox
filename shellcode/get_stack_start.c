// gcc -mpreferred-stack-boundary=2 -ggdb get_stack_start.c -o get_stack_start
#include <stdio.h>

// Log the stack start address
// With ASLR this is different for each process
// Without it's the same. Disable ASLR at first to make things simpler:
// echo 0 > /proc/sys/kernel/randomize_va_space
unsigned long find_start(void) {
   __asm__("movl %esp,%eax");
}

int main(void) {
  printf("0x%lx\n", find_start());
}
