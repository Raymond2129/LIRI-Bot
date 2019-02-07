require("dotenv").config();
var fs = require("fs");
var keys = require("./keys.js");
var request = require('request');
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);


var action = process.argv[2];
var parameter = process.argv[3];



// create a switchCase and enter the 4 needed cases. Concert, spotify, movie, and do what it says
function switchCase() {

  switch (action) {

    case 'concert-this':
      bandsInTown(parameter);                   
      break;                          

    case 'spotify-this-song':
      spotifySong(parameter);
      break;

    case 'movie-this':
      movieThis(parameter);
      break;

    case 'do-what-it-says':
      getRandom();
      break;

      default:                            
      logData("Invalid Instruction");
      break;

  }
};
//function for concert this. 
function bandsInTown(parameter){
//if concert this take the process.argv at array position 3 and make it the new varaible. 
if (action === 'concert-this')
{
	var artistName="";
	for (var i = 3; i < process.argv.length; i++)
	{
		artistName+=process.argv[i];
	}
	console.log(artistName);
}
else
{
	artistName = parameter;
}


//list the url and add the artist name into the url
var queryUrl = "https://rest.bandsintown.com/artists/" + artistName + "/events?app_id=codecademy";

//console.log(queryUrl)

//need to send the url request and recieve error, response,and body info back

request(queryUrl, function(error, response, body) {


//if error is false and the response code is 200 (meaning it recieved data) the parse the JSON file and log the data to screen along with appending the log file
  if (!error && response.statusCode === 200) {

    var JS = JSON.parse(body);
    for (i = 0; i < JS.length; i++)
    {
      var dTime = JS[i].datetime;
        var month = dTime.substring(5,7);
        var year = dTime.substring(0,4);
        var day = dTime.substring(8,10);
        var dateForm = month + "/" + day + "/" + year
        //function logData to append to the log.txt file
      logData("\n---------------------------------------------------\n");

        
      logData("Date: " + dateForm);
      logData("Name: " + JS[i].venue.name);
      logData("City: " + JS[i].venue.city);
      //need to clean up data, if the region is empty do not list and if it is list the state.
      if (JS[i].venue.region !== "")
      {
        logData("Country: " + JS[i].venue.region);
      }
      logData("Country: " + JS[i].venue.country);
      logData("\n---------------------------------------------------\n");

    }
  }
});
}

//function to run the spotify song search
function spotifySong(parameter) {

//need an if else if nothing is entered it will search for The Sign by ace of base else run a search on the enterd song
  var searchTrack;
  if (parameter === undefined) {
    searchTrack = "The Sign ace of base";
  } else {
    searchTrack = parameter;
  }

  //use spotify.search with the type as track
  spotify.search({
    type: 'track',
    //query will be the var holding the entered parameters
    query: searchTrack
  }, function(error, data) {
    if (error) {
      logData('Error occurred: ' + error);
      return;
    } else {

        //log the data to the terminal and to the log.txt
      logData("\n---------------------------------------------------\n");
      logData("Artist: " + data.tracks.items[0].artists[0].name);
      logData("Song: " + data.tracks.items[0].name);
      logData("Preview: " + data.tracks.items[3].preview_url);
      logData("Album: " + data.tracks.items[0].album.name);
      logData("\n---------------------------------------------------\n");
      
    }
  });
};

//need to create a function to run the movie-this 
function movieThis(parameter) {

//if else statement if no movie entered it will search for Mr. Nobody else take user parameters and search for the movie
  var findMovie;
  if (parameter === undefined) {
    findMovie = "Mr. Nobody";
  } else {
    findMovie = parameter;
  };
//list the queryURL and enter the movie varaible use the trilogy key
  var queryUrl = "http://www.omdbapi.com/?t=" + findMovie + "&y=&plot=short&apikey=trilogy";
  
  //run a requst that takes the url and runs a function to get the errors resposne and JSON body file
  request(queryUrl, function(err, res, body) {
      var bodyOf = JSON.parse(body);

      //if error is false and the response code is 200 (meaning it recieved data) the parse the JSON file and log the data to screen along with appending the log file
    if (!err && res.statusCode === 200) {

        //log the data to the terminal along with appending the log.txt
      logData("\n---------------------------------------------------\n");
      logData("Title: " + bodyOf.Title);
      logData("Release Year: " + bodyOf.Year);
      logData("IMDB Rating: " + bodyOf.imdbRating);
      logData("Rotten Tomatoes Rating: " + bodyOf.Ratings[1].Value); 
      logData("Country: " + bodyOf.Country);
      logData("Language: " + bodyOf.Language);
      logData("Plot: " + bodyOf.Plot);
      logData("Actors: " + bodyOf.Actors);
      logData("\n---------------------------------------------------\n");
    }
  });
};
//create a function to run the do what it says
function getRandom() {
fs.readFile('random.txt', "utf8", function(error, data){

    if (error) {
        return logData(error);
      }

  
    var dataArr = data.split(",");
    
    if (dataArr[0] === "spotify-this-song") 
    {
      var songcheck = dataArr[1].trim().slice(1, -1);
      spotifySong(songcheck);
    } 
    else if (dataArr[0] === "concert-this") 
    { 
      if (dataArr[1].charAt(1) === "'")
      {
      	var dLength = dataArr[1].length - 1;
      	var data = dataArr[1].substring(2,dLength);
      	console.log(data);
      	bandsInTown(data);
      }
      else
      {
	      var bandName = dataArr[1].trim();
	      console.log(bandName);
	      bandsInTown(bandName);
	  }
  	  
    } 
    else if(dataArr[0] === "movie-this") 
    {
      var movie_name = dataArr[1].trim().slice(1, -1);
      movieThis(movie_name);
    } 
    
    });

};
//create a function to console log to the terminal along with appending the log.txt file. Need to create a way to log errors in case it does not work properly
function logData(dataToLog) {

	console.log(dataToLog);

	fs.appendFile('log.txt', dataToLog + '\n', function(err) {
		
		if (err) return logData('Error logging data to file: ' + err);	
	});
}


switchCase();
