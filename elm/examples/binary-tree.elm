{-----------------------------------------------------------------
http://elm-lang.org/examples/binary-tree

Binary tree example with my attempts at the challenges

A "Tree" represents a binary tree. A "Node" in a binary tree
always has two children. A tree can also be "Empty". Below I have
defined "Tree" and a number of useful functions.

This example also includes some challenge problems :)

-----------------------------------------------------------------}

import Graphics.Element exposing (..)
import Text


type Tree a
    = Empty
    | Node a (Tree a) (Tree a)


empty : Tree a
empty =
    Empty


singleton : a -> Tree a
singleton v =
    Node v Empty Empty


insert : comparable -> Tree comparable -> Tree comparable
insert x tree =
    case tree of
      Empty ->
          singleton x

      Node y left right ->
          if x > y then
              Node y left (insert x right)

          else if x < y then
              Node y (insert x left) right

          else
              tree


fromList : List comparable -> Tree comparable
fromList xs =
    List.foldl insert empty xs


depth : Tree a -> Int
depth tree =
    case tree of
      Empty -> 0
      Node v left right ->
          1 + max (depth left) (depth right)


map : (a -> b) -> Tree a -> Tree b
map f tree =
    case tree of
      Empty -> Empty
      Node v left right ->
          Node (f v) (map f left) (map f right)


t1 = fromList [1,2,3]
t2 = fromList [2,1,3]


main : Element
main =
    flow down
        [ 
        -- example functions
        -- display "depth" depth t1
        --, display "depth" depth t2
        --, display "map ((+)1)" (map ((+)1)) t2
        
        -- standalone functions
          display "sum" sum t1
        , display "flatten" flatten t2
        , display "contains" (contains 2) t1
        , display "contains" (contains 5) t1
        
        -- with fold
        , display "sum'" sum' t1
        , display "flatten'" flatten' t2
        , display "contains'" (contains' 2) t1
        , display "contains'" (contains' 5) t1
        ]


display : String -> (Tree a -> b) -> Tree a -> Element
display name f value =
    name ++ " (" ++ toString value ++ ") &rArr;\n    " ++ toString (f value) ++ "\n "
        |> Text.fromString
        |> Text.monospace
        |> leftAligned


{-----------------------------------------------------------------

Exercises:

(1) Sum all of the elements of a tree.

       sum : Tree number -> number

(2) Flatten a tree into a list.

       flatten : Tree a -> List a

(3) Check to see if an element is in a given tree.

       isElement : a -> Tree a -> Bool

(4) Write a general fold function that acts on trees. The fold
    function does not need to guarantee a particular order of
    traversal.

       fold : (a -> b -> b) -> b -> Tree a -> b

(5) Use "fold" to do exercises 1-3 in one line each. The best
    readable versions I have come up have the following length
    in characters including spaces and function name:
      sum: 16
      flatten: 21
      isElement: 46
    See if you can match or beat me! Don't forget about currying
    and partial application!

(6) Can "fold" be used to implement "map" or "depth"?

(7) Try experimenting with different ways to traverse a
    tree: pre-order, in-order, post-order, depth-first, etc.
    More info at: http://en.wikipedia.org/wiki/Tree_traversal

-----------------------------------------------------------------}



-- 1. sum
sum : Tree number -> number
sum tree =
  case tree of
    Empty -> 0
    Node v left right ->
      v + sum(left) + sum(right)

-- 2. flatten
flatten : Tree a -> List a
flatten tree =
  case tree of
    Empty -> []
    Node v left right -> [v] ++ (flatten left) ++ (flatten right)


-- 3. contains
contains : a -> Tree a -> Bool
contains el tree =
  case tree of
    Empty -> False
    Node v left right ->
      if(v == el) then True
      else (contains el left) || (contains el right)
      

--4. fold        
fold : (a -> b -> b) -> b -> Tree a -> b
fold fn acc tree =
  case tree of
    Empty -> acc
    Node v left right ->
      -- root, left, right
      --fold fn (fold fn (fn v acc) left) right
      
      -- left, root, right
      -- fold fn (fn v (fold fn acc left)) right
      
      -- right, root, left
      -- fold fn (fn v (fold fn acc right)) left
      
      -- right, left, root
      fn v (fold fn (fold fn acc right) left)

-- first attempts
-- sum' : Tree number -> number
-- sum' tree = fold (\a b -> a + b) 0 tree

-- flatten' : Tree a -> List a
-- flatten' tree = fold (::) [] tree

-- shorter with partial application
--  and using operators for fold function
sum' : Tree number -> number
sum' = fold (+) 0

flatten' : Tree a -> List a
flatten' = fold (::) []

contains' : a -> Tree a -> Bool
contains' a = fold (\v b -> b || v == a) False

-- map 
-- I think map cannot be done because we don't know the initial value of `acc`

-- depth
-- I think depth cannot be done because we need a way to take either the left or the right branch. `fold` indiscriminately includes the values from every node.


