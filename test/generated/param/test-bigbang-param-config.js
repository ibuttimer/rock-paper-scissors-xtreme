/**
    Configuration override to generate big bang game variant params view
    @author Ian Buttimer
*/

// Set assets base relative to current folder
localStorage.setItem('ASSETS_BASE_URL', '../../../assets/');

/* Console logging, use '0' to disable and '1' to enable.
   Note: If the value passed as the first parameter is omitted or is 0, -0, null, false, NaN, undefined, 
   or the empty string (""), the object has an initial value of false. All other values, including any object, 
   an empty array ([]), or the string "false", create an object with an initial value of true.
   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean */
localStorage.setItem('ENABLE_LOG', '0');

/* Set the initial game parameters */
localStorage.setItem('VARIANT', 'BigBang');
localStorage.setItem('NUM_PLAYERS', '9');
localStorage.setItem('NUM_ROBOTS', '3');
localStorage.setItem('NUM_GAMES', '5');

/* Set the initial view, possible values are:
    'params' - params view
*/
localStorage.setItem('VIEW', 'params');
