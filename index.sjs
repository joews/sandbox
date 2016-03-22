"use strict"

// |>
// Forward simple pipeline
// As proposed in https://github.com/mindeavor/es-pipeline-operator
operator (|>) 1 left { $arg, $fn }
	=> #{ $fn($arg) }

// <| 
// Reverse simple pipeline
operator (<|) 1 right { $fn, $arg }
  => #{ $fn($arg) }

// :>> 
// composition operator
operator (:>>) 1 left { $f, $g }
  => #{ (x) => $g($f(x)) }

// <<:
// composition operator
operator (<<:) 1 right { $f, $g } 
  => #{ (x) => $f($g(x)) }

// fn
// Named function statements with automatic partial application
macro fn {
  case { 
    _ $name($args (,) ...) { $body ... }
  } => {
    return #{
      function $name () {
        const innerFunction = (function ($args (,) ...) {
          $body...
        });
                
        // No Babel here yet.
        // Life was hard before spread/rest!
        const args = [].slice.call(arguments);
        const bind = (a) => innerFunction.bind.apply(innerFunction, [null].concat(a))
                
        return (args.length < innerFunction.length)
          ? bind(args)
          : innerFunction.apply(null, args);
       }
     }
  }
}



//
// Testing
//
fn add(a, b) {
  return a + b;
}

fn mul(a, b) {
  return a * b;
}

function log(x) {
	console.log(x);
}

const add1 = add(1);
const mul2 = mul(2);

add1(2) |> log;
add(10)(10) |> log;

const a = 2 
	|> add1 
  |> add1 
  |> x => x + 2;

console.log(a);

a |> log;

log <| a;
log <| add1 <| add1 <| 1

const f = add1 :>> mul2 :>> mul2
const g = add1 <<: mul2 <<: mul2;
console.log(f(2));
console.log(g(2));
