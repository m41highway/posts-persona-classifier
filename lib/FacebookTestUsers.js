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
                // FB.api('me/permissions', { access_token: user.access_token }, function (res){
                //     // console.log('--- Photos ---');
                //     // console.log(res);
                //     // resolve(res);
                //     console.log('access token=', user.access_token);
                //     FB.api('me/albums', {access_token: user.access_token }, function (result) {
                //         // console.log(result);
                //         result.data.forEach(function (p) {
                //             // console.log('Photo Name:', p.name);
                //             // console.log('Photo Id:', p.id);

                //             // https://graph.facebook.com/[album-id]/photos?fields=id,images,link
                //             // let photoUrl = `https://graph.facebook.com/me/albums/${p.id}&access_token=${user.access_token}`;
                //             let photoUrl = `https://graph.facebook.com/${p.id}/photos?fields=id,album,name,images,link,from,target&access_token=${user.access_token}`;

                //             fetch(photoUrl)
                //             .then(function (photosRes){
                //                 let photoJson = photosRes.json();
                //                 return photoJson;
                //             })
                //             .then(function (json){
                //                 json.data.forEach(function (i){
                //                     if (i.album.name === 'Timeline Photos') {
                //                         // console.log('id', i.id);
                //                         console.log('images:', i.images[0].source);
                //                         // console.log('link', i.link);
                //                         // console.log('from:', i.from);
                //                         // console.log('target:', i.target);
                //                         // console.log('album:', i.album);
                //                         // console.log('name:', i.name);
                //                     }
                //                 })
                //             })
                //         })
                //         resolve(result);
                //     })

                // })

                FB.api('me/posts', { access_token: user.access_token }, function (res){
                console.log('Posts: ', res);
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
            console.log('getPhotos user...', user);
            // FB.api('me/permissions', { access_token: user.access_token }, function (res){
            //     console.log('permission', res);
            //     resolve(res);
            // })
            return FB.api('me/permissions', { access_token: user.access_token })
        })
        .then(function (res) {
            console.log('permission', res);
            // resolve(res);
            return FB.api('me/albums', {access_token: user.access_token })
        })
        .then(function (albums){
            let userAlbums = {
                user: user,
                albums: albums
            }
            resolve(userAlbums);
            // let userPhotos = [];

            // Promise.each(albums.data, function (a){
            // // albums.data.forEach(function (a){
            //     let photoUrl = `https://graph.facebook.com/${a.id}/photos?fields=id,album,name,images,link,from,target&access_token=${user.access_token}`;
            //     fetch(photoUrl)
            //     .then(function (photosRes){
            //         let photoJson = photosRes.json();
            //         return photoJson;
            //     })
            //     .then(function (json){
            //         json.data.forEach(function (i){
            //             if (i.album.name === 'Timeline Photos') {
            //                 // console.log('images:', i.images[0].source);
            //                 userPhotos.push(i.images[0].source)
            //             }
            //         })
            //     })
            // })
            // console.log('User Photos:::', userPhotos);
            // resolve(userPhotos);
        })
        // .then(function (albums){
        //         let userPhotos = [];

        //         // console.log('albums --> ', albums);
        //         albums.data.forEach(function (a){
        //             let photoUrl = `https://graph.facebook.com/${a.id}/photos?fields=id,album,name,images,link,from,target&access_token=${user.access_token}`;
        //             // console.log(photoUrl);

        //             fetch(photoUrl)
        //             .then(function (photosRes){
        //                 let photoJson = photosRes.json();
        //                 return photoJson;
        //             })
        //             .then(function (json){
        //                 json.data.forEach(function (i){
        //                     if (i.album.name === 'Timeline Photos') {
        //                         // console.log('images:', i.images[0].source);
        //                         userPhotos.push(i.images[0].source)
        //                     }
        //                 })
        //                 console.log('The user photos:', userPhotos);
        //                 resolve(userPhotos)
        //             })
        //         })
        //     })
        // })
    })
}

module.exports = {
    getPosts: getPosts,
    getAlbums: getAlbums
}