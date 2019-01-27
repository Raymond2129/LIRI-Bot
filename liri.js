js
require("dotenv").config();
var input1 = process.argv[2];
var input2 = process.arv[3];

if (input1 === "concert-this") {
    var artist = input1;
    var concert = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
  }

  else if (input1 === "spotify-this-song") {
    console.log(parseFloat(process.argv[3]) - parseFloat(process.argv[4]));
  }

  else if (input1 === "movie-this") {
    console.log(parseFloat(process.argv[3]) * parseFloat(process.argv[4]));
  }

  else if (input1 === "do-what-it-says") {
    console.log(parseFloat(process.argv[3]) / parseFloat(process.argv[4]));
  }
