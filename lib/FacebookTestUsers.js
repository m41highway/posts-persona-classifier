const FB = require('fb')
const fetch = require('node-fetch')
const Promise = require('bluebird');


FB.options({version: 'v2.7'})

// ----------------------
// Helper function
// ----------------------
function getTestUser (targetId) {
  return function (testUser) {
    if (testUser.id === targetId) {
      return testUser
    }
  }
}

const getPosts = function (appId, appToken, fbUserId) {
    return new Promise(function (resolve, reject){
        let facebookAppUrl = `https://graph.facebook.com/${appId}/accounts/test-users?access_token=${appToken}`;
        fetch(facebookAppUrl)

        .then(function (res) {
            return res.json()
        })

        .then(function (users) {
            let user = users.data.find(getTestUser(fbUserId))
            return new Promise((resolve, reject) => {
                FB.api('me/posts', { access_token: user.access_token }, function (res){
                    let posts = res.data.map(function (post) {
                        if (post.message) {
                            return post.message
                        }
                    }).filter(function (post) {
                        return post !== undefined
                    })
                    let text = posts.join(',')
                    resolve(text);
                })
            })
        })

        .then(function (res) {
            resolve(res);
        })
    })
}

const getAlbums = function (appId, appToken, fbUserId) {
    return new Promise(function (resolve, reject){
        let user;

        let facebookAppUrl = `https://graph.facebook.com/${appId}/accounts/test-users?access_token=${appToken}`;
        fetch(facebookAppUrl)

        .then(function (res) {
            return res.json()
        })

        .then(function (users) {
            user = users.data.find(getTestUser(fbUserId))
            return FB.api('me/permissions', { access_token: user.access_token })
        })
        .then(function (res) {
            console.log('------ permission ------', res);
            return FB.api('me/albums', {access_token: user.access_token })
        })
        .then(function (albums){
            let userAlbums = {
                user: user,
                albums: albums
            }
            resolve(userAlbums);
        })
    })
}

module.exports = {
    getPosts: getPosts,
    getAlbums: getAlbums
}