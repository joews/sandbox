module Draw where

import Html exposing (text)
import Color exposing (..)
import Graphics.Collage exposing (..)
import Graphics.Element exposing (..)
import Window
import Mouse

import Signal.Extra exposing (keepWhen, sampleWhen)

-- Model

color = black
radius = 2
    
-- TODO Window.dimensions as an Action
w = 1000
h = 1000

type alias Model = List (Int, Int)

initialModel: Model
initialModel = []

-- Update
type Action = Move (Int, Int) | Click (Int, Int)

mouseAction: Signal Action
mouseAction = 
    let 
        drag = Signal.map Move mouseDrag
        click = Signal.map Click clicks
    in Signal.merge drag click

clicks: Signal (Int, Int)
clicks = Signal.sampleOn Mouse.clicks Mouse.position

-- Only pass through mouse position where the mouse is down
-- I asked  http://stackoverflow.com/q/33976273/2806996 to see if 
--  there is a neater way of doing it. Answer: not really.
mouseDrag: Signal (Int, Int)
mouseDrag = 
  Signal.map2 (,) Mouse.position Mouse.isDown
  |> Signal.filter snd ((0, 0), False)
  |> Signal.map fst
 

-- Trying out some SO answers.
-- Signal.Extra.keepWhen is like my mouseDrag, but it filters out Mouse.position
--  updates with sampleOn.
mouseDrag': Signal (Int, Int)
mouseDrag' = keepWhen Mouse.isDown (0,0) Mouse.position

-- Signal.Extra.sampleWhen is analogous to my mouseDrag function.
mouseDrag'' : Signal (Int, Int)
mouseDrag'' = 
  sampleWhen Mouse.isDown (0, 0) Mouse.position


-- Update
-- Trying to understand what StartApp.Simple does.

update : Action -> Model -> Model
update action model =
  case action of
    -- TODO distinct click and move actions
    -- Really the move action should be a Signal for ((Int, Int), (Int, Int)
    --  that fires on move completion.
    Move pos -> pos :: model
    Click pos -> pos ::model

state : Signal Model
state = Signal.foldp update initialModel mouseAction
  
-- View
scene : Model -> Element
scene model =
  -- TODO interpolate if the pixels are not juxtaposed
  let draw (x, y) = 
    circle radius
    |> filled color
    |> move (toFloat x - toFloat w / 2, toFloat h / 2 - toFloat y)
  in
    collage 1000 1000  (List.map draw model)


-- Go!

main : Signal Element
main =
  Signal.map scene state
