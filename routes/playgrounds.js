var express=require("express");
var router=express.Router();
var Plays=require("../models/plays");
var middleware=require("../middleware/index");

router.get("/",function(req,res){
    Plays.find({},function(err,allgames){
        if(err)
        console.log("Error");
        else{
            res.render("playgrounds/index",{games:allgames,currentUser:req.user});
        }
    });
});

router.post("/",middleware.isLoggedIn,function(req,res){
    var name=req.body.name;
    var image=req.body.image;
    var desc=req.body.description;
    var author={
        id:req.user._id,
        username:req.user.username
    }
    var newPlayground={name:name,image:image,description:desc,author:author};
    Plays.create(newPlayground,function(err,newadd){
        if(err)
        console.log("Error");
        else
        res.redirect("/playgrounds");
    })
    
});

//Add New Game
router.get("/new",middleware.isLoggedIn,function(req,res){
    res.render("playgrounds/new");
    
});

//Show Comments
router.get("/:id",function(req,res){
    Plays.findById(req.params.id).populate("comments").exec(function(err,find){
        if(err)
        console.log(err);
        else{
        console.log(find);
        res.render("playgrounds/show",{game:find});
        }
    });
});

//Edit Games
router.get("/:id/edit",middleware.checkGameOwner,function(req,res){
    //user login check
        Plays.findById(req.params.id,function(err,foundgame){
            
            res.render("playgrounds/edit",{game:foundgame});

         });
    
}); 

//Update Games
router.put("/:id",middleware.checkGameOwner,function(req,res){
    Plays.findByIdAndUpdate(req.params.id,req.body.game,function(err,updatedGame){
        if(err)
        res.redirect("/playgrounds");
        else{
            res.redirect("/playgrounds/"+req.params.id);
        }
    })
});

//Delete Game
router.delete("/:id",middleware.checkGameOwner,function(req,res){
    Plays.findByIdAndRemove(req.params.id,function(err){
        if(err)
        res.redirect("/playgrounds");
        else
        res.redirect("/playgrounds");
    });
});


module.exports=router;