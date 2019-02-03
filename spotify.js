require("dotenv").config();

var Spotify = require('node-spotify-api');
var keys = require('./keys');
var fs = require("fs");


var spotify = new Spotify(keys.spotify)



// Grab the trackName which will always be the third node argument
var trackName = process.argv.splice(2).join(" ");

spotify
    .search({ type: 'track', query: trackName })
    .then(function (response) {


        console.log("|^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^|")
        console.log(`Name Of Artists: ${response.tracks.items[0].artists[0].name}`)
        console.log(`Name Of Song: ${response.tracks.items[0].name}`)
        console.log(`Preview URL: ${response.tracks.items[0].preview_url}`)
        console.log(`From The Album: ${response.tracks.items[0].album.name}`)
        console.log("|______________________________________|")

    })
    .catch(function (err) {
        console.log(err);
    });