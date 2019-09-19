var express=require("express");
var router=express.Router({mergeParams:true});
var Plays=require("../models/plays")
var Comment=require("../models/comments");

//Add new Comment
router.get("/new",isLoggedIn,function(req,res){
    Plays.findById(req.params.id,function(err,find){
        if(err)
        console.log(err);
        else{
            res.render("comments/new",{game:find});
        }
    })
     
}); 

//Create New Comment
router.post("/",isLoggedIn,function(req,res){
    Plays.findById(req.params.id,function(err,find){
        if(err){
        console.log(err);
        res.redirect("/playgrounds");}
        else{
            Comment.create(req.body.comment,function(err,comment){
                if(err)
                console.log(err);
                else{
                    //add username and id to comment
                    
                    comment.author.id=req.user._id;
                    comment.author.username=req.user.username;
                    //save the comment
                    comment.save();
                    find.comments.push(comment);
                    find.save();
                    console.log(comment);                    
                    res.redirect("/playgrounds/"+find._id);
                }
            })
        }
        
    })
});

//MiddleWare
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}
module.exports=router;