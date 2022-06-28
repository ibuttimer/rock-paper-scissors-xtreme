# Rock, Paper, Scissors Xtreme

Rock, Paper, Scissors Xtreme is am extreme version of the well known Rock, Paper, Scissors.

The site is aimed at game enthusiasts and procrastinators.

###### Fig 1: Responsive Mockup
![Responsive Mockup](media/responsive.jpg)

## Features 

### Existing Features
#### Common Features


### Features Left to Implement


### Future enhancements
- The [Demonstration](#demonstration) functionality is currently quite limited, this may be extended to allow simulation of actual gameplay.

## Design 
The design specification is available in [design.md](design/design.md).

## Development
### Environment 
The development environment requires:
* [Node.js](https://nodejs.org/)
* [npm](https://www.npmjs.com/)
* [git](https://git-scm.com/)

> __Note:__ At time of development the LTS version of Node.js was v16.15.0.
> Please check [Using Jasmine with Node](https://jasmine.github.io/setup/nodejs.html#using-jasmine-with-node) to ensure version compatibility. 

### Setup
In an appropriate folder, run the following commands:
```shell
> git clone https://github.com/ibuttimer/rock-paper-scissors-xtreme.git
> cd rock-paper-scissors-xtreme
> npm install
```

#### Environment
The [env.js](env.js) file provides configuration information to the application.
This configuration may be temporarily modified during development/testing using either of the following methods:
##### Git
Update the file as required and run `git update-index --assume-unchanged env.js`. This will cause Git to temporarily ignore the changed file. Run `git update-index --no-assume-unchanged env.js` to revert to normal. This reduces the possibility of inadvertently committing changes to the repository. 

See [git-update-index](https://git-scm.com/docs/git-update-index#Documentation/git-update-index.txt---no-assume-unchanged).

##### Local storage override
The local storage override facility may be used to change configuration values, as well as provide limited demonstration capabilities.
This feature works by loading a script which sets specified values in window.localStorage, prior to `script.js` being loaded.

###### Configuration override
The following configuration values may be changed:
- `ASSETS_BASE_URL`: the relative url to the assets folder
- `ENABLE_LOG`: enable console logging flag; set '0' to disable and '1' to enable

See [main.html](test/generated/main/main.html) and [test-main-config.js](test/generated/main/test-main-config.js).

###### Demonstration
Together with `ASSETS_BASE_URL` and `ENABLE_LOG`, the following values may be used to create a specific game status:
- `VARIANT`: the game variant; valid options are `Basic`, `BigBang` and `Xtreme`
- `NUM_PLAYERS`: the number of players
- `NUM_ROBOTS`: the number of robots
- `NUM_GAMES`: the number of games in the match
- `VIEW`: the view to display; valid options are:
  - `params` - game parameters view
  - `play` - game play view
  - `control` - view displayed is the result of processing input keys
  - `rules` - game rules view
- `INPUT`: a comma-separated list of game key characters representing player input. Possible values are:
  - alphabetic characters
  - modifier keys, `esc`, `alt`, `ctrl`, `meta`, `shift`
  - modified alphabetic characters i.e. '{modifier}+{char} e.g. 'ctrl+n'

See [main.html](test/generated/win/basic-win.html) and [test-main-config.js](test/generated/win/test-win-config.js).

> __Note:__ This functionality is presently limited to displaying the game parameters, game play and game result views. 
> It is also limited to one round.

### Application structure
The application structure is based on [React Architecture: How to Structure and Organize a React Application](https://www.taniarascia.com/react-architecture-directory-structure/).

```
├─ README.md            - this file
├─ index.html           - landing page
├─ env.js               - environment configuration
├─ design               - design documentation
│  └─ design.md         - design document
├─ assets               - app assets
│  ├─ audio             - audio files
│  ├─ css               - css files
│  ├─ img               - image files
│  └─ js                - JavaScript modules
├─ spec                 - Jasmine test scripts
└─ test                 - test results
   └─ lighthouse        - Lighthouse test results
```

### General
- CSS classnames follow the [Block, Element, Modifier (BEM)](https://css-tricks.com/bem-101/) methodology.

## Testing 
Details of the testing undertaken are outlined in [test.md](test/test.md), along with the results.

## Deployment

The site was deployed as a static website, hosted directly from the GitHub repository via [GitHub Pages](https://pages.github.com/).

The following steps were followed to deploy the website: 
  - Navigate to the `Settings` tab in the GitHub repository
  - Under the `Code and automation` section, select `Pages`
  - Under `Source`, select `main` from the Branch dropdown menu
  - Once the website is published, the page will refresh indicting the successful deployment, and providing link to the live website. 

The live website is available at [https://ibuttimer.github.io/rock-paper-scissors-xtreme/](https://ibuttimer.github.io/rock-paper-scissors-xtreme/)


## Credits 

The following resources were used to build the website.

### Content 

- The icons on the site were taken from [Lineicons](https://lineicons.com/)
- The favicon for the site was generated by [RealFaviconGenerator](https://realfavicongenerator.net/) from image by <a href="https://pixabay.com/users/openclipart-vectors-30363/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=156171">OpenClipart-Vectors</a> from <a href="https://pixabay.com/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=156171">Pixabay</a>
- Sticky footer based on [There is flexbox](https://css-tricks.com/couple-takes-sticky-footer/#aa-there-is-flexbox) from [Sticky Footer, Five Ways by Chris Coyier](https://css-tricks.com/couple-takes-sticky-footer/)
- Number of games radio switch based on [Responsive Toggle Switch](https://codepen.io/dsenneff/pen/ZoLVZW) by Darin on [Free Frontend - 88 Radio Buttons CSS](https://freefrontend.com/css-radio-buttons/)
- Settings dropdown menu based on [CSS Dropdowns](https://www.w3schools.com/css/css_dropdowns.asp)
- Settings toggle switch based on [Animated CSS Toggle Switch](https://codepen.io/garetmckinley/pen/YmxYZr?editors=1100) by Garet McKinley from [72 CSS Toggle Switches](https://freefrontend.com/css-toggle-switches/)
- Modal dialogue courtesy of [tingle.js](https://tingle.robinparisi.com/)

### Media
- Rock image by <a href="https://pixabay.com/users/publicdomainpictures-14/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=15712">PublicDomainPictures</a> from <a href="https://pixabay.com/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=15712">Pixabay</a>
- Paper Image by <a href="https://pixabay.com/users/kavowo-6764465/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=3155438">KAVOWO</a> from <a href="https://pixabay.com/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=3155438">Pixabay</a>
- Scissors image by <a href="https://pixabay.com/users/monfocus-2516394/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=1803670">Monfocus</a> from <a href="https://pixabay.com/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=1803670">Pixabay</a>
- Lizard image by <a href="https://pixabay.com/users/publicdomainpictures-14/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=22258">PublicDomainPictures</a> from <a href="https://pixabay.com/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=22258">Pixabay</a>
- Spock image by <a href="https://pixabay.com/users/brenkee-2021352/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=1541528">Benjamin Balazs</a> from <a href="https://pixabay.com/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=1541528">Pixabay</a>
- Batman image by <a href="https://pixabay.com/users/erikawittlieb-427626/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=1822445">ErikaWittlieb</a> from <a href="https://pixabay.com/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=1822445">Pixabay</a>
- Spiderman image by <a href="https://pixabay.com/users/sutulo-3073859/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=3859527">sutulo</a> from <a href="https://pixabay.com/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=3859527">Pixabay</a>
- Wizard image by <a href="https://pixabay.com/users/aitoff-388338/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=4603354">Andrew Martin</a> from <a href="https://pixabay.com/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=4603354">Pixabay</a>
- Gun image by <a href="https://pixabay.com/users/dirtdiver38-2109394/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=3149414">dirtdiver38</a> from <a href="https://pixabay.com/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=3149414">Pixabay</a>
- [Error beep sound](https://www.soundjay.com/buttons/sounds/beep-10.mp3) courtesy of [SoundJay.com](https://www.soundjay.com/beep-sounds-1.html)
- [Beep sound](https://www.soundjay.com/buttons/sounds/beep-22.mp3) courtesy of [SoundJay.com](https://www.soundjay.com/beep-sounds-1.html)
- [Winner sound](https://pixabay.com/sound-effects/success-fanfare-trumpets-6185/) from <a href="https://pixabay.com/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=music&amp;utm_content=6185">Pixabay</a>