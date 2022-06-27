/**
 * Node.js script to modify html file relative paths for non-project root hosting.
 * 
 * Usage: node adjust.cjs <project root path> <input.html> <output.html> <config.js>
 *      <project root path> - relative path from folder containing <output.html> to project root
 *      <input.html> - raw input file copied from DOM
 *      <output.html> - name of output file to generate
 *      <config.js> - name of JavaScript config file to load to give required view
 */

// https://nodejs.dev/learn/accept-input-from-the-command-line-in-nodejs
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
});

const fs = require('fs');

/** Path to project root */
let rootPath;
/** Path to source file */
let source;
/** Path to output file */
let output;
/** Path to config file */
let config;
/** Html content of source file */
let html;


// https://nodejs.dev/learn/nodejs-accept-arguments-from-the-command-line
if (process.argv.length < 6) {
    // get files vis user input
    readline.question(`Project root path: `, name => {
        rootPath = name;

        readline.question(`Source file name: `, name => {
            source = name;
        
            readline.question(`Output file name: `, name => {
                output = name;
    
                readline.question(`Config file name: `, name => {
                    config = name;
        
                    readline.close();
           
                    processFile();
                });
                });
        });
    });
} else {
    // get user arguments by creating a new array that excludes the first 2 params
    const args = process.argv.slice(2);

    rootPath = args[0];
    source = args[1];
    output = args[2];
    config = args[3];

    processFile();
}

/**
 * Process the inout file
 */
function processFile() {

    console.log(`Convert ${source} to ${output}`);

    // https://nodejs.dev/learn/reading-files-with-nodejs
    try {
        html = fs.readFileSync(source, 'utf8');

        html = "<!DOCTYPE html>\n" + html;

        // config override
        html = html.replace('type="module" src="assets/js/script.js"', 
            'src="' + config + '"></script>\n<script type="module" src="assets/js/script.js"');
        
        // icons
        html = html.replaceAll('href="apple', 'href="' + rootPath + 'apple');
        html = html.replaceAll('href="favicon', 'href="' + rootPath + 'favicon');
        html = html.replaceAll('href="safari', 'href="' + rootPath + 'safari');
        html = html.replaceAll('href="site', 'href="' + rootPath + 'site');
        
        // libraries
        html = html.replaceAll('href="lib', 'href="' + rootPath + 'lib');
        // stylesheets
        html = html.replaceAll('href="assets', 'href="' + rootPath + 'assets');
        // images
        html = html.replaceAll('src="android', 'src="' + rootPath + 'android');
        html = html.replaceAll('src="assets', 'src="' + rootPath + 'assets');
        html = html.replaceAll('srcset="assets', 'srcset="' + rootPath + 'assets');
        // scripts
        html = html.replaceAll('src="lib', 'src="' + rootPath + 'lib');

        // https://nodejs.dev/learn/writing-files-with-nodejs
        try {
            fs.writeFileSync(output, html);
            // file written successfully
        } catch (err) {
            console.error(err);
        }
        // console.log(html);
    
    } catch (err) {
        console.error(err);
    }
    process.exit();
}