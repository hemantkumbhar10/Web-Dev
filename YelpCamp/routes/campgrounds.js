const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');           //to catch async error
const {isLoggedIn, validateCampground, isAuthor} = require('../middleware');
const campgrounds = require('../controllers/campgorunds');
const multer = require('multer');
const {storage} = require('../cloudinary');
const upload = multer({storage});


router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn,upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground));


router.get('/new',isLoggedIn, campgrounds.renderNewForm);

router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground,catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, catchAsync(campgrounds.deleteCampground));

router.get('/:id/edit', isLoggedIn, isAuthor,catchAsync(campgrounds.renderEditForm));


module.exports = router;