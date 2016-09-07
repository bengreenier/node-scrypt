"use strict";

var OS = require("os")
  , fs = require('fs')
  , path = require('path').dirname(require.main.filename)
  , exec = require('child_process').exec
  , puts = function(error, stdout, stderr) { if (error) console.log("Error: " + error);}
  , hasPrebuilt = false;

var platDir = __dirname + "/prebuilt/" + process.version.substr(0, 2) + "/" + OS.platform() + "/" + process.arch;

if (fs.existsSync(platDir)) {
    var outDir = __dirname + "/build/Release";

    try {
        fs.mkdirSync(__dirname + "/build");
    } catch (e) {
        // swallow
    }
    try {
        fs.mkdirSync(__dirname + "/build/Release");
    } catch (e) {
        // swallow
    }

    var files = fs.readdirSync(platDir);
    for (var i = 0 ; i < files.length ; i ++) {
        fs.createReadStream(platDir + "/" + files[i]).pipe(fs.createWriteStream(outDir + "/" + files[i]));
    }

    hasPrebuilt = true;
    console.log("Using prebuilt " + process.arch + " binary for target " + process.version.substr(0, 2));
}

if (!hasPrebuilt) {
    console.log("No prebuilt binary, building...");
    exec("node-gyp rebuild", puts);
}