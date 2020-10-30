var express    = require("express"),
	router     = express.Router(),
	Campground = require("../models/campground"),
	Comment    = require("../models/comment"),
	MWO        = require("../middleware");

// use that code if you want the user will add comments in spcial page:=>>>>>>>>>>
// router.get("/campgrounds/:id/comments/new", MWO.isLoggedIn, (req, res) => {
// 	Campground.findById(req.params.id,(err, campground) => {
// 		if(err) {
// 			console.log(err);
// 			req.flash("error", "Campgrounds not found");
// 			res.redirect("back");
// 		} else {
// 			res.render("comments/new", {campground: campground});
// 		};
// 	});
// });

router.post("/campgrounds/:id/comments", MWO.isLoggedIn, (req, res) => {
	Campground.findById(req.params.id,(err, campground) => {
		if(err) {
			console.log(err);
			req.flash("error", "Campgrounds not found");
			res.redirect("/campgrounds");
		} else {
			Comment.create(req.body.comment, (err, comment) => {
                if(err){
                    console.log(err);
                    req.flash("error", "Faild to create a comment");
					res.redirect("back");
                } else {
                	comment.author.id = req.user._id;
                	comment.author.username = req.user.username;
                	comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success", "Comment has neen created");
                    res.redirect(`/campgrounds/${campground._id}`);
            	};
            });
		};
	});
});

router.get("/campgrounds/:id/comments/:comments_id/edit", MWO.checkCommentsOwnership, (req, res) => {

	Comment.findById(req.params.comments_id, (err, foundComment) => {
		if(err) {
			console.log(err);
			req.flash("error", "Comment not found");
			res.redirect("back");
		} else {
			res.render("comments/edit", {campground_id: req.params.id, comment: foundComment})
		};
	});
});

router.put("/campgrounds/:id/comments/:comments_id/", MWO.checkCommentsOwnership, (req, res) => {
	Comment.findByIdAndUpdate(req.params.comments_id, req.body.comment, (err, updatedComment) => {
		if(err) {
			console.log(err);
			req.flash("error", "Comment not found");
			res.redirect("back");
		} else {
			req.flash("success", "Comment has neen updated");
			res.redirect(`/campgrounds/${req.params.id}`);
		};
	})
})

router.delete("/campgrounds/:id/comments/:comments_id/", MWO.checkCommentsOwnership, (req, res) => {
	Comment.findByIdAndRemove(req.params.comments_id, err => {
		if(err) {
			req.flash("error", "Comment not found");
			res.redirect("back");
		} else {
			req.flash("success", "Comment has neen deleted");
			res.redirect(`/campgrounds/${req.params.id}`);
		}
	});
});


module.exports = router;