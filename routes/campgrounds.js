var express    = require("express"),
	router     = express.Router(),
	Campground = require("../models/campground");


router.get("/campgrounds", function(req, res){
	Campground.find({}, function(err, allCampgrounds) {
		if(err) {
			console.log(err);
		} else {
			res.render("campgrounds/index", {camp: allCampgrounds});
		};
	});
});

router.get("/campgrounds/new", isLoggedIn, function(req, res){
	res.render("campgrounds/new")
});

router.post("/campgrounds", isLoggedIn, (req, res) => {
	const name          = req.body.name,
		image           = req.body.image,
		desc            = req.body.description,
		newCampground   = {name: name, image: image, description: desc, author: {id: req.user._id, username: req.user.username}};
	Campground.create(newCampground, (err, campground) => {
		if(err) {
			console.log(err);
		} else {
			res.redirect("/campgrounds")
		};
	});
	
});

router.get("/campgrounds/:id", (req, res) => {

	Campground.findById(req.params.id).populate("comments").exec((err, foundCampground) => {
		if(err) {
			console.log(err);
		} else {
			res.render("campgrounds/show", {campground: foundCampground});
		};
	});
});

router.get("/campgrounds/:id/edit", checkCampgroundOwnership, (req, res) => {
	Campground.findById(req.params.id, (err, foundCampground) => {
		res.render("campgrounds/edit", {campground: foundCampground});
	});
});

router.put("/campgrounds/:id/edit", checkCampgroundOwnership, (req, res) => {
	var data = {name: req.body.name, image: req.body.image, description:req.body.description};
	Campground.findByIdAndUpdate(req.params.id, data, (err, updateCamp) => {
		if(err) {
			console.log(err);
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds/" + req.params.id);
		};
	})
});

router.delete("/campgrounds/:id", checkCampgroundOwnership, (req, res) => {
	Campground.findByIdAndRemove(req.params.id, (err) => {
		if(err) {
			console.log(err);
		};
		res.redirect("/campgrounds");
	})
})

function isLoggedIn(req, res, next) {
	if(req.isAuthenticated()) {
		return next();
	};
	res.redirect("/login")
};

function checkCampgroundOwnership(req, res, next) {
	if(req.isAuthenticated()) {
		Campground.findById(req.params.id, (err, foundCampground) => {
			if(err) {
				console.log(err);
				res.redirect("back")
			} else {
				if(foundCampground.author.id.equals(req.user._id)) {
					next()
				} else {
					res.redirect("back");
				};
			};
		});
	} else {
		res.redirect("back");
	};
};

module.exports = router;