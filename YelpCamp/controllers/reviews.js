const Campground = require('../models/campground');          //importing created database
const Review = require('../models/review');                  //getting defined review schema



module.exports.createReview = async(req,res)=>{
    const campground = await Campground.findById(req.params.id);       //getting first of that campground id where review is submiited
    const review = new Review(req.body.review);                        //geting submitted review from requested(requested to post) body
    review.author =req.user._id;
    campground.reviews.push(review);                                   //pushing review to for that particular campground schema 
    await review.save();
    await campground.save();
    req.flash('success', 'Review submitted successfully');
    res.redirect(`/campgrounds/${campground._id}`);
};


module.exports.deleteReview = async(req,res)=>{       //removing referenceID and removing review itself so deleting two things at on0ce
    const {id,reviewId} = req.params;
    await Campground.findByIdAndUpdate(id, {$pull:{reviews:reviewId}})   //pulls that one requested reviewid from array and filter(deletes) that one id from array
    await Review.findByIdAndDelete(reviewId);                            //deletes review by given id   
    req.flash('success', 'Review deleted successfully');
    res.redirect(`/campgrounds/${id}`);
}