const mongoose = require('mongoose');
const cities = require('./cities');
const users = require('./users');
const stringsForComments = require('./commentsStrings');
const images = require('./images');
const description = require('./description');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');
const Comment = require('../models/comment');

mongoose.set('useFindAndModify', false);
mongoose.connect('mongodb://localhost:27017/yelp_camp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.catch(error => console.log(error.message));

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Campground.deleteMany({});
    await Comment.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const priceNum = Math.floor(Math.random() * 58);
        const imageNum = Math.floor(Math.random() * images.length);
        const userCampNum = Math.floor(Math.random() * users.length);
        const descriptionNum = Math.floor(Math.random() * description.length);
        const numOfComments = Math.floor(Math.random() * 15);
        let commentsIdArray = [];
        for(let i = 0; i < numOfComments; ++i) {
            const userCommentsNum = Math.floor(Math.random() * users.length);
            const textComment = Math.floor(Math.random() * stringsForComments.length);
            Comment.create({text: stringsForComments[textComment]}, (err, comment) => {
                if(err){
                    console.log(err);
                    req.flash("error", "Faild to create a comment");
                    res.redirect("back");
                } else {
                    // comment.author = users[userCommentsNum];
                    comment.author.id = users[userCommentsNum].id;
                    comment.author.username = users[userCommentsNum].username;
                    // console.log(comment.author)
                    comment.save();
                    commentsIdArray.push(comment._id);
                };
            });
        };
        campOb = {
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            name: `${sample(descriptors)} ${sample(places)}`,
            price: priceNum,
            // image: images[imageNum],
            image: "https://source.unsplash.com/collection/190727/1600x1180",
            description: description[descriptionNum],
            author: users[userCampNum]
        }
        let camp = Campground.create(campOb, (err, campground) => {
            if(err) {
                console.log(err);
            } else {
                commentsIdArray.forEach((id) => {
                    campground.comments.push(id);
                })
                campground.save();
            };
        });
    }
}

module.exports = seedDB