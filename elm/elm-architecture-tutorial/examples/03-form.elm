import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (onInput)
import String
import Regex exposing (regex)


main =
  Html.beginnerProgram
    { model = model
    , view = view
    , update = update
    }



-- MODEL


type alias Model =
  { name : String
  , password : String
  , passwordAgain : String
  }


model : Model
model =
  Model "" "" ""

validatePasswordChars: String -> Bool
validatePasswordChars password = 
  if not (Regex.contains (regex "[0-9]") password) then
    False
  else if not (Regex.contains (regex "[!£$%^&*()]") password) then
    False
  else
    True

   


-- UPDATE


type Msg
    = Name String
    | Password String
    | PasswordAgain String


update : Msg -> Model -> Model
update msg model =
  case msg of
    Name name ->
      { model | name = name }

    Password password ->
      { model | password = password }

    PasswordAgain password ->
      { model | passwordAgain = password }



-- VIEW


view : Model -> Html Msg
view model =
  div []
    [ input [ type_ "text", placeholder "Name", onInput Name ] []
    , input [ type_ "password", placeholder "Password", onInput Password ] []
    , input [ type_ "password", placeholder "Re-enter Password", onInput PasswordAgain ] []
    , viewValidation model
    ]


viewValidation : Model -> Html msg
viewValidation model =
  let
    (color, message) =
      if String.length model.password < 8 then
        ("red", "Password too short")
      else if not (validatePasswordChars model.password) then
        ("red", "Password must contain special characters and numbers")
      else if model.password /= model.passwordAgain then
        ("red", "Passwords do not match!")
      else
        ("green", "OK")
  in
    div [ style [("color", color)] ] [ text message ]
