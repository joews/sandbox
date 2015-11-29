module Draw where

import Color exposing (..)
import Graphics.Collage exposing (..)
import Graphics.Element exposing (..)
import Window
import Mouse

-- Model

type alias Model = 
  { drawActions: List (Int, Int)
  , color: Color
  , radius: Float
  }

initialModel: Model
initialModel = 
  { drawActions = []
  , color = black
  , radius = 2
  }


-- Update
type Action 
  = Move (Int, Int) 
  | Click (Int, Int)

actions: Signal Action
actions = 
  Signal.mergeMany 
    [ Signal.map Move mouseDrag
    , Signal.map Click clicks
    ]

clicks: Signal (Int, Int)
clicks = Signal.sampleOn Mouse.clicks Mouse.position

-- Only pass through mouse position where the mouse is down
mouseDrag: Signal (Int, Int)
mouseDrag = 
  Signal.map2 (,) Mouse.position Mouse.isDown
  |> Signal.filter snd ((0, 0), False)
  |> Signal.map fst
 

-- Update
-- Trying to understand what StartApp.Simple does.

update : Action -> Model -> Model
update action model =
  case action of
    -- TODO distinct click (draw point) and move (draw path) actions
    Move pos  -> { model | drawActions = pos :: model.drawActions }
    Click pos -> { model | drawActions = pos :: model.drawActions }
    

state : Signal Model
state = Signal.foldp update initialModel actions
  
-- View
scene : Model -> (Int, Int) -> Element
scene { color, radius, drawActions } (w, h) =
  -- TODO interpolate if the pixels are not juxtaposed
  let draw (x, y) = 
    circle radius
    |> filled color
    |> move (toFloat x - toFloat w / 2, toFloat h / 2 - toFloat y)
  in
    collage w h  (List.map draw drawActions)


-- Go!

main : Signal Element
main =
  Signal.map2 scene state Window.dimensions
