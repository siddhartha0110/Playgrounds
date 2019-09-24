var Plays=require("../models/plays");
var Comment=require("../models/comments");
var middlewareObj={};

middlewareObj.checkGameOwner=function(req,res,next)
{
    if(req.isAuthenticated())
    {  
        Plays.findById(req.params.id,function(err,foundgame){
            if(err){
                req.flash("error","Game Not Found");
                res.redirect("back");
            }
            else{
                 //check if game is added by the current user 
                if(foundgame.author.id.equals(req.user._id))
                next();
                else
                {
                    req.flash("error","Permission Denied!!");
                    res.redirect("back");
                }

            }
        });
    }
    else{
        req.flash("error","You need to be logged in to do that!");
        res.redirect("back");
    }
};

middlewareObj.checkCommentOwner=function(req,res,next)
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
        req.flash("error","You Need To Be Logged In To Do That!");
        res.redirect("back");
    }
};

middlewareObj.isLoggedIn=function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","Please Login To Proceed");
    res.redirect("/login");
};

module.exports=middlewareObj;