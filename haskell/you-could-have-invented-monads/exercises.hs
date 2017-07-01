import Test.Hspec

-- Exercise 1: define bind to compose two "debuggable" functions Float -> (Float, String)
bind :: (Float -> (Float,String)) -> ((Float,String) -> (Float,String))
bind f' (gx, gs) = let (fx, fs) = f' gx in (fx, gs ++ "; " ++ fs)

-- Test exercise 1
times2 :: Float -> (Float, String)
times2 x = (2 * x, "called times2")

inc :: Float -> (Float, String)
inc x = (1 + x, "called inc")

-- Exercise 2: define unit to create a "debuggable" value
unit :: Float -> (Float, String)
unit f = (f, "")

-- define lift to create a "debuggable" function
lift :: (Float -> Float) -> (Float -> (Float, String))
lift f = unit . f

-- Exercise 3: show that lift f * lift g = lift (f.g)
-- a*b is defined to be bind a.b
-- so:
-- bind (lift f) . (lift g) = lift (f.g)

-- Run as unit tests
-- The $ operator avoids parentheses. Code after it has higher precendence
-- than code before it.
main = hspec $ do
  describe "bind" $ do
    it "composes 'debuggable' functions" $ do
      (bind times2 (inc 1)) `shouldBe` (4, "called inc; called times2")
