# gcc -c syscall.s && ld syscall.o -o syscall && ./syscall
# write and exit syscalls - the first step to writing shellcode
# based on https://en.wikibooks.org/wiki/X86_Assembly/Interfacing_with_Linux#int_0x80
.data
msg: .ascii "Hello World\n"

.text
.global _start

_start:
    movl $4, %eax   # write is syscall #4
    movl $1, %ebx   # arg1: file descriptor (stdin)
    movl $msg, %ecx # arg2: buffer
    movl $12, %edx  # arg3: buffer length
    int $0x80       # syscall interrupt

    movl $1, %eax   # exit is syscall #1
    movl $0, %ebx   # arg1: exit code
    int $0x80       # syscall interrupt
