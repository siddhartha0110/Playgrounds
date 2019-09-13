var express=require("express");
var router=express.Router();
var passport=require("passport");
var User=require("../models/user");

router.get("/",function(req,res){
    res.render("Home");
});
//Comments Routes
/*Adding Authentication Routes
---------------------------------*/
router.get("/register",function(req,res){
    res.render("register");
})

router.post("/register",function(req,res){
    var newUser=new User({username:req.body.username});
    User.register(newUser,req.body.password,function(err,user){
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req,res,function(){
            res.redirect("/playgrounds");
        });
    })
})

router.get("/login",function(req,res){
    res.render("login");
});

router.post("/login",passport.authenticate("local",{
    successRedirect:"/playgrounds",
    failureRedirect:"/login"
}),function(req,res){   
    
});

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

router.get("/logout",function(req,res){
    req.logOut(); 
    res.redirect("/playgrounds");
    console.log("Successfully Logged Out!!!");
    
})

router.get("*",function(req,res){
    res.send("Error(404) Page Not Found");
});

module.exports=router;