-- Exercise 1: define bind to compose two "debuggable" functions Float -> (Float, String)

bind :: (Float -> (Float,String)) -> ((Float,String) -> (Float,String))
bind f' (gx, gs) = let (fx, fs) = f' gx in (fx, gs ++ "; " ++ fs)

-- Test exercise 1
times2 :: Float -> (Float, String)
times2 x = (2 * x, "called times2")

inc :: Float -> (Float, String)
inc x = (1 + x, "called inc")


main =
  let (_, composed_debug) = bind times2 (inc 1)
  in putStrLn composed_debug
