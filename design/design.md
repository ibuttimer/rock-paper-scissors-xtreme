
# Strategy
The strategy is to create a website allowing the user to play variations of the game Rock, Paper, Scissors. It will allow the user to play in an entertaining and visually pleasing environment.

# Scope
The scope of the project will be to allow the user to:
- Play different variants of the game:
  - Basic

      The original version of the the game with 3 selection options; Rock, Paper and Scissors.

      [Basic rules](#basic-rules)

  - Big Bang

      The expanded version of the game invented by [Sam Kass](https://bigbangtheory.fandom.com/wiki/Sam_Kass) and made popular by the TV sitcom [The Bug Bang Theory](https://www.imdb.com/title/tt0898266/) with 5 selection options; Rock, Paper, Scissors, Lizard and Spock.
      
      [Big Bang rules](#big-bang-rules)

  - Xtreme

      An extreme version of the game suggested in [Winning at Rock-Paper-Scissors… Lizard-Spock!](https://www.naturphilosophie.co.uk/winning-rock-paper-scissors-lizard-spock/) with 9 selection options; Rock, Paper, Scissors, Lizard, Spock, Spiderman, Batman, Wizard and Glock.
      
      [Xtreme rules](#xtreme-rules)

- Play against the computer
- Play in multi-player mode

    [Multi-player rules](#multi-player-rules)

- Maintain players scores


## User Stories
As a user:
- I want to understand the purpose of the site.
- I want to be able to easily navigate the site.
- I want to find the site visually pleasing.
- I want to want be able to view the site on a variety of devices and screen sizes.
- I want to want be able to select the game variant to play.
- I want to want be able to play the game using mouse and/or keyboard.
- I want to want be able to see my score.
- I want to want be able to set my player name.

# Structure

# Skeleton
The website will consist of

# General layout

# Wireframes
Wireframes of page layouts are as followings:

## Home page

The Home page will have the following features:
- 

### Large screen

### Medium screen

### Small screen


# UX Surface
## Font
The font used for title text will be [??]() from Google fonts. 
The font used for paragraph text will be [??]() from Google fonts.

```css
```



## Colour Scheme

## UX Elements

## Accessibility
The guidelines outlined in the following will be followed:

- [W3C - Using ARIA](https://www.w3.org/TR/using-aria/)
- [TPGi - Short note on aria-label, aria-labelledby, and aria-describedby](https://www.tpgi.com/short-note-on-aria-label-aria-labelledby-and-aria-describedby/)

# Resources

# To Do

# Changes


# Appendix
## Basic rules
__Number of selections:__ 3

__Selections:__ Rock, Paper, Scissors

__Win matrix__:

|          | `Rock`    | `Paper`   | `Scissors` | Description |
|----------|:-------:|:-------:|:--------:|-------------|
| `Rock`     |   -     | &cross; | &check;  | `Rock` blunts `Scissors` |
| `Paper`    | &check; |   -     | &cross;  | `Paper` covers `Rock` |
| `Scissors` | &cross; | &check; |    -     | `Scissors` cuts `Paper` |

See [The Official Rules of Rock Paper Scissors](https://wrpsa.com/the-official-rules-of-rock-paper-scissors/).

## Big Bang rules
__Number of selections:__ 5

__Selections:__ Rock, Paper, Scissors, Lizard, Spock

__Win matrix__:

|          | `Rock`    | `Paper`   | `Scissors` | `Lizard`  | `Spock`   | Description |
|----------|:-------:|:-------:|:--------:|:-------:|:-------:|-------------|
| `Rock`     |   -     | &cross; | &check;  | &check; | &cross; | `Rock` blunts `Scissors`<br>`Rock` crushes `Lizard` |
| `Paper`    | &check; |   -     | &cross;  | &cross; | &check; | `Paper` covers `Rock`<br>`Paper` disproves `Spock` |
| `Scissors` | &cross; | &check; |    -     | &check; | &cross; | `Scissors` cuts `Paper`<br>`Scissors` decapitates `Lizard` |
| `Lizard`   | &cross; | &check; | &cross; |    -     | &check; | `Lizard` eats `Paper`<br>`Lizard` poisons `Spock` |
| `Spock`    | &check; | &cross; | &check; | &cross; |    -     | `Spock` vaporizes `Rock`<br>`Spock` smashes `Scissors` |

See [Rock, Paper, Scissors, Lizard, Spock](https://bigbangtheory.fandom.com/wiki/Rock,_Paper,_Scissors,_Lizard,_Spock).

## Xtreme rules
__Number of selections:__ 9

__Selections:__ Rock, Paper, Scissors, Lizard, Spock, `Spiderman`, `Batman`, `Wizard`, `Glock`

__Win matrix__:

|          | `Rock`  | `Paper`   | `Scissors` | `Lizard`  | `Spock`   | `Spiderman` | `Batman`  | `Wizard`  | `Glock`   | Description |
|----------|:-------:|:-------:|:--------:|:-------:|:-------:|:---------:|:-------:|:-------:|:-------:|-------------|
| `Rock`   |   -     | &cross; | &check;  | &check; | &cross; | &check;   | &cross; | &check; | &cross; | `Rock` blunts `Scissors`<br>`Rock` crushes `Lizard`<br>`Rock` knocks out `Spiderman`<br>`Rock` interrupts `Wizard` |
| `Paper`    | &check; |   -     | &cross;  | &cross; | &check; | &cross;   | &check; | &cross; | &check; | `Paper` covers `Rock`<br>`Paper` disproves `Spock`<br>`Paper` delays `Batman`<br>`Paper` jams `Glock` |
| `Scissors` | &cross; | &check; |    -     | &check; | &cross; | &check;   | &cross; | &check; | &cross; | `Scissors` cuts `Paper`<br>`Scissors` decapitates `Lizard`<br>`Scissors` cuts `Spiderman`<br>`Scissors` cuts `Wizard` |
| `Lizard`   | &cross; | &check; | &cross;  |    -    | &check; | &cross;   | &check; | &cross; | &check; | `Lizard` eats `Paper`<br>`Lizard` poisons `Spock`<br>`Lizard` confuses `Batman`<br>`Lizard` is too small for `Glock` |
| `Spock`    | &check; | &cross; | &check;  | &cross; |    -    | &check;   | &cross; | &check; | &cross; | `Spock` vaporizes `Rock`<br>`Spock` smashes `Scissors`<br>`Spock` befuddles `Spiderman`<br>`Spock` zaps `Wizard` |
| `Spiderman`| &cross; | &check; | &cross;  | &check; | &cross; |    -      | &cross; | &check; | &check; | `Spiderman` rips `Paper`<br>`Spiderman` defeats `Lizard`<br>`Spiderman` annoys `Wizard`<br>`Spiderman` disarms `Glock` |
| `Batman`   | &check; | &cross; | &check;  | &cross; | &check; | &check;   |    -    | &cross; | &cross; | `Batman` explodes `Rock`<br>`Batman` dismantles `Scissors`<br>`Batman` hangs `Spock`<br>`Batman` scares `Spiderman` |
| `Wizard`   | &cross; | &check; | &cross;  | &check; | &cross; | &cross;   | &check; |    -    | &check; | `Wizard` burns `Paper`<br>`Wizard` transforms `Lizard`<br>`Wizard` stuns `Batman`<br>`Wizard` melts `Glock` |
| `Glock`    | &check; | &cross; | &check;  | &cross; | &check; | &cross;   | &check; | &cross; |   -     | `Glock` breaks `Rock`<br>`Glock` dents `Scissors`<br>`Glock` shoots `Spock`<br>`Glock` kills `Batman`’s mum |

See [Winning at Rock-Paper-Scissors… Lizard-Spock!](https://www.naturphilosophie.co.uk/winning-rock-paper-scissors-lizard-spock/).

## Multi-player rules
- Everyone in the group plays a gesture.
- If all gestures are showing everyone plays again.
- Otherwise
  - Basic game

    If only 2 gestures are showing the players showing the greater gesture stay the other leave.

  - Big Bang/Xtreme game

    If one gesture was shown by more players, players showing a weaker gesture leave, other players remain.
    If 2 or more gestures were shown equally, everyone plays again.

Adapted from [How to Play Rock Paper Scissors with More than Two Players](https://wrpsa.com/how-to-play-rock-paper-scissors-with-more-than-two-players/)
