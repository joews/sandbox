import Html exposing (text)
import Color exposing (..)
import Graphics.Collage exposing (..)
import Graphics.Element exposing (..)
import Window
import Mouse

-- Simple Draw program - draw circles when the mouse is down

-- TODO stateful model
color = black
radius = 2
     
main : Signal Element
main =
  Signal.map2 scene Window.dimensions updates
  
-- Only pass through mouse position where the mouse is down
-- This works but adding then removing Mouse.isDown feels 
--  a little clunky. Perhaps there is a neater way.
--  - maybe signal.merge with a union type?
mouseState: Signal (Int, Int)
mouseState = 
  Signal.map2 (\(x, y) isDown -> (x, y, isDown)) Mouse.position Mouse.isDown
  |> Signal.filter (\(x, y, isDown) -> isDown) (0, 0, False)
  |> Signal.map (\(x, y, isDown) -> (x, y))
  
updates : Signal (List (Int, Int))  
updates = Signal.foldp (::) [] mouseState
  
scene : (Int, Int) -> List (Int, Int) -> Element
scene (w, h) coords =
  -- TODO interpolate if the pixels are not juxtaposed
  let draw (x, y) = 
    circle radius
    |> filled color
    |> move (toFloat x - toFloat w / 2, toFloat h / 2 - toFloat y)
  in
    collage w h (List.map draw coords)
