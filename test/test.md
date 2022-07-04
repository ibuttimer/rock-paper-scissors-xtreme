# Testing 

Test release: [QA Release V1.0.3](https://github.com/ibuttimer/rock-paper-scissors-xtreme/releases/tag/v1.0.3-qa)

The site was tested using the following methods:

## JavaScript Unit Testing 
Unit testing of JS game scripts was undertaken using [Jasmine](https://jasmine.github.io/).
The test scripts are located in the [spec](../spec/) folder.

The scripts may be run using [npm](https://www.npmjs.com) from the project root folder:
```shell
> npm test
```
Or if using Visual Studio Code, the [Jasmine Test Explorer
](https://marketplace.visualstudio.com/items?itemName=hbenl.vscode-jasmine-test-adapter), allows tests to be run from the sidebar of Visual Studio Code.

## Manual 
The site was manually tested in the following browsers:

|   | Browser | OS | 
|---|---------|----|
| 1 | Google Chrome, Version 103.0.5060.53 | Windows 11 Pro Version 21H2 |
| 2 | Mozilla Firefox, Version 101.0.1 (64-bit) | Windows 11 Pro Version 21H2 |
| 3 | Opera, Version:88.0.4412.53 | Windows 11 Pro Version 21H2 |
| 4 | Google Chrome, Version 102.0.505.125 (portrait and landscape mode)| Android 10 |

Testing undertaken:

| Feature | Expected | Action | Related | Result | 
|---------|----------|--------|---------|--------|
| Navbar `Logo` | Clicking opens Landing page when 'Show start page' setting enabled| Click `Logo` button | All non-game-in-progress pages | ![pass](https://badgen.net/badge/checks/Pass/green) |
| Navbar `Logo` | Clicking opens Game Select page when 'Show start page' setting disabled| Click `Logo` button | All non-game-in-progress pages | ![pass](https://badgen.net/badge/checks/Pass/green) |
| Navbar `Logo` | Clicking opens abort game modal | Click `Logo` button | All game-in-progress pages | ![pass](https://badgen.net/badge/checks/Pass/green) |
| Navbar `Rules` | Clicking opens Rules page | Click `Logo` button | All non-game-in-progress pages | ![pass](https://badgen.net/badge/checks/Pass/green) |
| Navbar `Rules` | Clicking opens abort game modal | Click `Logo` button | All game-in-progress pages | ![pass](https://badgen.net/badge/checks/Pass/green) |
| Navbar hamburger | On small screens, navbar is replaced with hamburger menu | View page on small screen | All pages | ![pass](https://badgen.net/badge/checks/Pass/green) |
| Navbar `Settings` (desktop) | Hovering displays settings menu | Hover over `Settings` button | All pages | ![pass](https://badgen.net/badge/checks/Pass/green) |
| Navbar `Settings` (mobile) | Clicking displays settings menu | Click `Settings` button | All pages | ![pass](https://badgen.net/badge/checks/Pass/green) |
| Abort game modal | Clicking No returns to the game | Click `No` button | All game-in-progress pages | ![pass](https://badgen.net/badge/checks/Pass/green) |
| Abort game modal | Clicking Yes aborts game | Click `Yes` button | All game-in-progress pages | ![pass](https://badgen.net/badge/checks/Pass/green) |
| Game variant selection | Able to select different game variants | Select all variants and verify on play page | Game select page | ![pass](https://badgen.net/badge/checks/Pass/green) |
| Number of players selection | Able to set number of players | Select all options and verify on play page | Game params page | ![pass](https://badgen.net/badge/checks/Pass/green) |
| Number of robots selection | Able to set number of robots | Select all options and verify on play page | Game params page | ![pass](https://badgen.net/badge/checks/Pass/green) |
| Number of games selection | Able to set number of games | Select all options and verify on play page | Game params page | ![pass](https://badgen.net/badge/checks/Pass/green) |
| Player name entry | Able to set player names | Enter player names and verify on play page | Game params page | ![pass](https://badgen.net/badge/checks/Pass/green) |
| No duplicate player name entry | Unable to play game when duplicate player names entered | Enter duplicate player names | Game params page | ![pass](https://badgen.net/badge/checks/Pass/green) |
| Player selection | Players are able to make selection via mouse or keyboard | Make selection via mouse or keyboard | Play page | ![pass](https://badgen.net/badge/checks/Pass/green) |
| Active player selections | All active player can only make one selection per round | Make selection via mouse or keyboard | Play page | ![pass](https://badgen.net/badge/checks/Pass/green) |
| Eliminated player selections | Eliminated players are unable to make a selection | Make selection via mouse or keyboard | Play page | ![pass](https://badgen.net/badge/checks/Pass/green) |
| Play again result | After all active player have made a selection, the Play again result page is shown if there are no eliminations or winner | Make selection via mouse or keyboard | Play page | ![pass](https://badgen.net/badge/checks/Pass/green) |
| Elimination result | After all active player have made a selection, the Elimination result page is shown if there are eliminations | Make selection via mouse or keyboard | Play page | ![pass](https://badgen.net/badge/checks/Pass/green) |
| Winner result | After all active player have made a selection, the Winner result page is shown if there is a winner | Make selection via mouse or keyboard | Play page | ![pass](https://badgen.net/badge/checks/Pass/green) |
| Match over result | Match over result is shown correctly | Play match | Result page | ![pass](https://badgen.net/badge/checks/Pass/green) |
| Game progress | Game progress indicator correctly displays 'Best of'/'Game'/'Round' | Play multiple round match | Play/Result page | ![pass](https://badgen.net/badge/checks/Pass/green) |
| Leader board | Leader board correctly displays results | Play multiple round match | Result page | ![pass](https://badgen.net/badge/checks/Pass/green) |
| Animation setting | Animation is only show when 'Enable animation' setting is enabled and user has not turned off animation in the OS | Play game | Play/Result page | ![pass](https://badgen.net/badge/checks/Pass/green) |
| Sound setting | Sound is only played when 'Enable sound' setting is enabled | Play game | Play/Result page | ![pass](https://badgen.net/badge/checks/Pass/green) |
| Show start page setting | Landing page is displayed when 'Show start page' setting is enabled, otherwise Game Selection | Load site |  | ![pass](https://badgen.net/badge/checks/Pass/green) |
| Show selection keys setting | Selection keyboard keys are only displayed when 'Show selection keys' setting is enabled | Play game | Play page | ![pass](https://badgen.net/badge/checks/Pass/green) |
| External site links | Clicking opens correct external site in a new tab | Click each external site link | Rules pages | ![pass](https://badgen.net/badge/checks/Pass/green) |


## Responsiveness Testing

Responsiveness testing was done using Google Chrome Developer Tools Device Mode.

Testing undertaken:

| Feature | Expected | Action | Related | Result | 
|---------|----------|--------|---------|--------|
| Page responsiveness | Page content realigns/resizes when page resized  | Resize page | All pages | ![Pass](https://badgen.net/badge/checks/Pass/green) |

## Lighthouse

Lighthouse testing was carried out in an Incognito window using Lighthouse (Version 9.6.1) from Chrome Developer Tools.

> __Note:__ Only Accessibility and Best Practises testing was carried out on generated pages, as it is not possible to directly access those pages in normal usage.

| Page | Test | Result |  |  |  | Report |
|-|-|-|-|-|-|-|
| Landing | Mobile | ![Performance 93](https://img.shields.io/badge/Performance-93-brightgreen) | ![Accessibility 100](https://img.shields.io/badge/Accessibility-100-brightgreen) | ![Best Practises 100](https://img.shields.io/badge/Best%20Practises-100-brightgreen) | ![SEO 100](https://img.shields.io/badge/SEO-100-brightgreen) | [landing-mobile](https://ibuttimer.github.io/rock-paper-scissors-xtreme/test/lighthouse/landing-mobile.html) |
|     | Desktop | ![Performance 99](https://img.shields.io/badge/Performance-99-brightgreen) | ![Accessibility 100](https://img.shields.io/badge/Accessibility-100-brightgreen) | ![Best Practises 100](https://img.shields.io/badge/Best%20Practises-100-brightgreen) | ![SEO 100](https://img.shields.io/badge/SEO-100-brightgreen) | [landing-desktop](https://ibuttimer.github.io/rock-paper-scissors-xtreme/test/lighthouse/landing-desktop.html) |
| Main | Mobile | ![Performance 86](https://img.shields.io/badge/Performance-86-orange) | ![Accessibility 100](https://img.shields.io/badge/Accessibility-100-brightgreen) | ![Best Practises 100](https://img.shields.io/badge/Best%20Practises-100-brightgreen) | ![SEO 100](https://img.shields.io/badge/SEO-100-brightgreen) | [home-mobile](https://ibuttimer.github.io/rock-paper-scissors-xtreme/test/lighthouse/main-mobile.html) |
|     | Desktop | ![Performance 99](https://img.shields.io/badge/Performance-99-brightgreen) | ![Accessibility 100](https://img.shields.io/badge/Accessibility-100-brightgreen) | ![Best Practises 100](https://img.shields.io/badge/Best%20Practises-100-brightgreen) | ![SEO 100](https://img.shields.io/badge/SEO-100-brightgreen) | [home-desktop](https://ibuttimer.github.io/rock-paper-scissors-xtreme/test/lighthouse/main-desktop.html) |
| Params (Basic) | Mobile | n/a | ![Accessibility 100](https://img.shields.io/badge/Accessibility-100-brightgreen) | ![Best Practises 100](https://img.shields.io/badge/Best%20Practises-100-brightgreen) | n/a | [params-basic-mobile](https://ibuttimer.github.io/rock-paper-scissors-xtreme/test/lighthouse/params-basic-mobile.html) |
|     | Desktop | n/a | ![Accessibility 100](https://img.shields.io/badge/Accessibility-100-brightgreen) | ![Best Practises 100](https://img.shields.io/badge/Best%20Practises-100-brightgreen) | n/a | [params-basic-desktop](https://ibuttimer.github.io/rock-paper-scissors-xtreme/test/lighthouse/params-basic-desktop.html) |
| Params (BigBang) | Mobile | n/a | ![Accessibility 100](https://img.shields.io/badge/Accessibility-100-brightgreen) | ![Best Practises 100](https://img.shields.io/badge/Best%20Practises-100-brightgreen) | n/a | [params-bigbang-mobile](https://ibuttimer.github.io/rock-paper-scissors-xtreme/test/lighthouse/params-bigbang-mobile.html) |
|     | Desktop | n/a | ![Accessibility 100](https://img.shields.io/badge/Accessibility-100-brightgreen) | ![Best Practises 100](https://img.shields.io/badge/Best%20Practises-100-brightgreen) | n/a | [params-bigbang-desktop](https://ibuttimer.github.io/rock-paper-scissors-xtreme/test/lighthouse/params-bigbang-desktop.html) |
| Params (Xtreme) | Mobile | n/a | ![Accessibility 100](https://img.shields.io/badge/Accessibility-100-brightgreen) | ![Best Practises 100](https://img.shields.io/badge/Best%20Practises-100-brightgreen) | n/a | [params-xtreme-mobile](https://ibuttimer.github.io/rock-paper-scissors-xtreme/test/lighthouse/params-xtreme-mobile.html) |
|     | Desktop | n/a | ![Accessibility 100](https://img.shields.io/badge/Accessibility-100-brightgreen) | ![Best Practises 100](https://img.shields.io/badge/Best%20Practises-100-brightgreen) | n/a | [params-xtreme-desktop](https://ibuttimer.github.io/rock-paper-scissors-xtreme/test/lighthouse/params-xtreme-desktop.html) |
| Play (Basic) | Mobile | n/a | ![Accessibility 100](https://img.shields.io/badge/Accessibility-100-brightgreen) | ![Best Practises 100](https://img.shields.io/badge/Best%20Practises-100-brightgreen) | n/a | [play-basic-mobile](https://ibuttimer.github.io/rock-paper-scissors-xtreme/test/lighthouse/play-basic-mobile.html) |
|     | Desktop | n/a | ![Accessibility 100](https://img.shields.io/badge/Accessibility-100-brightgreen) | ![Best Practises 100](https://img.shields.io/badge/Best%20Practises-100-brightgreen) | n/a | [play-basic-desktop](https://ibuttimer.github.io/rock-paper-scissors-xtreme/test/lighthouse/play-basic-desktop.html) |
| Play (BigBang) | Mobile | n/a | ![Accessibility 100](https://img.shields.io/badge/Accessibility-100-brightgreen) | ![Best Practises 100](https://img.shields.io/badge/Best%20Practises-100-brightgreen) | n/a | [play-bigbang-mobile](https://ibuttimer.github.io/rock-paper-scissors-xtreme/test/lighthouse/play-bigbang-mobile.html) |
|     | Desktop | n/a | ![Accessibility 100](https://img.shields.io/badge/Accessibility-100-brightgreen) | ![Best Practises 100](https://img.shields.io/badge/Best%20Practises-100-brightgreen) | n/a | [play-bigbang-desktop](https://ibuttimer.github.io/rock-paper-scissors-xtreme/test/lighthouse/play-basic-desktop.html) |
| Play (Xtreme) | Mobile | n/a | ![Accessibility 100](https://img.shields.io/badge/Accessibility-100-brightgreen) | ![Best Practises 100](https://img.shields.io/badge/Best%20Practises-100-brightgreen) | n/a | [play-xtreme-mobile](https://ibuttimer.github.io/rock-paper-scissors-xtreme/test/lighthouse/play-xtreme-mobile.html) |
|     | Desktop | n/a | ![Accessibility 100](https://img.shields.io/badge/Accessibility-100-brightgreen) | ![Best Practises 100](https://img.shields.io/badge/Best%20Practises-100-brightgreen) | n/a | [play-xtreme-desktop](https://ibuttimer.github.io/rock-paper-scissors-xtreme/test/lighthouse/play-xtreme-desktop.html) |
| Result (Basic) | Mobile | n/a | ![Accessibility 100](https://img.shields.io/badge/Accessibility-100-brightgreen) | ![Best Practises 100](https://img.shields.io/badge/Best%20Practises-100-brightgreen) | n/a | [result-basic-mobile](https://ibuttimer.github.io/rock-paper-scissors-xtreme/test/lighthouse/result-basic-mobile.html) |
|     | Desktop | n/a | ![Accessibility 100](https://img.shields.io/badge/Accessibility-100-brightgreen) | ![Best Practises 100](https://img.shields.io/badge/Best%20Practises-100-brightgreen) | n/a | [result-basic-desktop](https://ibuttimer.github.io/rock-paper-scissors-xtreme/test/lighthouse/result-basic-desktop.html) |
| Result (BigBang) | Mobile | n/a | ![Accessibility 100](https://img.shields.io/badge/Accessibility-100-brightgreen) | ![Best Practises 100](https://img.shields.io/badge/Best%20Practises-100-brightgreen) | n/a | [result-bigbang-mobile](https://ibuttimer.github.io/rock-paper-scissors-xtreme/test/lighthouse/result-bigbang-mobile.html) |
|     | Desktop | n/a | ![Accessibility 100](https://img.shields.io/badge/Accessibility-100-brightgreen) | ![Best Practises 100](https://img.shields.io/badge/Best%20Practises-100-brightgreen) | n/a | [result-bigbang-desktop](https://ibuttimer.github.io/rock-paper-scissors-xtreme/test/lighthouse/result-basic-desktop.html) |
| Result (Xtreme) | Mobile | n/a | ![Accessibility 100](https://img.shields.io/badge/Accessibility-100-brightgreen) | ![Best Practises 100](https://img.shields.io/badge/Best%20Practises-100-brightgreen) | n/a | [result-xtreme-mobile](https://ibuttimer.github.io/rock-paper-scissors-xtreme/test/lighthouse/result-xtreme-mobile.html) |
|     | Desktop | n/a | ![Accessibility 100](https://img.shields.io/badge/Accessibility-100-brightgreen) | ![Best Practises 100](https://img.shields.io/badge/Best%20Practises-100-brightgreen) | n/a | [result-xtreme-desktop](https://ibuttimer.github.io/rock-paper-scissors-xtreme/test/lighthouse/result-xtreme-desktop.html) |
| Win (Basic) | Mobile | n/a | ![Accessibility 100](https://img.shields.io/badge/Accessibility-100-brightgreen) | ![Best Practises 100](https://img.shields.io/badge/Best%20Practises-100-brightgreen) | n/a | [win-basic-mobile](https://ibuttimer.github.io/rock-paper-scissors-xtreme/test/lighthouse/win-basic-mobile.html) |
|     | Desktop | n/a | ![Accessibility 100](https://img.shields.io/badge/Accessibility-100-brightgreen) | ![Best Practises 100](https://img.shields.io/badge/Best%20Practises-100-brightgreen) | n/a | [win-basic-desktop](https://ibuttimer.github.io/rock-paper-scissors-xtreme/test/lighthouse/win-basic-desktop.html) |
| Win (BigBang) | Mobile | n/a | ![Accessibility 100](https://img.shields.io/badge/Accessibility-100-brightgreen) | ![Best Practises 100](https://img.shields.io/badge/Best%20Practises-100-brightgreen) | n/a | [win-bigbang-mobile](https://ibuttimer.github.io/rock-paper-scissors-xtreme/test/lighthouse/win-bigbang-mobile.html) |
|     | Desktop | n/a | ![Accessibility 100](https://img.shields.io/badge/Accessibility-100-brightgreen) | ![Best Practises 100](https://img.shields.io/badge/Best%20Practises-100-brightgreen) | n/a | [win-bigbang-desktop](https://ibuttimer.github.io/rock-paper-scissors-xtreme/test/lighthouse/win-bigbang-desktop.html) |
| Win (Xtreme) | Mobile | n/a | ![Accessibility 100](https://img.shields.io/badge/Accessibility-100-brightgreen) | ![Best Practises 100](https://img.shields.io/badge/Best%20Practises-100-brightgreen) | n/a | [win-xtreme-mobile](https://ibuttimer.github.io/rock-paper-scissors-xtreme/test/lighthouse/win-xtreme-mobile.html) |
|     | Desktop | n/a | ![Accessibility 100](https://img.shields.io/badge/Accessibility-100-brightgreen) | ![Best Practises 100](https://img.shields.io/badge/Best%20Practises-100-brightgreen) | n/a | [win-xtreme-desktop](https://ibuttimer.github.io/rock-paper-scissors-xtreme/test/lighthouse/win-xtreme-desktop.html) |
| Rules | Mobile | n/a | ![Accessibility 100](https://img.shields.io/badge/Accessibility-100-brightgreen) | ![Best Practises 100](https://img.shields.io/badge/Best%20Practises-100-brightgreen) | n/a | [rules-mobile](https://ibuttimer.github.io/rock-paper-scissors-xtreme/test/lighthouse/rules-mobile.html) |
|     | Desktop | n/a | ![Accessibility 100](https://img.shields.io/badge/Accessibility-100-brightgreen) | ![Best Practises 100](https://img.shields.io/badge/Best%20Practises-100-brightgreen) | n/a | [rules-desktop](https://ibuttimer.github.io/rock-paper-scissors-xtreme/test/lighthouse/rules-desktop.html) |

The report JSON files in [test/lighthouse](https://github.com/ibuttimer/rock-paper-scissors-xtreme/tree/main/test/lighthouse) may be viewed in [Lighthouse Report Viewer](https://googlechrome.github.io/lighthouse/viewer/).

## Accessibility
Accessibility testing was carried out using the [NVDA](https://www.nvaccess.org/) and [ChromeVox](https://chrome.google.com/webstore/detail/screen-reader/kgejglhpjiefppelpmljglcjbhoiplfn?hl=en) screen readers.

Testing undertaken:

| Feature | Expected | Action | Related | Result | 
|---------|----------|--------|---------|--------|
| Audio commentary | Audio commentary provided for important page elements | Process page using screen reader | All pages | ![PAss](https://badgen.net/badge/checks/Pass/green) |


## User
User testing was carried out and feedback was captured via a [Google Forms survey](https://docs.google.com/forms/d/1SO9qN_aum_g_rl7dZ68FtFslqEyq_DlLCoU3CQmVhPY/viewanalytics).


## Validator Testing 

The [W3C Nu Html Checker](https://validator.w3.org/nu/) was utilised to check the HTML validity, while the [W3C CSS Validation Service](https://jigsaw.w3.org/css-validator/) was utilised to check the CSS validity with respect to [CSS level 3 + SVG](https://www.w3.org/Style/CSS/current-work.html.)

As the `main` content of the site is generated via JavaScript, it was not possible to simply use the site url to perform the validator testing.
The following procedure was utilised to validate the JavaScript-generated content:
- Load the desired view in an Incognito window in Google Chrome.
- Open Developer Tools (Ctrl+Shift+I).
- In the `Elements` tab, select the `<html lang="en">` line.
- Right-click and select `Copy -> Copy outerHTML`.
  > __Note:__ The copied text does not contain the required `<!DOCTYPE html>` from the first line of [index.html](../index.html).

- The copied text may be validated, using one of the following methods:
  1. Paste the copied text into the [Check by text input](https://validator.w3.org/nu/#textarea) option of the [W3C Nu Html Checker](https://validator.w3.org/nu/), adding `<!DOCTYPE html>` as the first line..
  2. Save the copied text to a new file, e.g. [main-raw.html](generated/main/main-raw.html), and add `<!DOCTYPE html>` as the first line. Validate the file using the [Check by file upload](https://validator.w3.org/nu/#file) option of the [W3C Nu Html Checker](https://validator.w3.org/nu/).
  3. Host the file created in step 2, in an appropriate location and validate using the [Check by address](https://validator.w3.org/nu/) option of the [W3C Nu Html Checker](https://validator.w3.org/nu/).

        In order to utilise this method, the following additional steps are required:
        - Create a configuration override script as detailed in [Local storage override](../README.md#local-storage-override). See [test-config.js](generated/test-config.js).
        - Run the [Node.js](https://nodejs.org/) script [adjust.cjs](generated/adjust.cjs) using the command `node adjust.cjs <project root path> <input.html> <output.html> <config.js>`. This will adjust the relative paths in _input.html_ and inject the required configuration override script prior to [script.js](../assets/js/script.js) being loaded. The resultant file is saved as _output.html_. This will ensure that the hosted _output.html_ will display correctly. 

          E.g. run the following command from the [test/generated/main](generated/main) folder to generate `main.html`

          ```bash
          node ../adjust.cjs ../../../ main-raw.html main.html test-main-config.js
          ```

The [W3C Nu Html Checker](https://validator.w3.org/nu/) was utilised to check the HTML validity, while the [W3C CSS Validation Service](https://jigsaw.w3.org/css-validator/) was utilised to check the CSS validity with respect to [CSS level 3 + SVG](https://www.w3.org/Style/CSS/current-work.html.)

| Page | HTML | HTML Result | CSS | CSS Result |
|------|------|-------------|-----|------------|
| Landing | [W3C validator](https://validator.w3.org/nu/?showsource=yes&doc=https%3A%2F%2Fibuttimer.github.io%2Frock-paper-scissors-xtreme%2Ftest%2Fgenerated%2Flanding%2Flanding.html) | ![pass](https://badgen.net/badge/checks/Pass/green) | [(Jigsaw) validator](https://jigsaw.w3.org/css-validator/validator?uri=https%3A%2F%2Fibuttimer.github.io%2Frock-paper-scissors-xtreme%2Ftest%2Fgenerated%2Flanding%2Flanding.html&profile=css3svg&usermedium=all&warning=1&vextwarning=&lang=en) | ![pass](https://badgen.net/badge/checks/Pass/green) |
| Main | [W3C validator](https://validator.w3.org/nu/?showsource=yes&doc=https%3A%2F%2Fibuttimer.github.io%2Frock-paper-scissors-xtreme%2Ftest%2Fgenerated%2Fmain%2Fmain.html) | ![pass](https://badgen.net/badge/checks/Pass/green) | [(Jigsaw) validator](https://jigsaw.w3.org/css-validator/validator?uri=https%3A%2F%2Fibuttimer.github.io%2Frock-paper-scissors-xtreme%2Ftest%2Fgenerated%2Fmain%2Fmain.html&profile=css3svg&usermedium=all&warning=1&vextwarning=&lang=en) | ![pass](https://badgen.net/badge/checks/Pass/green) |
| Basic Params | [W3C validator](https://validator.w3.org/nu/?showsource=yes&doc=https%3A%2F%2Fibuttimer.github.io%2Frock-paper-scissors-xtreme%2Ftest%2Fgenerated%2Fparam%2Fbasic-param.html) | ![pass](https://badgen.net/badge/checks/Pass/green) | [(Jigsaw) validator](https://jigsaw.w3.org/css-validator/validator?uri=https%3A%2F%2Fibuttimer.github.io%2Frock-paper-scissors-xtreme%2Ftest%2Fgenerated%2Fparam%2Fbasic-param.html&profile=css3svg&usermedium=all&warning=1&vextwarning=&lang=en) | ![pass](https://badgen.net/badge/checks/Pass/green) |
| Basic Play | [W3C validator](https://validator.w3.org/nu/?showsource=yes&doc=https%3A%2F%2Fibuttimer.github.io%2Frock-paper-scissors-xtreme%2Ftest%2Fgenerated%2Fplay%2Fbasic-play.html) | ![pass](https://badgen.net/badge/checks/Pass/green) | [(Jigsaw) validator](https://jigsaw.w3.org/css-validator/validator?uri=https%3A%2F%2Fibuttimer.github.io%2Frock-paper-scissors-xtreme%2Ftest%2Fgenerated%2Fplay%2Fbasic-play.html&profile=css3svg&usermedium=all&warning=1&vextwarning=&lang=en) | ![pass](https://badgen.net/badge/checks/Pass/green) |
| Basic Result | [W3C validator](https://validator.w3.org/nu/?showsource=yes&doc=https%3A%2F%2Fibuttimer.github.io%2Frock-paper-scissors-xtreme%2Ftest%2Fgenerated%2Fresult%2Fbasic-result.html) | ![pass](https://badgen.net/badge/checks/Pass/green) | [(Jigsaw) validator](https://jigsaw.w3.org/css-validator/validator?uri=https%3A%2F%2Fibuttimer.github.io%2Frock-paper-scissors-xtreme%2Ftest%2Fgenerated%2Fresult%2Fbasic-result.html&profile=css3svg&usermedium=all&warning=1&vextwarning=&lang=en) | ![pass](https://badgen.net/badge/checks/Pass/green) |
| Basic Win | [W3C validator](https://validator.w3.org/nu/?showsource=yes&doc=https%3A%2F%2Fibuttimer.github.io%2Frock-paper-scissors-xtreme%2Ftest%2Fgenerated%2Fwin%2Fbasic-win.html) | ![pass](https://badgen.net/badge/checks/Pass/green) | [(Jigsaw) validator](https://jigsaw.w3.org/css-validator/validator?uri=https%3A%2F%2Fibuttimer.github.io%2Frock-paper-scissors-xtreme%2Ftest%2Fgenerated%2Fwin%2Fbasic-win.html&profile=css3svg&usermedium=all&warning=1&vextwarning=&lang=en) | ![pass](https://badgen.net/badge/checks/Pass/green) |
| BigBang Params | [W3C validator](https://validator.w3.org/nu/?showsource=yes&doc=https%3A%2F%2Fibuttimer.github.io%2Frock-paper-scissors-xtreme%2Ftest%2Fgenerated%2Fparam%2Fbigbang-param.html) | ![pass](https://badgen.net/badge/checks/Pass/green) | [(Jigsaw) validator](https://jigsaw.w3.org/css-validator/validator?uri=https%3A%2F%2Fibuttimer.github.io%2Frock-paper-scissors-xtreme%2Ftest%2Fgenerated%2Fparam%2Fbigbang-param.html&profile=css3svg&usermedium=all&warning=1&vextwarning=&lang=en) | ![pass](https://badgen.net/badge/checks/Pass/green) |
| BigBang Play | [W3C validator](https://validator.w3.org/nu/?showsource=yes&doc=https%3A%2F%2Fibuttimer.github.io%2Frock-paper-scissors-xtreme%2Ftest%2Fgenerated%2Fplay%2Fbigbang-play.html) | ![pass](https://badgen.net/badge/checks/Pass/green) | [(Jigsaw) validator](https://jigsaw.w3.org/css-validator/validator?uri=https%3A%2F%2Fibuttimer.github.io%2Frock-paper-scissors-xtreme%2Ftest%2Fgenerated%2Fplay%2Fbigbang-play.html&profile=css3svg&usermedium=all&warning=1&vextwarning=&lang=en) | ![pass](https://badgen.net/badge/checks/Pass/green) |
| BigBang Result | [W3C validator](https://validator.w3.org/nu/?showsource=yes&doc=https%3A%2F%2Fibuttimer.github.io%2Frock-paper-scissors-xtreme%2Ftest%2Fgenerated%2Fresult%2Fbigbang-result.html) | ![pass](https://badgen.net/badge/checks/Pass/green) | [(Jigsaw) validator](https://jigsaw.w3.org/css-validator/validator?uri=https%3A%2F%2Fibuttimer.github.io%2Frock-paper-scissors-xtreme%2Ftest%2Fgenerated%2Fresult%2Fbigbang-result.html&profile=css3svg&usermedium=all&warning=1&vextwarning=&lang=en) | ![pass](https://badgen.net/badge/checks/Pass/green) |
| BigBang Win | [W3C validator](https://validator.w3.org/nu/?showsource=yes&doc=https%3A%2F%2Fibuttimer.github.io%2Frock-paper-scissors-xtreme%2Ftest%2Fgenerated%2Fwin%2Fbigbang-win.html) | ![pass](https://badgen.net/badge/checks/Pass/green) | [(Jigsaw) validator](https://jigsaw.w3.org/css-validator/validator?uri=https%3A%2F%2Fibuttimer.github.io%2Frock-paper-scissors-xtreme%2Ftest%2Fgenerated%2Fwin%2Fbigbang-win.html&profile=css3svg&usermedium=all&warning=1&vextwarning=&lang=en) | ![pass](https://badgen.net/badge/checks/Pass/green) |
| Xtreme Params | [W3C validator](https://validator.w3.org/nu/?showsource=yes&doc=https%3A%2F%2Fibuttimer.github.io%2Frock-paper-scissors-xtreme%2Ftest%2Fgenerated%2Fparam%2Fxtreme-param.html) | ![pass](https://badgen.net/badge/checks/Pass/green) | [(Jigsaw) validator](https://jigsaw.w3.org/css-validator/validator?uri=https%3A%2F%2Fibuttimer.github.io%2Frock-paper-scissors-xtreme%2Ftest%2Fgenerated%2Fparam%2Fxtreme-param.html&profile=css3svg&usermedium=all&warning=1&vextwarning=&lang=en) | ![pass](https://badgen.net/badge/checks/Pass/green) |
| Xtreme Play | [W3C validator](https://validator.w3.org/nu/?showsource=yes&doc=https%3A%2F%2Fibuttimer.github.io%2Frock-paper-scissors-xtreme%2Ftest%2Fgenerated%2Fplay%2Fxtreme-play.html) | ![pass](https://badgen.net/badge/checks/Pass/green) | [(Jigsaw) validator](https://jigsaw.w3.org/css-validator/validator?uri=https%3A%2F%2Fibuttimer.github.io%2Frock-paper-scissors-xtreme%2Ftest%2Fgenerated%2Fplay%2Fxtreme-play.html&profile=css3svg&usermedium=all&warning=1&vextwarning=&lang=en) | ![pass](https://badgen.net/badge/checks/Pass/green) |
| Xtreme Result | [W3C validator](https://validator.w3.org/nu/?showsource=yes&doc=https%3A%2F%2Fibuttimer.github.io%2Frock-paper-scissors-xtreme%2Ftest%2Fgenerated%2Fresult%2Fxtreme-result.html) | ![pass](https://badgen.net/badge/checks/Pass/green) | [(Jigsaw) validator](https://jigsaw.w3.org/css-validator/validator?uri=https%3A%2F%2Fibuttimer.github.io%2Frock-paper-scissors-xtreme%2Ftest%2Fgenerated%2Fresult%2Fxtreme-result.html&profile=css3svg&usermedium=all&warning=1&vextwarning=&lang=en) | ![pass](https://badgen.net/badge/checks/Pass/green) |
| Xtreme Win | [W3C validator](https://validator.w3.org/nu/?showsource=yes&doc=https%3A%2F%2Fibuttimer.github.io%2Frock-paper-scissors-xtreme%2Ftest%2Fgenerated%2Fwin%2Fxtreme-win.html) | ![pass](https://badgen.net/badge/checks/Pass/green) | [(Jigsaw) validator](https://jigsaw.w3.org/css-validator/validator?uri=https%3A%2F%2Fibuttimer.github.io%2Frock-paper-scissors-xtreme%2Ftest%2Fgenerated%2Fwin%2Fxtreme-win.html&profile=css3svg&usermedium=all&warning=1&vextwarning=&lang=en) | ![pass](https://badgen.net/badge/checks/Pass/green) |
| Rules | [W3C validator](https://validator.w3.org/nu/?showsource=yes&doc=https%3A%2F%2Fibuttimer.github.io%2Frock-paper-scissors-xtreme%2Ftest%2Fgenerated%2Frules%2Frules.html) | ![pass](https://badgen.net/badge/checks/Pass/green) | [(Jigsaw) validator](https://jigsaw.w3.org/css-validator/validator?uri=https%3A%2F%2Fibuttimer.github.io%2Frock-paper-scissors-xtreme%2Ftest%2Fgenerated%2Frules%2Frules.html&profile=css3svg&usermedium=all&warning=1&vextwarning=&lang=en) | ![pass](https://badgen.net/badge/checks/Pass/green) |


## Issues

Issues were logged in [GitHub Issues](https://github.com/ibuttimer/rock-paper-scissors-xtreme/issues).

### Unfixed Issues

There are currently no issues outstanding. 

