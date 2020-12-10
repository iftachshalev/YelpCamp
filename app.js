// !requires! >>>>>>>
const express             = require("express"),
	app                   = express(),
	bodyParser            = require("body-parser"),
	port                  = 3000,
	User                  = require("./models/user"),
	seedsDB               = require("./seeds/index"),
	mongoose              = require('mongoose'),
	passport              = require("passport"),
	flash                 = require("connect-flash"),
	LocalStrategy         = require("passport-local"),
	passportLocalMongoose = require("passport-local-mongoose"),
	Campground            = require("./models/campground"),
	Comment               = require("./models/comment"),
	session               = require("express-session"),
	methodOverride        = require("method-override"),
	commentRoutes         = require("./routes/comments"),
	campgroundsRoutes     = require("./routes/campgrounds"),
	indexRoutes           = require("./routes/index");
// <<<<<<<< !requires!

seedsDB();
mongoose.set('useFindAndModify', false);
mongoose.connect('mongodb://localhost:27017/yelp_camp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));
app.use(session({
	secret: "!!?!!?!!?!!?>>>>??!??!??!??!",
	resave: false,
	saveUninitialized: false
}));
app.use(flash())
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({extended: true}));
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use((req, res, next) => {
	res.locals.currentUser = req.user;
	res.locals.success = req.flash("success");
	res.locals.error = req.flash("error");
	next();
});


app.use(indexRoutes);
app.use(campgroundsRoutes);
app.use(commentRoutes);

app.listen(port,() => console.log("yelpcamp is listening..."));