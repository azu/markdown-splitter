// LICENSE : MIT
"use strict";
const assert = require("power-assert");
const splitContent = require("../lib/markdown-splitter").splitContent;
describe("markdown-splitter-test", function () {
    describe("#splitContent", function(){
        it("should return array of content", function () {
            const contents = splitContent(`# Header
            
----
    
text
    
----
            `);
            assert.equal(contents.length, 3);
        });
    })
});