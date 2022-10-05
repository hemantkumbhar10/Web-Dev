//DB for intiallization to just work on with
const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const {places, descriptors} = require('./seedHelpers');


mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true
})

const db = mongoose.connection;   
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', ()=>{
    console.log('DataBase connected');
});

const sample = array =>array[Math.floor(Math.random()*array.length)];

const seedDB = async() =>{
    await Campground.deleteMany({});           //deleting everythin bfore starting
    for(let i=0; i < 200; i++){
        const random1000 = Math.floor(Math.random()*1000);
        const price = Math.floor(Math.random()*20)+10;
        const camp = new Campground({
            author:'60e288d949089e2aa4bb0e1e',  //my user id
            location:`${cities[random1000].city}, ${cities[random1000].state}`,
            title:`${sample(descriptors)} ${sample(places)}`,
            description:'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolorem exercitationem error tenetur dolore tempore mollitia natus maxime beatae quaerat eius, expedita in voluptatum, ullam quam magnam vitae quae provident obcaecati.',
            price,
            geometry:{ 
              "type" : "Point", 
              "coordinates" : [ 
                cities[random1000].longitude,
                cities[random1000].latitude,
              ] 
            },
            images: [
                {
                  url: 'https://res.cloudinary.com/dl77ic1lh/image/upload/v1625527489/YelpCamp/r5t1kg8dqk3hl3ojwbot.jpg',
                  filename: 'YelpCamp/r5t1kg8dqk3hl3ojwbot'
                },
                {
                  url: 'https://res.cloudinary.com/dl77ic1lh/image/upload/v1625527503/YelpCamp/zac10umr8jyzdoqzhmqr.jpg',
                  filename: 'YelpCamp/zac10umr8jyzdoqzhmqr'
                },
                {
                  url: 'https://res.cloudinary.com/dl77ic1lh/image/upload/v1625527512/YelpCamp/mmbbuevb8lxtbzt1oz6n.jpg',
                  filename: 'YelpCamp/mmbbuevb8lxtbzt1oz6n'
                }
              ]
        });
        await camp.save();
    }
}

seedDB().then(()=>{                           //to close connection after executing
    mongoose.connection.close();
})