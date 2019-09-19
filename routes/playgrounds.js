var express=require("express");
var router=express.Router();
var Plays=require("../models/plays");

router.get("/",function(req,res){
    Plays.find({},function(err,allgames){
        if(err)
        console.log("Error");
        else{
            res.render("playgrounds/index",{games:allgames,currentUser:req.user});
        }
    });
});

router.post("/",isLoggedIn,function(req,res){
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

router.get("/new",isLoggedIn,function(req,res){
    res.render("playgrounds/new");
});

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

//MiddleWare
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports=router;