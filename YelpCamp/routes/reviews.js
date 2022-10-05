const express = require('express');
const router = express.Router({mergeParams:true});  //for error 'cannot read property reviews of Null' we specify '{mergeParams:true}'
const catchAsync = require('../utils/catchAsync');           //to catch async error
const {isLoggedIn, validateReview, isReviewAuthor} = require('../middleware');
const reviews = require('../controllers/reviews');



router.post('/',isLoggedIn,  validateReview,catchAsync(reviews.createReview));

router.delete('/:reviewId', isLoggedIn, isReviewAuthor,catchAsync(reviews.deleteReview));

module.exports = router;