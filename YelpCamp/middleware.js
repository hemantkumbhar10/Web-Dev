const ExpressError  = require('./utils/ExpressError');     //to do something with catched error
const {campgroundSchema} = require('./schemas');
const Campground = require('./models/campground');          //importing created database
const {reviewSchema} = require('./schemas');
const Review = require('./models/review');

module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        //store the url requesting
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'YOU MUST BE SIGNED');
        return res.redirect('/login');
    }
    next();
}

module.exports.validateCampground = (req,res,next)=>{                //So the client doesnt affetc the for by 'Postman' or any other illegal way
    const {error} = campgroundSchema.validate(req.body);   //so it prevents any error from  client side
    if(error){
        const msg = error.details.map(el => el.message).join(','); //joins all error strings and sends back
        throw new ExpressError(msg, 400);
    }else{
        next();
    }
}

module.exports.isAuthor = async(req,res,next)=>{
    const {id} = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)){
        req.flash('error', 'You dont have permission to this action');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

module.exports.isReviewAuthor = async(req,res,next)=>{
    const {id, reviewId} = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)){
        req.flash('error', 'You dont have permission to this action');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

module.exports.validateReview=(req,res,next)=>{
    const {error} = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el=>el.message).join(',');
    }else{
        next();
    }
}

