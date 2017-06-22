const Promise = require('bluebird');
const natural = require('natural');
const latestFilePromise = require('./latest-file').latestFilePromoise;

const getLoaderPromoise = new Promise(function (resolve, reject) {

    latestFilePromise
    .then(file => {
        console.log(`Loading knowledge file ${file} ...`);

        let knowledgeFile = './knowledge_base/' + file;

        natural.BayesClassifier.load(knowledgeFile, null, function (err, classifier) {
            if (err) {
                reject(err);
            } else {
                resolve(classifier);
            }
        });
    })
});

module.exports = {
    getLoaderPromoise: getLoaderPromoise
}