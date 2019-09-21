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
//Comment Edit Route
router.get("/:comment_id/edit",checkCommentOwner,function(req,res){
    Comment.findById(req.params.comment_id,function(err,found){
        if(err)
        res.redirect("back");
        else
        res.render("comments/edit",{game_id:req.params.id,comment:found});    
    });
    
});

//Comment Update Route
router.put("/:comment_id",checkCommentOwner,function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updated){
        if(err)
        res.redirect("back")
        else
        res.redirect("/playgrounds/"+req.params.id);
    });
});

//Comment Delete Route
router.delete("/:comment_id",checkCommentOwner,function(req,res){
    Comment.findByIdAndDelete(req.params.comment_id,function(error){
        if(error)
        res.redirect("back");
        else
        res.redirect("/playgrounds/"+req.params.id);
    })
});

//MiddleWare
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}
function checkCommentOwner(req,res,next)
{
    if(req.isAuthenticated())
    {  //if user is authenticated
        Comment.findById(req.params.comment_id,function(err,foundcomment){
            if(err){
                res.redirect("back");
            }
            else{
                 //check if game is comment by the current user 
                if(foundcomment.author.id.equals(req.user._id))
                next();
                else
                res.redirect("back");

            }
        });
    }
    else{
        res.redirect("back");
    }
}
module.exports=router;