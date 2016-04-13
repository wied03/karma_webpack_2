// originally from https://github.com/mackstar/karma-spec-json-reporter/blob/master/index.js

/*global require,console,process,module*/
var parseResult,
    output = {};
(function () {
    'use strict';
    var fs = require('fs'),
        SPECJSONReporter;

    function getCurrentOutputPointer(suite) {
        var current = output,
            key = suite.join(' ');

        if (current[key] === undefined) {
            current[key] = {};
        }
        current = current[key];
        return current;
    }

    parseResult = function (result) {
        var testStatus;
        if (result.skipped) {
            testStatus = 'SKIPPED';
        }
        else {
            testStatus = result.success ? 'PASSED' : 'FAILED';
        }
        var current = getCurrentOutputPointer(result.suite);
        current[result.description] = testStatus;
    };


    SPECJSONReporter = function (baseReporterDecorator, config) {
        baseReporterDecorator(this);

        this.onSpecComplete = function (browser, result) {
            parseResult(result, browser);
        };

        this.onRunComplete = function () {
            if (config.outputFile) {
                fs.writeFile(config.outputFile, JSON.stringify(output, null, 4), function (err) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("JSON file was written to " + config.outputFile);
                    }
                });
            } else {
                process.stdout.write(JSON.stringify(output));
            }
        };
    };

    SPECJSONReporter.$inject = ['baseReporterDecorator', 'config.specjsonReporter'];

    module.exports = {
        'reporter:orspec-modified-json': ['type', SPECJSONReporter]
    };
}());
