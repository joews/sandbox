// gcc -mpreferred-stack-boundary=2 -ggdb shellcode_1.c -o shellcode_1
// run the syscalls from syscall_native.c from a static buffer
#include <stdio.h>

// Attempt to run shellcode from the data segment
// TODO Doesn't print because the relative jump from %esp isn't valid
// after control has left f().


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
  // print s. Not working right now because I don't know the address
  // of s after f() has returned
  "\xb8\x04\x00\x00\x00\xbb\x01\x00\x00\x00\x8b"
  "\x4c\x24\xfc\xba\x03\x00\x00\x00\xcd\x80"

  // exit 255
  // (code is the first byte on the second line)
  "\xb8\x01\x00\x00\x00\xbb"
  "\xff\x00\x00\x00\xcd\x80";

void f() {
  char s[] = "hi";
  int *ret;
  ret = (int*)&ret + 3;
  (*ret) = (int)shellcode;
}

void main() {
  f();
  printf("not called because exit\n");
}
