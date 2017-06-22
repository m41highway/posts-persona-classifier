const Promise = require('bluebird');
const co = require('co');
const fbTestUser = require('./lib/FacebookTestUsers');
const config = require('./config');
const findHashtags = require('find-hashtags');

function run () {
    return Promise.coroutine(function* (){

        let posts = yield fbTestUser.getPosts(config.facebook.appId, config.facebook.appToken, '101120990479527')

        let hashtags = findHashtags(posts);

        console.log(hashtags);
        return posts;
    })();
}

let measurement = run()

measurement
.then(r => {
    console.log(r);
})