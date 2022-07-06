/**
 * Node.js script to run lighthouse tests on project artifacts.
 * 
 * Usage: node runlighthouse.cjs <site root url> <generated content folder> <report folder>
 *      <site root url> - url of site
 *      <generated content folder> - folder url relative to root url containing generated content
 *      <report folder> - folder to store results in
 * 
 * Based on
 *  https://joshuatz.com/posts/2021/using-lighthouse-cli-nodejs/ 
 *  examples from https://github.com/GoogleChrome/lighthouse/blob/HEAD/docs/readme.md#using-programmatically
 */

// https://nodejs.dev/learn/accept-input-from-the-command-line-in-nodejs
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
});

const fs = require('fs');
const path = require('path');
const lighthouse = require('lighthouse');
const lrDesktopConfig = require('lighthouse/lighthouse-core/config/lr-desktop-config.js')
const lrMobileConfig = require('lighthouse/lighthouse-core/config/lr-mobile-config.js')
const chromeLauncher = require('chrome-launcher');

const categoryPerformance = 'performance';
const categoryAccessibility = 'accessibility';
const categoryBestPractices = 'best-practices';
const categorySEO = 'seo';

/** Testing categories */
const categories = [
    // display name        lighthouse report property
    { name: 'Performance', property: categoryPerformance },
    { name: 'Accessibility', property: categoryAccessibility },
    { name: 'Performance', property: categoryBestPractices },
    { name: 'SEO', property: categorySEO },
];
const allCategoryCfg = [
    categoryPerformance, categoryAccessibility, categoryBestPractices, categorySEO
];
const accessibilityBPCfg = [
    categoryAccessibility, categoryBestPractices
];

const defaultUrl = 'https://ibuttimer.github.io/rock-paper-scissors-xtreme/'
const defaultGeneratedPath = 'test/generated';
const defaultReportPath = 'lighthouse';
const views = [
    'param/basic-param.html',
    'param/bigbang-param.html',
    'param/xtreme-param.html',
    'play/basic-play.html',
    'play/bigbang-play.html',
    'play/xtreme-play.html',
    'result/basic-result.html',
    'result/bigbang-result.html',
    'result/xtreme-result.html',
    'rules/rules.html',
    'win/basic-win.html',
    'win/bigbang-win.html',
    'win/xtreme-win.html',
];

/** Root url for site */
let rootUrl;
/** Relative path to generated content folder from root url for site */
let generatedPath;
/** Folder to save reports */
let reportPath;

// https://nodejs.dev/learn/nodejs-accept-arguments-from-the-command-line
if (process.argv.length < 5) {
    // get arguments via user input
    readline.question(`Site url [press enter for default]: `, name => {
        rootUrl = name.length === 0 ? defaultUrl : name;

        readline.question(`Generated content folder [press enter for default]: `, name => {
            generatedPath = name.length === 0 ? defaultGeneratedPath : name;
    
            readline.question(`Report folder [press enter for default]: `, name => {
                reportPath = name.length === 0 ? defaultReportPath : name;
        
                runTests();
            });
        });
    });
} else {
    // get user arguments by creating a new array that excludes the first 2 params
    const args = process.argv.slice(2);

    rootUrl = args[0];
    generatedPath = args[1];
    reportPath = args[2];

    runTests();
}

