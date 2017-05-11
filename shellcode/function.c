// gcc -mpreferred-stack-boundary=2 -ggdb function.c -o function

/*
(gdb) disas function
  ;; function prelude
  ; push the stack base pointer so we can restore it after this function returns
  0x080483fb <+0>:	push   %ebp

  ; save the stack pointer to the base pointer, so the base pointer
  ; points to the start of this function's stack frame
  0x080483fc <+1>:	mov    %esp,%ebp

  ; grow the stack to allocate room for this function's locals
  ; (24 bits: 5 * 4 + 1, rounded up to 4 byte boundary)
  0x080483fe <+3>:	sub    $0x1c,%esp

  ;; function body
  0x08048401 <+6>:	mov    0x8(%ebp),%edx
  0x08048404 <+9>:	mov    0xc(%ebp),%eax
  0x08048407 <+12>:	add    %eax,%edx

  ; promote char to int
  0x08048409 <+14>:	movsbl -0x1(%ebp),%eax
  0x0804840d <+18>:	add    %edx,%eax

  ;; function epilog
  ; restore esp and ebp to their state before this function call
  0x08048401 <+6>:	leave

  ; return to the next instruction after this function call
  ; (printf in main in this program)
  0x08048402 <+7>:	ret
*/
#include <stdio.h>

int function(int a, int b) {
  int array[5];
  char c;
  return a + b + c;
}

int main(void) {
  function(1, 2);
  printf("`function` return address points here\n");
}
