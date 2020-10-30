var Campground = require("../models/campground"),
	Comment    = require("../models/comment");


const middlewareObj = {
	isLoggedIn: function(req, res, next) {
		if(req.isAuthenticated()) {
			return next();
		};
		req.flash("error", "You need to be logged in to do that");
		res.redirect("/login");
	},

	checkCommentsOwnership: function(req, res, next) {
		if(req.isAuthenticated()) {
			Comment.findById(req.params.comments_id, (err, foundComment) => {
				if(err) {
					console.log(err);
					req.flash("error", "Comment not found");
					res.redirect("back");
				} else {
					if(foundComment.author.id.equals(req.user._id)) {
						next();
					} else {
						req.flash("error", "You don't have permission to do that");
						res.redirect("back");
					};
				};
			});
		} else {
			req.flash("error", "You need to be logged in to do that");
			res.redirect("back");
		};
	},

	checkCampgroundOwnership: function(req, res, next) {
		if(req.isAuthenticated()) {
			Campground.findById(req.params.id, (err, foundCampground) => {
				if(err) {
					req.flash("error", "Campground not found");
					console.log(err);
					res.redirect("back");
				} else {
					if(foundCampground.author.id.equals(req.user._id)) {
						next()
					} else {
						req.flash("error", "You don't have permission to do that");
						res.redirect("back");
					};
				};
			});
		} else {
			req.flash("error", "You need to be logged in to do that");
			res.redirect("back");
		};
	}
}



module.exports = middlewareObj