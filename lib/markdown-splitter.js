// LICENSE : MIT
"use strict";
require('string.prototype.repeat');
var mdast = require("mdast");
var mkdirp = require('mkdirp').sync;
var nlcstToString = require('nlcst-to-string');
var fs = require("fs");
function splitContent(content) {
    var ast = mdast.parse(content);
    var splitByLine = [];
    var fileId = 0;
    ast.children.forEach(function (node) {
        splitByLine[fileId] = splitByLine[fileId] || [];
        if (node.type === "horizontalRule") {
            fileId++;
        } else {
            splitByLine[fileId].push(node);
        }
    });
    return splitByLine;
}
/**
 *
 * @param {Array} contentNodeList mdast node list
 * @param {string} outputDir output directory path
 * @param {string} summaryPath? SUMMARY.md path
 */
function writeSplitContents(contentNodeList, outputDir, summaryPath) {
    var summary = [];
    mkdirp(outputDir);
    contentNodeList.forEach(function (nodeList, index) {
        var heading = nodeList[0];
        var level = heading.depth;
        var title = nlcstToString(heading);
        var fileName = index + 1 + ".md";
        var indent = "\t";
        var splitContent = mdast.stringify({
            type: "root",
            children: nodeList
        });
        var summaryLine = indent.repeat(level - 1) + "- [" + title + "](page/" + fileName + ")";
        summary.push(summaryLine);
        fs.writeFileSync(outputDir + fileName, splitContent, "utf-8");
    });
    if (summaryPath) {
        tryToWriteSummary(summaryPath, summary.join("\n"));
    }
}

function tryToWriteSummary(summaryPath, content) {
    fs.writeFileSync(summaryPath, content, "utf-8");
}

module.exports = {
    splitContent: splitContent,
    writeSplitContents: writeSplitContents
};