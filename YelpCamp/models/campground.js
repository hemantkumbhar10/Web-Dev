//Here we create database to store, retrieve and send

//mongoose to interact with mongodb through javascript
const mongoose = require('mongoose');
const Schema = mongoose.Schema;         //to get blueprint ofcourse
const Review = require('./review');

const ImageSchema = new Schema({
    url:String,
    filename:String
})

ImageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload', '/upload/w_200');
})

const opts = {toJSON:{virtuals:true}};

//database blueprint
const CampgroundSchema = new Schema({
    title:String,
    images:[ImageSchema],
    geometry: {
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
      },
    price:Number,
    description:String,
    location:String,
    author:{
        type: Schema.Types.ObjectId,
        ref:'User'
    },
    reviews:[
        {
            type:Schema.Types.ObjectId,      //It stores individual reviews ID in this array on that same campgorund(ONE TO MANY)
            ref:'Review'                    //where the reviews are accessed from this reference,
        }
    ]
},opts);

CampgroundSchema.virtual('properties.popUpMarkup').get(function(){
    return `
    <strong><a href='/campgrounds/${this._id}'>${this.title}</a></strong>
    <p>${this.description.substring(0,20)}...</p>`
})


//DELETING whole campground including its reviews using mongoose middleware
CampgroundSchema.post('findOneAndDelete', async function(doc){
    if(doc){
        await Review.deleteMany({
            _id:{
                $in:doc.reviews
            }
        })
    }
})

//exporting outside this file when it called. 
//'Campground' is name assigned to scehma 'CampgroundSchema'.
module.exports = mongoose.model('Campground', CampgroundSchema);
