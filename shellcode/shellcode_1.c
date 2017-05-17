// gcc -mpreferred-stack-boundary=2 -ggdb shellcode_1.c -o shellcode_1
// run the syscalls from syscall_native.c from a static buffer
#include <stdio.h>

// WORKING
// * exit is called, and the process exits with the right code

// TODO
// * write doesn't write anything - check %ebp-4 is the right address

// Get hex representation of syscall_inline.c from gdb
// `disas f` to find the inline asm, then print each address:
// (gdb) x/bx f+13
// (gdb) x/bx f+14
// etc...

// This shellcode has lots of null bytes which is a problem
// for overflowing string buffers. It's OK here because there is no
// overflow - we just point main's return pointer at the start of the
// static shellcode. Static memory is executable.
const char shellcode[] =
  // print %ebp-4
  // "\xb8\x04\x00\x00\x00\xbb\x01\x00\x00\x00\x8b"
  //"\x4d\xfc\xba\x03\x00\x00\x00\xcd\x80"

  // exit 255
  // (code is the first byte on the second line)
  "\xb8\x01\x00\x00\x00\xbb"
  "\xff\x00\x00\x00\xcd\x80";

void f() {
  // char s[] = "hello";
  int *ret;
  ret = (int*)&ret + 2;
  (*ret) = (int)shellcode;
}

void main() {
  f();
  printf("not called because exit\n");
}
