module Draw where

import Html exposing (Html, text)
import Color exposing (..)
import Graphics.Collage exposing (..)
import Graphics.Element exposing (..)
import Window
import Mouse

import Debug


-- Model

type alias Model = 
  {
    drawActions: List (Int, Int)
  , w: Int
  , h: Int
  , color: Color
  , radius: Float
  }

initialModel: Model
initialModel = 
  { drawActions = []
  -- TODO how to set the initial window dimensions with foldp?
  -- It seems I may need to use a port or Signal.Extra.foldp'
  , w = 1000
  , h = 1000 
  , color = black
  , radius = 2
  }

-- Update
type Action 
  = Move (Int, Int) 
  | Click (Int, Int)
  | Resize (Int, Int)

actions: Signal Action
actions = 
    let 
        drag = Signal.map Move mouseDrag
        click = Signal.map Click clicks
        resize = Signal.map Resize Window.dimensions
    in Signal.mergeMany [drag, click, resize]

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
    Move pos -> { model | drawActions = pos :: model.drawActions }
    Click pos -> { model | drawActions = pos :: model.drawActions }
    Resize (w, h) -> { model | w = w, h = h  }
    

state : Signal Model
state = Signal.foldp update initialModel actions
  
-- View
scene : Model -> Element
scene { w, h, color, radius, drawActions } =
  -- TODO interpolate if the pixels are not juxtaposed
  let draw (x, y) = 
    circle radius
    |> filled color
    |> move (toFloat x - toFloat w / 2, toFloat h / 2 - toFloat y)
  in
    collage w h  (List.map draw drawActions)


-- Go!

--main : Signal Element
main =
  --Signal.map (\d -> Html.text <| toString d) Window.dimensions
  Signal.map scene state
