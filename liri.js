var fs = require("fs");
require("dotenv").config();

var inquirer = require("inquirer");
inquirer.prompt([
    {
        type: "list",
        message: "What would you like to do?",
        choices: ["What Bands are in Town", "Spotify This Song", "Movie This", "Do What I Say"],
        name: "coolThings"
    }
]).then(function(user){
    switch (user.coolThings) {
        case 'concert-this':
      bandsInTown(parameter);                   
      break;   
        case "Spotify This Song":
            spotifyPrompt();
            break;
        case "Movie This":
            omdb();
            break;
        case "Do What I Say":
            doWhatISay();
            break;
    };
});
function bandsInTown(parameter){

    if (action === 'concert-this')
    {
        var movieName="";
        for (var i = 3; i < process.argv.length; i++)
        {
            movieName+=process.argv[i];
        }
        console.log(movieName);
    }
    else
    {
        movieName = parameter;
    }
    
    
    
    var queryUrl = "https://rest.bandsintown.com/artists/"+movieName+"/events?app_id=codecademy";
    
    
    request(queryUrl, function(error, response, body) {
    
      if (!error && response.statusCode === 200) {
    
        var JS = JSON.parse(body);
        for (i = 0; i < JS.length; i++)
        {
          var dTime = JS[i].datetime;
            var month = dTime.substring(5,7);
            var year = dTime.substring(0,4);
            var day = dTime.substring(8,10);
            var dateForm = month + "/" + day + "/" + year
      
          logIt("\n---------------------------------------------------\n");
    
            
          logIt("Date: " + dateForm);
          logIt("Name: " + JS[i].venue.name);
          logIt("City: " + JS[i].venue.city);
          if (JS[i].venue.region !== "")
          {
            logIt("Country: " + JS[i].venue.region);
          }
          logIt("Country: " + JS[i].venue.country);
          logIt("\n---------------------------------------------------\n");
    
        }
      }
    });
    }
function spotify(answer) {
   
    if (answer.spotifyName) {
        var Spotify = require('node-spotify-api');
        var spotify = new Spotify({
            id: "3bd0c2a8af9d40fe9b463fa21070c9ca",
            secret: "a0b32b79f04241c0a63366569fc505b5"
        });
        var uri = "https://api.spotify.com/v1/search?q=" + answer.spotifyName + "&type=track&limit=1"; 
        spotify.request(uri).then(function(data) {
            var song =  data.tracks.items[0];
            var songsObject = {
                Artist: song.artists[0].name,
                Name: song.name,
                Link: song.external_urls.spotify,
                Album: song.album.name
            };
            console.log("#################################");
            console.log("# Artist: " + songsObject.Artist);
            console.log("# Song Name: " + songsObject.Name);
            console.log("# Listen: " + songsObject.Link);
            console.log("# Album: " + songsObject.Album);
            console.log("#################################");

            fs.appendFileSync("log.txt", JSON.stringify(songsObject, null, 2));

        }).catch(function(err) {
            console.error('Error occurred: ' + err); 
        });
    } else {
        var Spotify = require('node-spotify-api');
        var spotify = new Spotify({
            id: "761cc4c64d7a4cc5946c3c3d7de2868c",
            secret: "351cf552a888409097d9c99d7b478e79"
        });
        var uri = "https://api.spotify.com/v1/tracks/3DYVWvPh3kGwPasp7yjahc";
        spotify.request(uri).then(function(data) {
            var songsObject = {
                Artist: data.artists[0].name,
                Name: data.name,
                Link: data.external_urls.spotify,
                Album: data.album.name
            };
            console.log("#################################");
            console.log("# Artist: " + songsObject.Artist);
            console.log("# Song Name: " + songsObject.Name);
            console.log("# Listen: " + songsObject.Link);
            console.log("# Album: " + songsObject.Album);
            console.log("#################################");

            fs.appendFileSync("log.txt", JSON.stringify(songsObject, null, 2));

        }).catch(function(err) {
            console.error("Error occurred: " + err); 
        });
    };
    
};

function spotifyPrompt() {
    inquirer.prompt([
        {
            type: "input",
            message: "What Song?",
            name: "spotifyName"
        }
    ]).then(function(res){
        spotify(res);
    });
};

function omdb() {
    inquirer.prompt([
        {
            type: "input",
            message: "What Movie?",
            name: "omdb"
        }
    ]).then(function(movie){
        if (movie.omdb) {
            var request = require("request");
            var queryUrl = "http://www.omdbapi.com/?t=" + movie.omdb + "&apikey=faa36345";
            request(queryUrl, function(error, response, body){
                if (!error && response.statusCode === 200) {
                    var moviesObject = {
                        Name: JSON.parse(body).Title,
                        Year: JSON.parse(body).Year,
                        imdbRating: JSON.parse(body).imdbRating,
                        rottenRating: JSON.parse(body).Ratings[1].Value,
                        Production: JSON.parse(body).Country,
                        Language: JSON.parse(body).Language,
                        Plot: JSON.parse(body).Plot,
                        Actors: JSON.parse(body).Actors
                    };
                    console.log("**************************************************************");
                    console.log("* The movie is: " + moviesObject.Name);
                    console.log("* Released Year: " + moviesObject.Year);
                    console.log("* IMDB Rating: " + moviesObject.imdbRating);
                    console.log("* Rotten Tomatoes Rating: " + moviesObject.rottenRating);
                    console.log("* Production Country: " + moviesObject.Production);
                    console.log("* Languages: " + moviesObject.Language);
                    console.log("* Plot of the movie: " + moviesObject.Plot);
                    console.log("* Actors: " + moviesObject.Actors);
                    console.log("**************************************************************");

                    fs.appendFileSync("log.txt", JSON.stringify(moviesObject, null, 2));
                };
            });
        } else {
            var request = require("request");
            var queryUrl = "http://www.omdbapi.com/?t=mr+nobody&apikey=faa36345";
            request(queryUrl, function(error, response, body){
                if (!error && response.statusCode === 200) {
                    var moviesObject = {
                        Name: JSON.parse(body).Title,
                        Year: JSON.parse(body).Year,
                        imdbRating: JSON.parse(body).imdbRating,
                        rottenRating: JSON.parse(body).Ratings[1].Value,
                        Production: JSON.parse(body).Country,
                        Language: JSON.parse(body).Language,
                        Plot: JSON.parse(body).Plot,
                        Actors: JSON.parse(body).Actors
                    };
                    console.log("**************************************************************");
                    console.log("* The movie is: " + moviesObject.Name);
                    console.log("* Released Year: " + moviesObject.Year);
                    console.log("* IMDB Rating: " + moviesObject.imdbRating);
                    console.log("* Rotten Tomatoes Rating: " + moviesObject.rottenRating);
                    console.log("* Production Country: " + moviesObject.Production);
                    console.log("* Languages: " + moviesObject.Language);
                    console.log("* Plot of the movie: " + moviesObject.Plot);
                    console.log("* Actors: " + moviesObject.Actors);
                    console.log("**************************************************************");

                    fs.appendFileSync("log.txt", JSON.stringify(moviesObject, null, 2));
                };
            });
        };
    });
};

function doWhatISay() {
    fs.readFile("random.txt", "utf-8", function(error, data) {
        if (error) {
            return console.log(error);
          }
        var dataArr = data.split(",");
        var answer = {};
        answer.spotifyName = dataArr[1];
        spotify(answer);      
    });
};