/**
 * Node.js script to run lighthouse tests on project artifacts.
 * 
 * Usage: node runlighthouse.cjs <site root url> <generated content folder> <report folder> <report>
 *      <site root url> - url of site
 *      <generated content folder> - folder url relative to root url containing generated content
 *      <report folder> - folder to store results in
 *      <report> - report to run, possible options are [all, landing, main, param, play, result, win, rules]
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

/**
 * View config
 * @param {string} name - report name
 * @param {Array[string]} category - categories to test
 * @param {boolean} root - is root flag; true = use root url, false = generated url
 * @param {string} path - relative path to generated file
 * @returns 
 */
const viewCfg = (name, category, root, path) => {
    return { name: name, category: category, root: root, path: path };
};
const landingRpt = 'landing';
const mainRpt = 'main';
const paramRpt = 'param';
const playRpt = 'play';
const resultRpt = 'result';
const winRpt = 'win';
const rulesRpt = 'rules';
const allRpt = 'all';
/** List of all reports */
const views = [
    viewCfg(landingRpt, allCategoryCfg, true, '/'),
    viewCfg(mainRpt, allCategoryCfg, true, '/'),
    viewCfg(paramRpt, accessibilityBPCfg, false, 'param/basic-param.html'),
    viewCfg(paramRpt, accessibilityBPCfg, false, 'param/bigbang-param.html'),
    viewCfg(paramRpt, accessibilityBPCfg, false, 'param/xtreme-param.html'),
    viewCfg(playRpt, accessibilityBPCfg, false, 'play/basic-play.html'),
    viewCfg(playRpt, accessibilityBPCfg, false, 'play/bigbang-play.html'),
    viewCfg(playRpt, accessibilityBPCfg, false, 'play/xtreme-play.html'),
    viewCfg(resultRpt, accessibilityBPCfg, false, 'result/basic-result.html'),
    viewCfg(resultRpt, accessibilityBPCfg, false, 'result/bigbang-result.html'),
    viewCfg(resultRpt, accessibilityBPCfg, false, 'result/xtreme-result.html'),
    viewCfg(winRpt, accessibilityBPCfg, false, 'win/basic-win.html'),
    viewCfg(winRpt, accessibilityBPCfg, false, 'win/bigbang-win.html'),
    viewCfg(winRpt, accessibilityBPCfg, false, 'win/xtreme-win.html'),
    viewCfg(rulesRpt, accessibilityBPCfg, false, 'rules/rules.html'),
];

/** Root url for site */
let rootUrl;
/** Relative path to generated content folder from root url for site */
let generatedPath;
/** Folder to save reports */
let reportPath;
/** Reports to run; one of 
 *  'all', 'landing', 'main', 'param', 'play', 'result', 'win' or 'rules'
 * i.e. one of xxxRpt e.g. {@link landingRpt}
 */
let reports;

// https://nodejs.dev/learn/nodejs-accept-arguments-from-the-command-line
if (process.argv.length < 6) {
    // get arguments via user input
    readline.question(`Site url [press enter for default]: `, name => {
        rootUrl = name.length === 0 ? defaultUrl : name;

        readline.question(`Generated content folder [press enter for default]: `, name => {
            generatedPath = name.length === 0 ? defaultGeneratedPath : name;
    
            readline.question(`Report folder [press enter for default]: `, name => {
                reportPath = name.length === 0 ? defaultReportPath : name;

                readline.question(`Report to run [press enter for all]: `, name => {
                    reports = name.length === 0 ? allRpt : name;

                    runIt();
                });
            });
        });
    });
} else {
    // get user arguments by creating a new array that excludes the first 2 params
    const args = process.argv.slice(2);

    rootUrl = args[0];
    generatedPath = args[1];
    reportPath = args[2];
    reports = args[3];

    runIt();
}

/**
 * Check report selection and run
 */
function runIt() {
    const runList = views.filter(entry => entry.name === reports);

    if (runList.length) {
        runTests(runList);
    } else {
        const reportSet = new Set();
        views.forEach(entry => reportSet.add(entry.name));
        console.log(`No report selected`)
        console.log(`Possible options are [all, ${Array.from(reportSet).join(', ')}]`)
        process.exit();
    }
}

/**
 * Run the tests
 */
 async function runTests(runList) {

    const chrome = await chromeLauncher.launch({chromeFlags: ['--headless']});
    // https://github.com/GoogleChrome/lighthouse/blob/HEAD/docs/configuration.md
    const mainOptions = {
        logLevel: 'info', 
        output: 'html', 
        onlyCategories: allCategoryCfg, 
        port: chrome.port
    };
    const lhConfigs = [
        { name: 'mobile', config: lrMobileConfig },
        { name: 'desktop', config: lrDesktopConfig }
    ];
    let markdown = '';
    const markdownFile = path.join(reportPath, `results.md`);
    const reportFiles = [];
  
    for (const running of runList) {
        // config options
        const options = Object.assign({}, mainOptions, {
            onlyCategories: running.category
        });

        let url;    // site url
        let name;
        if (running.root) { 
            url = rootUrl;
            name = running.name;
        } else { 
            url = new URL(path.join(generatedPath, running.path), rootUrl);

            const noExtPath = url.pathname.split('.')[0];
            const pathSplits = noExtPath.split('/');

            name = pathSplits[pathSplits.length - 1];
        }

        for (const cfg of lhConfigs) {
            console.log(`Testing ${url}: ${cfg.name}`);
    
            const runnerResult = await lighthouse(rootUrl, options, cfg.config);
    
            const reportResult = report(runnerResult, options.onlyCategories, name, cfg.name);

            reportFiles.push(reportResult.filename);
        
            markdown = `${markdown}\n${reportResult.markdown}`;
        }
    }

    // save the generated markdown for report
    fs.writeFileSync(markdownFile, markdown, err => {});

    console.log(`Result reports saved in ${reportPath}`);
    console.log(reportFiles.map(entry => `  ${entry}`).join('\n'));
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
 * @returns {object} 
 * @type {string} markdown - markdown text for test report
 * @type {string} filename - report filename
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
    const reportFilename = `${name}-${formFactor}.html`;
    const reportFile = path.join(reportPath, `${name}-${formFactor}.html`);
    fs.writeFileSync(reportFile, reportHtml);

    // generate markdown line for report
    return {
        markdown: shieldsIo(runnerResult, categoryCfg, name, formFactor, reportFile),
        filename: reportFilename
    };
}

/**
 * Generate markdown text for test report
 * @param {object} runnerResult - lighthouse results
 * @param {Array[object]} categoryCfg - tested categories @see {@link categories}
 * @param {string} name - name of tested resource
 * @param {string} formFactor - form factor used for test
 * @param {string} reportFile - relative path to report file
 * @returns {string} markdown text for test report
 */
function shieldsIo(runnerResult, categoryCfg, name, formFactor, reportFile) {
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

    const url = new URL(reportFile, rootUrl);

    return `${markdown} [${`${name}-${formFactor}`}](${url}) |`;
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