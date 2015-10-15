// LICENSE : MIT
"use strict";
require('string.prototype.zrepeat');
var mdast = require("mdast");
var mkdirp = require('mkdirp').sync;
var nlcstToString = require('nlcst-to-string');
var fs = require("fs");
var content = fs.readFileSync("all.md", "utf-8");
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

var summary = [];
splitByLine.forEach(function (nodeList, index) {
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
    var outputDir = __dirname + "/page/";
    mkdirp(outputDir);
    fs.writeFileSync(outputDir + fileName, splitContent, "utf-8");
});
fs.writeFileSync(__dirname + "/SUMMARY.md", summary.join("\n"), "utf-8");
