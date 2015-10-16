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
        writeSplitContents(astNodeList, outputDir, path.resolve(process.cwd(), summaryPath));
    } else {
        var defaultSummaryPath = path.resolve(process.cwd(), "SUMMARY.md");
        if (exist(defaultSummaryPath)) {
            writeSplitContents(astNodeList, outputDir, defaultSummaryPath);
        } else {
            writeSplitContents(astNodeList, outputDir);
        }
    }
}));