/**
 * Run the tests
 */
 async function runTests() {

    const chrome = await chromeLauncher.launch({chromeFlags: ['--headless']});
    // https://github.com/GoogleChrome/lighthouse/blob/HEAD/docs/configuration.md
    const mainOptions = {
        logLevel: 'info', 
        output: 'html', 
        onlyCategories: allCategoryCfg, 
        port: chrome.port
    };
    const generatedOptions = Object.assign({}, mainOptions, {
        onlyCategories: accessibilityBPCfg
    });
    const lhConfigs = [
        { name: 'mobile', config: lrMobileConfig },
        { name: 'desktop', config: lrDesktopConfig }
    ];
    let markdown = '';
    const markdownFile = path.join(reportPath, `results.md`);
  
    // run the tests for the main view
    let options = mainOptions;
    for (const cfg of lhConfigs) {
        console.log(`Testing ${rootUrl}: ${cfg.name}`);

        const runnerResult = await lighthouse(rootUrl, options, cfg.config);

        const resultMarkdown = report(runnerResult, options.onlyCategories, 'main', cfg.name);
    
        markdown = `${markdown}\n${resultMarkdown}`;
    }

    // run the tests for the generated views
    options = generatedOptions;
    for (let index = 0; index < views.length; index++) {
        const view = views[index];

        const url = new URL(path.join(generatedPath, view), rootUrl);

        for (const cfg of lhConfigs) {
            console.log(`Testing ${url}: ${cfg.name}`);

            const noExtPath = url.pathname.split('.')[0];
            const pathSplits = noExtPath.split('/');
    
            const runnerResult = await lighthouse(url, options, cfg.config);
            
            const resultMarkdown = report(
                runnerResult, options.onlyCategories, pathSplits[pathSplits.length - 1], cfg.name);

            markdown = `${markdown}\n${resultMarkdown}`;
        }
    }

    // save the generated markdown for report
    fs.writeFileSync(markdownFile, markdown, err => {});

    console.log(`Result reports saved in ${reportPath}`);
    console.log(`Report markdown saved in ${markdownFile}`);

    await chrome.kill();
    process.exit();
}

/**
 * Report the results
 * @param {object} runnerResult - lighthouse results
 * @param {Array[object]} categoryCfg - tested categories @see {@link categories}
 * @param {string} name - name of tested resource
 * @param {string} formFactor - form factor used for test
 * @returns {string} markdown text for test report
 */
function report(runnerResult, categoryCfg, name, formFactor) {

    // `.lhr` is the Lighthouse Result as a JS object
    console.log(`Report for ${runnerResult.lhr.finalUrl} - ${formFactor}`);

    categories.forEach(category => {
        if (categoryCfg.find(entry => entry === category.property)) {
            console.log(`  ${category.name} score was ${categoryScore(runnerResult, category.property)}`);
        }
    });

    // `.report` is the HTML report as a string
    const reportHtml = runnerResult.report;
    const reportFile = path.join(reportPath, `${name}-${formFactor}.html`);
    fs.writeFileSync(reportFile, reportHtml);

    // generate markdown line for report
    return shieldsIo(runnerResult, categoryCfg, name, formFactor);
}

/**
 * Generate markdown text for test report
 * @param {object} runnerResult - lighthouse results
 * @param {Array[object]} categoryCfg - tested categories @see {@link categories}
 * @param {string} name - name of tested resource
 * @param {string} formFactor - form factor used for test
 * @returns {string} markdown text for test report
 */
function shieldsIo(runnerResult, categoryCfg, name, formFactor) {
    let markdown = `| ${titleCase(name)} | ${titleCase(formFactor)} |`;
    categories.forEach(category => {
        
        let link;

        if (categoryCfg.find(entry => entry === category.property)) {
            const score = categoryScore(runnerResult, category.property);

            link = `![${category.name} ${score}](https://img.shields.io/badge/${category.name}-${score}-${
                score >= 90 ? 'brightgreen' : score >= 50 ? 'orange' : 'red'
            })`;
        } else {
            link = 'n/a';
        }
        markdown += ` ${link} |`
    });
    return markdown;
}

/**
 * Capitalise first letter
 * @param {string} name
 * @returns {string}
 */
function titleCase(name) {
    return `${name.substring(0, 1).toUpperCase()}${name.substring(1, name.length)}`;
}

/**
 * Extract category score from lighthouse results
 * @param {object} runnerResult - lighthouse results
 * @param {string} property - category property in results
 * @returns 
 */
const categoryScore = (runnerResult, property) => { 
    return runnerResult.lhr.categories[property].score * 100;
};