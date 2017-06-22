const Promise = require('bluebird');
const fs = require('fs');
const dir = './knowledge_base';

// ------------------------------------------
// Get the latest trained file from directory
// knowledge_base
// ------------------------------------------
const latestFilePromoise = new Promise(function (resolve, reject) {
    fs.readdir(dir, function(err, files){
        if (err) {
            reject(err);
        }

        let latestFiles = files.map(function (fileName) {
            return {
                name: fileName,
                time: fs.statSync(dir + '/' + fileName).mtime.getTime()
            };
        })
        // -------------------------------------------
        // sort files by reverse chronological order
        // -------------------------------------------
        .sort(function (a, b) {
            return b.time - a.time;
        })
        .map(function (v) {
            return v.name;
        });

        resolve(latestFiles[0]);
    });
});

module.exports = {
    latestFilePromoise: latestFilePromoise
}



