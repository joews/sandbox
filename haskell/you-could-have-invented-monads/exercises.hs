import Test.Hspec

-- Exercise 1: define bind to compose two "debuggable" functions Float -> (Float, String)
bind :: (Float -> (Float,String)) -> ((Float,String) -> (Float,String))
bind f' (gx, gs) = let (fx, fs) = f' gx in (fx, gs ++ fs)

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

-- Exercise 3: show that lift f' * lift g' = lift (f'.g')
-- a*b is defined to be bind a.b
--
-- * bind lift f' -- "a function that can be called with a debuggable result to get a combined debuggable result"
-- * bind lift f' . g' -- "a function that can be called with the input to g' to get a combined debuggable result"
-- * f' . g' -- "a "
-- so:
-- TODO with pen and paper
--

f :: Float -> Float
f x = x + 1

g :: Float -> Float
g x = x * 2

test_bind = hspec $ do
  describe "bind" $ do
    it "composes 'debuggable' functions" $ do
      (bind times2 (inc 1)) `shouldBe` (4, "called inccalled times2")

test_lift = hspec $ do
  describe "lift" $ do
    it "wraps a function to be 'debuggable'" $ do
      let double x = 2 * x
          lifted_double = lift double
      (lifted_double 4) `shouldBe` (8, "")

test_identity = hspec $ do
  describe "lift f * lift g = lift (f.g)" $ do
    it "describes the relation between bind and lift" $ do
      let lhs = bind (lift f) . (lift g)
          rhs = lift (f.g)
      (bind (lift f) ((lift g) 1)) `shouldBe` (3, "")
      (lhs 1) `shouldBe` (3, "")
      (rhs 1) `shouldBe` (lhs 1)

-- Run as unit tests
-- The $ operator avoids parentheses. Code after it has higher precendence
-- than code before it.
main = do
  test_bind
  test_lift
  test_identity
