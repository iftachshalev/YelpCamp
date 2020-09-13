const express         = require("express"),
	app               = express(),
	bodyParser        = require("body-parser"),
	port              = 3000,
	mongoose          = require('mongoose'),
	Campground        = require("./models/campground"),
	seedDB            = require("./seeds")

seedDB();
mongoose.connect('mongodb://localhost:27017/yelp_camp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");


app.get("/", function(req, res){
	res.render("landing");
});

app.get("/campgrounds", function(req, res){
	Campground.find({}, function(err, allCampgrounds) {
		if(err) {
			console.log(err);
		} else {
			res.render("campgrounds/index", {camp: allCampgrounds});
		};
	});
});

app.get("campgrounds/new", function(req, res){
	res.render("campgrounds/new")
});

app.post("/campgrounds", function(req, res){
	var name            = req.body.name,
		image           = req.body.image,
		desc            = req.body.description,
		newCampground   = {name: name, image: image, description: desc}
	Campground.create(newCampground, function(err, campground) {
		if(err) {
			console.log(err);
		} else {
			console.log("ADD!!");
			res.redirect("/campgrounds")
		};
	});
	
});

app.get("/campgrounds/:id", function(req, res) {

	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
		if(err) {
			console.log(err);
		} else {
			console.log(foundCampground)
			res.render("campgrounds/show", {campground: foundCampground});
		};
	});
});

app.get("/campgrounds/:id/comments/new", function(req, res) {
	res.render("comments/new");
});

app.listen(port, function() {
	console.log("yelpcamp is listening...");
});