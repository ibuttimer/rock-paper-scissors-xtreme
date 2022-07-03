/**
    Configuration override example
    @author Ian Buttimer
*/

// Set assets base relative to current folder
localStorage.setItem('ASSETS_BASE_URL', '../../assets/');

/* Use '0' to disable and '1' to enable.
   Note: If the value passed as the first parameter is omitted or is 0, -0, null, false, NaN, undefined, 
   or the empty string (""), the object has an initial value of false. All other values, including any object, 
   an empty array ([]), or the string "false", create an object with an initial value of true.
   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean */
localStorage.setItem('ENABLE_LOG', '0');

/* Set the game variant parameter, possible values are:
    'Basic' - basic variant
    'BigBang' - big bang variant
    'Xtreme' - xtreme variant
*/
localStorage.setItem('VARIANT', 'Basic');
/** Set the number of players parameter, @see {@link globals.js} MIN_PLAYERS/MAX_PLAYERS */
localStorage.setItem('NUM_PLAYERS', '3');
/** Set the number of players parameter, @see {@link globals.js} MIN_ROBOTS/MAX_ROBOTS */
localStorage.setItem('NUM_ROBOTS', '1');
/** Set the number of players parameter, @see {@link globals.js} MIN_GAMES/MAX_GAMES */
localStorage.setItem('NUM_GAMES', '5');

/* Set the game mode, possible values are:
    'live' - GameMode.Live
    'test' - GameMode.Test
    'demo' - GameMode.Demo
    'managed' - GameMode.Managed
*/
localStorage.setItem('MODE', 'demo');

/* Set the initial view, possible values are:
    'params' - params view
    'play' - play view
    'control' - view displayed is result of processing 'INPUT'
    'rules' - rules view
*/
localStorage.setItem('VIEW', 'params');

/* Player input, a comma-separated list of game key characters. Possible values are:
    alpha chars, 'esc', 'alt', 'ctrl', 'meta', 'shift' and modified alpha chars i.e. '{modifier}+{char} e.g. 'ctrl+n'
    */
localStorage.setItem('INPUT', 'r,p,s');
