// gcc -mpreferred-stack-boundary=2 -ggdb smash_ret_2.c -o smash_ret_2
// Smash a function return pointer with an argument buffer overflow
#include <stdio.h>
#include <string.h>

void function(char* s, int n) {
  char buf[4];
  strcpy(buf, s);
  printf("%s\n", buf);
}

int main(void) {
  char s[] =
    "\x31\x32\x33\x34"  // 3 expected bytes + splat expected NULL
    "\x35\x36\x37\x38"  // splat $esp with anything
    "\x73\x84\x04\x08"; // splat $ret with a real address

  function(s, 0xf);
  printf("back in main\n");
}

// Working out what arg to `function` is needed to overflow:

// stack at line 8 when passing "123" (0xf) is a visual marker
// to help find things in the stack
//
// (gdb) x/5xw $esp
//
// TOP
// 0x00333231 // buf
// 0xffffdd58 // $ebp
// 0x0804845d // $ret
// 0x08048500 // &s
// 0x0000000f // n

// With "1234567" s overflows by 4 bytes and overwrites $esp:
// 0x34333231 // buf 1
// 0x00373635 // buf 2 (splatted $ebp)
// 0x0804845d // $ret
// 0x08048500 // &s
// 0x0000000f // n
//
// With "12345671234" s overflows by 8 bytes:
// 0x34333231 // buf 1
// 0x31373635 // buf 2 (splatted $ebp)
// 0x00343332 // buf 3 (splatted $ret)
// 0x08048500 // &s
// 0x0000000f // n
//
// Good! ret is splatted bu the arg buffer. Now set it to a real
// address from main with
// s = "\x31\x32\x33\x34\x35\x36\x37\x38\x73\x84\x04\x08"
//
// 0x08048473 is the `call function` instruction. Reverse the bytes
// because x86 is little endian
//
// 0x34333231 // buf 1
// 0x8a363635 // buf 2 (splatted $ebp)
// 0x00080484 // buf 3 (splatted $ret with a real address)
// 0xffffdd4c // &s
// 0x0000000f // n
//
// Success! function gets called twice! (then segfaults)
