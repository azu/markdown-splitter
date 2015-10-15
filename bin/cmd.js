#!/usr/bin/env node
var splitContent = require('../').splitContent;
var writeSplitContents = require('../').writeSplitContents;
var concat = require('concat-stream');
var fs = require('fs');
var path = require("path");
var exist = require("exists-sync");
var file = process.argv[2];
var argv = require('minimist')(process.argv.slice(2));
var input = file && file !== '-'
        ? fs.createReadStream(process.argv[2])
        : process.stdin
    ;
input.pipe(concat(function (buf) {
    var astNodeList = splitContent(buf.toString('utf8'));
    // -o --output output directory path
    var outputDir = argv.output || argv.o;
    // --summary summary path
    var summaryPath = argv.summary;
    if (summaryPath) {
    } else {
        if (exist(path.join(__dirname, "SUMMARY.md"))) {
            writeSplitContents(astNodeList, outputDir, path.join(__dirname, "SUMMARY.md"));
        } else {
            writeSplitContents(astNodeList, outputDir);
        }
    }
}));