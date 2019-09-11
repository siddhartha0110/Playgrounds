var express=require("express"),
    app=express(),
    bodyparser=require("body-parser"),
    mongoose=require("mongoose"),
    Plays=require("./models/plays"),
    Comment=require("./models/comments"),
    seedDB=require("./seeds");

mongoose.connect("mongodb://localhost:27017/playgrounds",{useNewUrlParser:true});
app.use(bodyparser.urlencoded({extended:true}));
app.set("view engine","ejs");
seedDB();

app.get("/",function(req,res){
    res.render("Home");
});

app.get("/playgrounds",function(req,res){
    Plays.find({},function(err,allgames){
        if(err)
        console.log("Error");
        else{
            res.render("playgrounds/index",{games:allgames});
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
app.get("/playgrounds/:id/comments/new",function(req,res){
    Plays.findById(req.params.id,function(err,find){
        if(err)
        console.log(err);
        else{
            res.render("comments/new",{game:find});
        }
    })
     
}); 

app.post("/playgrounds/:id/comments",function(req,res){
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

app.get("*",function(req,res){
    res.send("Error(404) Page Not Found");
});


app.listen(3000,function(){
    console.log("Server Has Started");
    
});
