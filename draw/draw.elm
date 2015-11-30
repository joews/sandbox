module Draw where

import Color exposing (..)
import Graphics.Collage exposing (..)
import Graphics.Element exposing (..)
import Window
import Mouse

-- Model

type alias Coords = (Int, Int)

type alias Model = 
  { drawActions: List Drawing
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
  = Move Drawing 
  | Click Drawing

type Drawing
  = Point Coords

actions: Signal Action
actions = 
  Signal.mergeMany 
    [ Signal.map Move mouseDrag
    , Signal.map Click clicks
    ]

clicks: Signal Drawing
clicks = 
  Signal.sampleOn Mouse.clicks Mouse.position
  |> Signal.map Point

-- Only pass through mouse position where the mouse is down
mouseDrag: Signal Drawing
mouseDrag = 
  Signal.map2 (,) Mouse.position Mouse.isDown
  |> Signal.filter snd ((0, 0), False)
  |> Signal.map (Point << fst)
 

-- Update
-- Trying to understand what StartApp.Simple does.

update : Action -> Model -> Model
update action model =
  case action of
    -- TODO distinct click (draw point) and move (draw path) actions
    Move  drawing  -> { model | drawActions = drawing :: model.drawActions }
    Click drawing  -> { model | drawActions = drawing :: model.drawActions }
    

state : Signal Model
state = Signal.foldp update initialModel actions
  
-- View
scene : Model -> Coords -> Element
scene { color, radius, drawActions } (w, h) =
  -- TODO interpolate if the pixels are not juxtaposed
  let draw drawing =
    case drawing of
      Point (x, y) -> 
        circle radius
        |> filled color
        |> move (toFloat x - toFloat w / 2, toFloat h / 2 - toFloat y)
  in
    collage w h  (List.map draw drawActions)


-- Go!

main : Signal Element
main =
  Signal.map2 scene state Window.dimensions
