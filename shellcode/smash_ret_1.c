// gcc -mpreferred-stack-boundary=2 -ggdb smash_rec_1.c -o smash_rec_1
// Change `function` RET pointer to skip `x = 1` in main
// Based on http://insecure.org/stf/smashstack.html
#include <stdio.h>

void function(int a, int b, int c) {
  int x = 15;

  // Stack frame:
  // c|b|a|ret|sbp|x| -> low addresses
  // So &x + 2 is &ret. Changing its value changes the instruction
  // that will execute after this function returns.
  //
  // Disassembly shows how far to move the pointer to skip
  // `x = 1`:
  // (gdb) disas main
  // <snip>
  //   0x08048430 <+19>:	call   0x80483fb <function>
  //   0x08048435 <+24>:	add    $0xc,%esp
  //   0x08048438 <+27>:	movl   $0x1,-0x4(%ebp)
  //   0x0804843f <+34>:	pushl  -0x4(%ebp)
  //  <snip>
  //
  //  ret is initially 0x08048435. We want to skip to 0x0804843f.
  //  You could hard-code that address, but an offset is more robust,
  //  so use 0x0804843f - 0x08048435 (10) instead.
  *(&x + 2) += 10;
}

int main(void) {
  int x;

  x = 0;
  function(1,2,3);
  x = 1;  // function causes this line to be skipped
  printf("%d\n",x);
}
