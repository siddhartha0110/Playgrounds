var express=require("express"),
    app=express(),
    bodyparser=require("body-parser"),
    mongoose=require("mongoose"),
    Plays=require("./models/plays"),
    Comment=require("./models/comments"),
    seedDB=require("./seeds"),
    passport=require("passport"),
    User=require("./models/user"),
    LocalStrategy=require("passport-local");

mongoose.connect("mongodb://localhost:27017/playgrounds",{useNewUrlParser:true});
app.use(bodyparser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static(__dirname+"/public"));
app.use(function(req,res,next){
    res.locals.currentUser=req.user;
    next();
});

seedDB();
/*----------------------------------
PASSPORT CONFIG.----------------------------------*/
app.use(require("express-session")({
    secret:"Encoding and Decoding Use For Users",
    resave:false,
    saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.get("/",function(req,res){
    res.render("Home");
});

app.get("/playgrounds",function(req,res){
    

    Plays.find({},function(err,allgames){
        if(err)
        console.log("Error");
        else{
            res.render("playgrounds/index",{games:allgames,currentUser:req.user});
        }
        
    });
    
});

app.post("/playgrounds",function(req,res){
    var name=req.body.name;
    var image=req.body.image;
    var desc=req.body.description;
    var newPlayground={name:name,image:image,description:desc};
    Plays.create(newPlayground,function(err,newadd){
        if(err)
        console.log("Error");
        else
        res.redirect("/playgrounds");
    })
    
});

app.get("/playgrounds/new",function(req,res){
    res.render("playgrounds/new");
});

app.get("/playgrounds/:id",function(req,res){
    Plays.findById(req.params.id).populate("comments").exec(function(err,find){
        if(err)
        console.log(err);
        else{
        console.log(find);
        res.render("playgrounds/show",{game:find});
        }
    });
});


//Comments Routes
app.get("/playgrounds/:id/comments/new",isLoggedIn,function(req,res){
    Plays.findById(req.params.id,function(err,find){
        if(err)
        console.log(err);
        else{
            res.render("comments/new",{game:find});
        }
    })
     
}); 

app.post("/playgrounds/:id/comments",isLoggedIn,function(req,res){
    Plays.findById(req.params.id,function(err,find){
        if(err){
        console.log(err);
        res.redirect("/playgrounds");}
        else{
            Comment.create(req.body.comment,function(err,comment){
                if(err)
                console.log(err);
                else{
                    find.comments.push(comment);
                    find.save();
                    res.redirect("/playgrounds/"+find._id);
                }
            })
        }
        
    })
});

/*Adding Authentication Routes
---------------------------------*/
app.get("/register",function(req,res){
    res.render("register");
})

app.post("/register",function(req,res){
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

app.get("/login",function(req,res){
    res.render("login");
});

app.post("/login",passport.authenticate("local",{
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

app.get("/logout",function(req,res){
    req.logOut(); 
    res.redirect("/playgrounds");
    console.log("Successfully Logged Out!!!");
    
})

app.get("*",function(req,res){
    res.send("Error(404) Page Not Found");
});


app.listen(3000,function(){
    console.log("Server Has Started");
    
});
