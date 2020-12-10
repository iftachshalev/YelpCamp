const express    = require("express"),
	router     = express.Router(),
	Campground = require("../models/campground"),
	Comment = require("../models/comment"),
	MWO        = require("../middleware");


router.get("/campgrounds", function(req, res){
	Campground.find({}, function(err, allCampgrounds) {
		if(err) {
			console.log(err);
			req.flash("error", "Campgrounds not found");
			res.redirect("back");
		} else {
			res.render("campgrounds/index", {camp: allCampgrounds});
		};
	});
});

router.get("/campgrounds/new", MWO.isLoggedIn, function(req, res){
	res.render("campgrounds/new")
});

router.post("/campgrounds", MWO.isLoggedIn, (req, res) => {
	const name          = req.body.name,
		price           = req.body.price,
		image           = req.body.image,
		location        = req.body.location,
		desc            = req.body.description,
		newCampground   = {name: name, price: price, image: image, location: location, description: desc, author: {id: req.user._id, username: req.user.username}};
	function isNumber(n) { return /^-?[\d.]+(?:e-?\d+)?$/.test(n);} 
	if(isNumber(price)) {
		Campground.create(newCampground, (err, campground) => {
			if(err) {
				console.log(err);
				req.flash("error", "Can't create a campground");
				res.redirect("back");
			} else {
				res.redirect("/campgrounds")
			};
		});
	} else {
		req.flash("error", "Something went wrong");
		res.redirect("back");
	};
});

router.get("/campgrounds/:id", (req, res) => {

	Campground.findById(req.params.id).populate("comments").exec((err, foundCampground) => {
		if(err) {
			console.log(err);
			req.flash("error", "Campground not found");
			res.redirect("back");
		} else {
			res.render("campgrounds/show", {campground: foundCampground});
		};
	});
});

router.get("/campgrounds/:id/edit", MWO.checkCampgroundOwnership, (req, res) => {
	Campground.findById(req.params.id, (err, foundCampground) => {
		if(err) {
			req.flash("error", "Campground not found");
			res.redirect("back");
		} else {
			res.render("campgrounds/edit", {campground: foundCampground});
		};
	});
});

router.put("/campgrounds/:id/edit", MWO.checkCampgroundOwnership, (req, res) => {
	var data = {name: req.body.name, price: req.body.price, location: req.body.location, image: req.body.image, description:req.body.description};
	Campground.findByIdAndUpdate(req.params.id, data, (err, updateCamp) => {
		if(err) {
			console.log(err);
			req.flash("error", "Campground not found");
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds/" + req.params.id);
		};
	})
});

router.delete("/campgrounds/:id", MWO.checkCampgroundOwnership, (req, res) => {
	Campground.findByIdAndRemove(req.params.id, (err) => {
		if(err) {
			console.log(err);
			req.flash("error", "Campground not found");
			res.redirect("back");
		};
		req.flash("success", "Campground had been deleted");
		res.redirect("/campgrounds");
	})
})

module.exports = router;