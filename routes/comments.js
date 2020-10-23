var express    = require("express"),
	router     = express.Router(),
	Campground = require("../models/campground"),
	Comment    = require("../models/comment");


router.get("/campgrounds/:id/comments/new", isLoggedIn, (req, res) => {
	Campground.findById(req.params.id,(err, campground) => {
		if(err) {
			console.log(err);
		} else {
			res.render("comments/new", {campground: campground});
		};
	});
	
});

router.post("/campgrounds/:id/comments", isLoggedIn, (req, res) => {
	Campground.findById(req.params.id,(err, campground) => {
		if(err) {
			console.log(err);
			res.redirect("/campgrounds");
		} else {
			Comment.create(req.body.comment, (err, comment) => {
                if(err){
                    console.log(err);
                } else {
                	comment.author.id = req.user._id;
                	comment.author.username = req.user.username;
                	comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect(`/campgrounds/${campground._id}`);
            	};
            });
		};
	});
});

router.get("/campgrounds/:id/comments/:comments_id/edit", (req, res) => {

	Comment.findById(req.params.comments_id, (err, foundComment) => {
		if(err) {
			console.log(err);
			res.redirect("back");
		} else {
			res.render("comments/edit", {campground_id: req.params.id, comment: foundComment})
		};
	});
});

function isLoggedIn(req, res, next) {
	if(req.isAuthenticated()) {
		return next();
	};
	res.redirect("/login")
};

module.exports = router;