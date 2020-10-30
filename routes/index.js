var express  = require("express"),
	router   = express.Router(),
	passport = require("passport"),
	User     = require("../models/user"),
	MWO      = require("../middleware");

router.get("/", function(req, res){
	res.render("landing");
});

router.get("/register", (req, res) => res.render("register"));

router.post("/register", (req, res) => {
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user){
		if(err) {
			console.log(err);
			req.flash("error", err.message);
			res.redirect("/register");
		}
		passport.authenticate("local")(req, res, () => {
			req.flash("success", "Welcome to YelpCamp, " + user.username);
			res.redirect("/campgrounds")
		});
	});
});

router.get("/login", (req, res) => res.render("login"));

router.post("/login", passport.authenticate("local", {
	successRedirect: "/campgrounds", 
	failureRedirect: "/login"
}), (req, res) => {});

router.get("/logout", (req, res) => {
	req.logout();
	req.flash("success", "You had Logged out!")
	res.redirect("/campgrounds");
});

module.exports = router;