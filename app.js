var express=require("express"),
    app=express(),
    bodyparser=require("body-parser"),
    mongoose=require("mongoose"),
    Plays=require("./models/plays"),
    Comment=require("./models/comments"),
    seedDB=require("./seeds"),
    methodOverride=require("method-override"),
    passport=require("passport"),
    User=require("./models/user"),
    LocalStrategy=require("passport-local"),
    flash=require("connect-flash");

var commentRoutes=require("./routes/comments");
var playgroundRoutes=require("./routes/playgrounds");
var indexRoutes=require("./routes/index");

mongoose.connect("mongodb://localhost:27017/playgrounds",{useNewUrlParser:true});
app.use(bodyparser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));
app.use(flash());
//seedDB(); Database Seeding

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

app.use(function(req,res,next){
    res.locals.currentUser=req.user;
    res.locals.error=req.flash("error");
    res.locals.success=req.flash("success");
    next();
});

app.use("/playgrounds/:id/comments",commentRoutes);
app.use("/playgrounds",playgroundRoutes);
app.use(indexRoutes);

const PORT=process.env.PORT || 3000

app.listen(PORT,function(){
    console.log("Server Has Started");
    
});
