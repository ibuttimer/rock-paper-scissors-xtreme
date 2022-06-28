# Testing 

The site was tested using the following methods:

## JavaScript Unit Testing 
Unit testing of JS scripts was undertaken using [Jasmine](https://jasmine.github.io/).
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
| | | | | |

## Responsiveness Testing

Responsiveness testing was done using Google Chrome Developer Tools Device Mode.

Testing undertaken:

| Feature | Expected | Action | Related | Result | 
|---------|----------|--------|---------|--------|
| Page responsiveness | Page content realigns/resizes when page resized  | Resize page | All pages | ![TDB](https://badgen.net/badge/checks/TBD/blue) |

## Lighthouse

Lighthouse testing was carried out in an Incognito window using Lighthouse (Version 9.6.1) from Chrome Developer Tools.


| Page | Test | Result |  |  |  | Report |
|-|-|-|-|-|-|-|
| Main | Mobile | ![Performance 87](https://img.shields.io/badge/Performance-87-orange) | ![Accessibility 100](https://img.shields.io/badge/Accessibility-100-brightgreen) | ![Best Practises 100](https://img.shields.io/badge/Best%20Practises-100-brightgreen) |![SEO 100](https://img.shields.io/badge/SEO-100-brightgreen) | [home-mobile](https://ibuttimer.github.io/rock-paper-scissors-xtreme/test/lighthouse/main-mobile.html) |
|     | Desktop | ![Performance 99](https://img.shields.io/badge/Performance-99-brightgreen) | ![Accessibility 100](https://img.shields.io/badge/Accessibility-100-brightgreen) | ![Best Practises 100](https://img.shields.io/badge/Best%20Practises-100-brightgreen) |![SEO 100](https://img.shields.io/badge/SEO-100-brightgreen) | [home-desktop](https://ibuttimer.github.io/rock-paper-scissors-xtreme/test/lighthouse/main-desktop.html) |

The report JSON files in [test/lighthouse](https://github.com/ibuttimer/rock-paper-scissors-xtreme/tree/main/test/lighthouse) may be viewed in [Lighthouse Report Viewer](https://googlechrome.github.io/lighthouse/viewer/).

## Accessibility
Accessibility testing was carried out using the [NVDA](https://www.nvaccess.org/) and [ChromeVox](https://chrome.google.com/webstore/detail/screen-reader/kgejglhpjiefppelpmljglcjbhoiplfn?hl=en) screen readers.

Testing undertaken:

| Feature | Expected | Action | Related | Result | 
|---------|----------|--------|---------|--------|
| Audio commentary | Audio commentary provided for important page elements | Process page using screen reader | All pages | ![TBD](https://badgen.net/badge/checks/TBD/blue) |


## User
User testing was carried out and feedback was captured vis a Google Forms survey.


## Validator Testing 

The [W3C Nu Html Checker](https://validator.w3.org/nu/) was utilised to check the HTML validity, while the [W3C CSS Validation Service](https://jigsaw.w3.org/css-validator/) was utilised to check the CSS validity with respect to [CSS level 3 + SVG](https://www.w3.org/Style/CSS/current-work.html.)

As the `main` content of the site is generated via JavaScript, it was not possible to simply use the site url to perform the validator testing.
The following procedure was utilised to validate the JavaScript-generated content:
- Load the desired view in an Incognito window in Google Chrome.
- Open Developer Tools (Ctrl+Shift+I).
- In the `Elements` tab, select the `<html lang="en"` line.
- Right-click and select `Copy -> Copy outerHTML`.
  > __Note:__ The copied text does not contain the required `<!DOCTYPE html>` from the first line of [index.html](../index.html).

- The copied text may be validated, using one of the following methods:
  1. Paste the copied text into the [Check by text input](https://validator.w3.org/nu/#textarea) option of the [W3C Nu Html Checker](https://validator.w3.org/nu/), adding `<!DOCTYPE html>` as the first line..
  2. Save the copied text to a new file, e.g. [main-raw.html](generated/main-raw.html), and add `<!DOCTYPE html>` as the first line. Validate the file using the [Check by file upload](https://validator.w3.org/nu/#file) option of the [W3C Nu Html Checker](https://validator.w3.org/nu/).
  3. Host the file created in step 2, in an appropriate location and validate using the [Check by address](https://validator.w3.org/nu/) option of the [W3C Nu Html Checker](https://validator.w3.org/nu/).

        In order to utilise this method, the following additional steps are required:
        - Create a configuration override script as detailed in [Local storage override](../README.md#local-storage-override). See [test-config.js](generated/test-config.js).
        - Run the [Node.js](https://nodejs.org/) script [adjust.cjs](generated/adjust.cjs) using the command `node adjust.cjs <project root path> <input.html> <output.html> <config.js>`. This will adjust the relative paths in _input.html_ and inject the required configuration override script prior to [script.js](../assets/js/script.js) being loaded. The resultant file is saved as _output.html_. This will ensure that the hosted _output.html_ will display correctly. 

          E.g. run the following command from the [test\generated\main](test\generated\main) folder to generate `main.html`

          ```bash
          node ../adjust.cjs ../../../ main-raw.html main.html test-main-config.js
          ```

The [W3C Nu Html Checker](https://validator.w3.org/nu/) was utilised to check the HTML validity, while the [W3C CSS Validation Service](https://jigsaw.w3.org/css-validator/) was utilised to check the CSS validity with respect to [CSS level 3 + SVG](https://www.w3.org/Style/CSS/current-work.html.)

| Page | HTML | HTML Result | CSS | CSS Result |
|------|------|-------------|-----|------------|
| Main | [W3C validator](https://validator.w3.org/nu/?showsource=yes&doc=https%3A%2F%2Fibuttimer.github.io%2Frock-paper-scissors-xtreme%2Ftest%2Fgenerated%2Fmain%2Fmain.html) | ![pass](https://badgen.net/badge/checks/Pass/green) | [(Jigsaw) validator](https://jigsaw.w3.org/css-validator/validator?uri=https%3A%2F%2Fibuttimer.github.io%2Frock-paper-scissors-xtreme%2Ftest%2Fgenerated%2Fmain%2Fmain.html&profile=css3svg&usermedium=all&warning=1&vextwarning=&lang=en) | ![pass](https://badgen.net/badge/checks/Pass/green) |
| Basic Params | [W3C validator](https://validator.w3.org/nu/?showsource=yes&doc=https%3A%2F%2Fibuttimer.github.io%2Frock-paper-scissors-xtreme%2Ftest%2Fgenerated%2Fparam%2Fbasic-param.html) | ![pass](https://badgen.net/badge/checks/Pass/green) | [(Jigsaw) validator](https://jigsaw.w3.org/css-validator/validator?uri=https%3A%2F%2Fibuttimer.github.io%2Frock-paper-scissors-xtreme%2Ftest%2Fgenerated%2Fparam%2Fbasic-param.html&profile=css3svg&usermedium=all&warning=1&vextwarning=&lang=en) | ![pass](https://badgen.net/badge/checks/Pass/green) |
| Basic Play | [W3C validator](https://validator.w3.org/nu/?showsource=yes&doc=https%3A%2F%2Fibuttimer.github.io%2Frock-paper-scissors-xtreme%2Ftest%2Fgenerated%2Fplay%2Fbasic-play.html) | ![pass](https://badgen.net/badge/checks/Pass/green) | [(Jigsaw) validator](https://jigsaw.w3.org/css-validator/validator?uri=https%3A%2F%2Fibuttimer.github.io%2Frock-paper-scissors-xtreme%2Ftest%2Fgenerated%2Fplay%2Fbasic-play.html&profile=css3svg&usermedium=all&warning=1&vextwarning=&lang=en) | ![pass](https://badgen.net/badge/checks/Pass/green) |
| Basic Result | [W3C validator](https://validator.w3.org/nu/?showsource=yes&doc=https%3A%2F%2Fibuttimer.github.io%2Frock-paper-scissors-xtreme%2Ftest%2Fgenerated%2Fresult%2Fbasic-result.html) | ![pass](https://badgen.net/badge/checks/Pass/green) | [(Jigsaw) validator](https://jigsaw.w3.org/css-validator/validator?uri=https%3A%2F%2Fibuttimer.github.io%2Frock-paper-scissors-xtreme%2Ftest%2Fgenerated%2Fresult%2Fbasic-result.html&profile=css3svg&usermedium=all&warning=1&vextwarning=&lang=en) | ![pass](https://badgen.net/badge/checks/Pass/green) |
| Basic Win | [W3C validator](https://validator.w3.org/nu/?showsource=yes&doc=https%3A%2F%2Fibuttimer.github.io%2Frock-paper-scissors-xtreme%2Ftest%2Fgenerated%2Fwin%2Fbasic-win.html) | ![pass](https://badgen.net/badge/checks/Pass/green) | [(Jigsaw) validator](https://jigsaw.w3.org/css-validator/validator?uri=https%3A%2F%2Fibuttimer.github.io%2Frock-paper-scissors-xtreme%2Ftest%2Fgenerated%2Fwin%2Fbasic-win.html&profile=css3svg&usermedium=all&warning=1&vextwarning=&lang=en) | ![pass](https://badgen.net/badge/checks/Pass/green) |
| Rules | [W3C validator](https://validator.w3.org/nu/?showsource=yes&doc=https%3A%2F%2Fibuttimer.github.io%2Frock-paper-scissors-xtreme%2Ftest%2Fgenerated%2Frules%2Frules.html) | ![pass](https://badgen.net/badge/checks/Pass/green) | [(Jigsaw) validator](https://jigsaw.w3.org/css-validator/validator?uri=https%3A%2F%2Fibuttimer.github.io%2Frock-paper-scissors-xtreme%2Ftest%2Fgenerated%2Frules%2Frules.html&profile=css3svg&usermedium=all&warning=1&vextwarning=&lang=en) | ![pass](https://badgen.net/badge/checks/Pass/green) |


## Issues

Issues were logged in [GitHub Issues](https://github.com/ibuttimer/rock-paper-scissors-xtreme/issues).

### Unfixed Issues

There are currently no issues outstanding. 

