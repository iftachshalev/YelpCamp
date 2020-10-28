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

router.get("/campgrounds/:id/comments/:comments_id/edit", checkCommentsOwnership, (req, res) => {

	Comment.findById(req.params.comments_id, (err, foundComment) => {
		if(err) {
			console.log(err);
			res.redirect("back");
		} else {
			res.render("comments/edit", {campground_id: req.params.id, comment: foundComment})
		};
	});
});

router.put("/campgrounds/:id/comments/:comments_id/", checkCommentsOwnership, (req, res) => {
	Comment.findByIdAndUpdate(req.params.comments_id, req.body.comment, (err, updatedComment) => {
		if(err) {
			res.redirect("back");
		} else {
			res.redirect(`/campgrounds/${req.params.id}`);
		};
	})
})

router.delete("/campgrounds/:id/comments/:comments_id/", checkCommentsOwnership, (req, res) => {
	Comment.findByIdAndRemove(req.params.comments_id, err => {
		if(err) {
			res.redirect("back");
		} else {
			res.redirect(`/campgrounds/${req.params.id}`);
		}
	});
});

function isLoggedIn(req, res, next) {
	if(req.isAuthenticated()) {
		return next();
	};
	res.redirect("/login")
};

function checkCommentsOwnership(req, res, next) {
	if(req.isAuthenticated()) {
		Comment.findById(req.params.comments_id, (err, foundComment) => {
			if(err) {
				console.log(err);
				res.redirect("back")
			} else {
				if(foundComment.author.id.equals(req.user._id)) {
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