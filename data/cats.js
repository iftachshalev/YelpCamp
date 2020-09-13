const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/cat_app', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));

var catchema = new mongoose.Schema({
	name: String,
	age: Number,
	temperament: String
});

var Cat = mongoose.model("Cat", catchema)

// var George = new Cat({
// 	name: "if",
// 	age: 13,
// 	temperament: "fff"
// });

// George.save(function(err, cat){
// 	if(err) {
// 		console.log("WRONG!!!");
// 	} else {
// 		console.log("WE JUST SAVED A CAT TO THE DB: ");
// 		console.log(cat);
// 	};
// });


// Cat.create({
// 	name: "ifTAch",
// 	age: 1133,
// 	temperament: "fffeee"
// }, function(err, cat) {
// 	if(err) {
// 		console.log(err);
// 	} else {
// 		console.log(cat);
// 	}
// });

Cat.find({}, function(err, cats) {
	if(err) {
		console.log("OH NO, ERROR!!");
		console.log(err);
	} else {
		console.log("ALL THE CATS.....");
		console.log(cats);
	};
});