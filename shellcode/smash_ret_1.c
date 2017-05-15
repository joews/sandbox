// gcc -mpreferred-stack-boundary=2 -ggdb smash_rec_1.c -o smash_rec_1
// Change `function` RET pointer to skip `x = 1` in main
// Based on http://insecure.org/stf/smashstack.html
#include <stdio.h>

void function(int a, int b, int c) {
  int x = 15;
  *(&x + 2) += 10;
}

int main(void) {
  int x;

  x = 0;
  function(1,2,3);
  x = 1;
  printf("%d\n",x);
}
