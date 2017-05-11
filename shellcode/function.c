// gcc -mpreferred-stack-boundary=2 -ggdb function.c -o function

/*
(gdb) disas main

*/

void function(int a, int b) {
  int array[5];
}

int main(void) {
  function(1, 2);
  printf("return address here\n");
}
