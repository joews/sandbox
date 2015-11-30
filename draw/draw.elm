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
  , weight: Float
  }

initialModel: Model
initialModel = 
  { drawActions = []
  , color = black
  , weight = 2
  }

-- Update

-- TODO
-- MouseUp action should clear the current move state.
type Action 
  = Move Drawing 
  | Click Drawing

-- TODO Perhaps Path needs to take Maybe Coords, so a path is only
--  drawn in the case where both ends are present. I'm thinking:
-- (None, Just Path) -> start state. draw nothing.                            
-- (Just Path, Just Path) -> If the points are identical, draw a point. Otherwise draw a segment.
type Drawing
  = Point Coords
  | Path (Coords, Coords)

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
  --|> Signal.sampleOn Mouse.position
  |> Signal.filter snd ((0, 0), False)
  |> Signal.map fst
  |> Signal.foldp collectMoves (Path ((0,0), (0,0)))

-- TODO I know that this is always Path - how to we avoid covering
--  the Point case? Or is it useful for setting up the foldp?
collectMoves: Coords -> Drawing -> Drawing
collectMoves coords lastPath =
  case lastPath of 
    Path (a, b) -> Path (b, coords)
    Point a -> Path (a, a)

-- Update

update : Action -> Model -> Model
update action model =
  case action of
    -- TODO distinct click (draw point) and move (draw path) actions
    Move  drawing  -> { model | drawActions = drawing :: model.drawActions }
    Click drawing  -> { model | drawActions = drawing :: model.drawActions }
    

state : Signal Model
state = Signal.foldp update initialModel actions
  
-- View
windowToCollage : Coords -> Coords -> (Float, Float)
windowToCollage (w, h) (x, y) =
  (toFloat x - toFloat w / 2, toFloat h / 2 - toFloat y)

lineStyle : Model -> LineStyle
lineStyle model = 
  let 
      style = solid model.color
  in
    { style | width = model.weight }

scene : Model -> Coords -> Element
scene model (w, h) =
  let 
      xy = windowToCollage (w, h)

      draw drawing =
        case drawing of
          Point p -> 
            circle (model.weight / 2)
            |> filled model.color
            |> move (xy p)

          Path (start, end) ->
            segment (xy start) (xy end)
            |> traced (lineStyle model)
  in
    collage w h  (List.map draw model.drawActions)


-- Go!

main : Signal Element
main =
  Signal.map2 scene state Window.dimensions
