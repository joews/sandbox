(* my solutions to "99 problems in OCaml"
 * https://ocaml.org/learn/tutorials/99problems.html
 *)

(* 1. Write a function last : 'a list -> 'a option that returns the last element of a list. (easy) *)
let rec last : 'a list -> 'a option = function
  | [] -> None
  | [h] -> Some h
  | h::t -> last t;;

assert(last [] = None);;
assert(last [1; 2; 3] = Some 3);;

(* 2. Find the last but one (last and penultimate) elements of a list. (easy) *)
let rec last_two: 'a list -> ('a * 'a) option
  = function
  | [] -> None
  | [a;b] -> Some (a, b)
  | h::t -> last_two t;;

assert(last_two [] = None);;
assert(last_two ["a"] = None);;
assert(last_two [ "a" ; "b" ; "c" ; "d"  ] = Some ("c", "d"));;

(* 3. Find the k'th element of a list. (easy) *)
let rec at : int -> 'a list -> 'a option
  = fun k l ->
    match l with
    | [] -> None
    | h::t -> if k = 1 then Some h else at (k-1) t;;

assert(at 3 [ "a"; "b"; "c"; "d"; "e"  ] = Some "c");;
assert(at 3 [ "a" ] = None);;

(* 4. Find the number of elements of a list. (easy) *)
let rec length : 'a list -> int
  = function
    | [] -> 0
    | h::t -> 1 + (length t);;

assert(length [ "a" ; "b" ; "c" ] = 3);;
assert(length [] = 0);;
