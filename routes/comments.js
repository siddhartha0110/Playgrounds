var express=require("express");
var router=express.Router({mergeParams:true});
var Plays=require("../models/plays")
var Comment=require("../models/comments");
var middleware=require("../middleware/index");

//Add new Comment
router.get("/new",middleware.isLoggedIn,function(req,res){
    Plays.findById(req.params.id,function(err,find){
        if(err)
        console.log(err);
        else{
            res.render("comments/new",{game:find});
        }
    })
     
}); 

//Create New Comment
router.post("/",middleware.isLoggedIn,function(req,res){
    Plays.findById(req.params.id,function(err,find){
        if(err){
        console.log(err);
        res.redirect("/playgrounds");}
        else{
            Comment.create(req.body.comment,function(err,comment){
                if(err){
                    req.flash("error","Something Went Wrong.Please Try Again!!") ;
                    console.log(err);
                }
                else{
                    //add username and id to comment
                    comment.author.id=req.user._id;
                    comment.author.username=req.user.username;
                    //save the comment
                    comment.save();
                    find.comments.push(comment);
                    find.save();
                    console.log(comment);         
                    req.flash("success","Comment Posted!");
                    res.redirect("/playgrounds/"+find._id);
                }
            })
        }
        
    })
});

//Comment Edit Route
router.get("/:comment_id/edit",middleware.checkCommentOwner,function(req,res){
    Comment.findById(req.params.comment_id,function(err,found){
        if(err)
        res.redirect("back");
        else
        res.render("comments/edit",{game_id:req.params.id,comment:found});    
    });
    
});

//Comment Update Route
router.put("/:comment_id",middleware.checkCommentOwner,function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updated){
        if(err)
        res.redirect("back")
        else
        res.redirect("/playgrounds/"+req.params.id);
    });
});

//Comment Delete Route
router.delete("/:comment_id",middleware.checkCommentOwner,function(req,res){
    Comment.findByIdAndDelete(req.params.comment_id,function(error){
        if(error)
        res.redirect("back");
        else
        {
            req.flash("success","Comment Deleted Successfully!");
            res.redirect("/playgrounds/"+req.params.id);
        }
        
    })
});

module.exports=router;