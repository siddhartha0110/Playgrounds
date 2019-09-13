var mongoose = require("mongoose");
var Plays = require("./models/plays");
var Comment = require("./models/comments");

var data = [
    {
        name: "PUBG", 
        image: "https://cdn.dnaindia.com/sites/default/files/styles/full/public/2019/03/13/801559-pubg-03.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    },
    {
        name: "Counter Strike:Global Offensive", 
        image: "https://mmogamerstore.com/wp-content/uploads/2018/04/ss_counter-stike-global-offensive_00-600x330.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    },
    {
        name: "Call Of Duty:Modern Warfare", 
        image:"https://cnet3.cbsistatic.com/img/_0zdgWycLfDPiYq4lwsJUAYujfs=/1092x0/2019/05/30/de0f3d58-8b69-4473-9f02-d0984b80cc60/mw-reveal-03-wm.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    }
]

function seedDB(){
   //Remove all campgrounds
   Plays.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed campgrounds!");
        Comment.remove({}, function(err) {
            if(err){
                console.log(err);
            }
            console.log("removed comments!");
             //add a few campgrounds
            data.forEach(function(seed){
                Plays.create(seed, function(err, games){
                    if(err){
                        console.log(err)
                    } else {
                        console.log("added a campground");
                        //create a comment
                        Comment.create(
                            {
                                text: "Galat Hi Game Banaya Hai Bhai",
                                author: "MishraJi"
                            }, function(err, comment){
                                if(err){
                                    console.log(err);
                                } else {
                                    games.comments.push(comment);
                                    games.save();
                                    console.log("Created new comment");
                                }
                            });
                    }
                });
            });
        });
    }); 
}
module.exports = seedDB;