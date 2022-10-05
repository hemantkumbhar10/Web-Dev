if(process.env.NODE_ENV != 'production'){
    require('dotenv').config();
}

const express = require('express');
const app = express();
const path = require('path');                               //path for views directory to join with view engine
const mongoose = require('mongoose');
const methodOverride = require('method-override');          //used to fake 'put', 'path', 'delete' because form cand only send 'get' and 'post' requests
const ejsMate = require('ejs-mate');                         //used to make common template between multiple files
const ExpressError  = require('./utils/ExpressError');     //to do something with catched error
const session = require('express-session')                //for handling seesions and also for flash messages
const flash = require('connect-flash');                   //to show flash messages
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const helmet = require('helmet');
const MongoDBStore = require('connect-mongo')




const userRoutes = require('./routes/users');
const campgroundRoutes = require('./routes/campgrounds');       //imports campgrounds routes created
const reviewRoutes  = require('./routes/reviews');
const { getMaxListeners } = require('./models/user');
const ExpressMongoSanitize = require('express-mongo-sanitize');

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp';

//to connect with mongodb..
//assigning db name to 'yelp-camp'

mongoose.connect(dbUrl, {
    useNewUrlParser:true,                                   //these
    useCreateIndex:true,                                    //these
    useUnifiedTopology:true,                                 //and these are used to remove deprecation warningd
    useFindAndModify:false                                   //this too
})

//used for error handling in connection

const db = mongoose.connection;   
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', ()=>{
    console.log('DataBase connected');
});

//A template engine enables you to use static template files in your application. 
// At runtime, the template engine replaces variables in a template file with actual values, 
// and transforms the template into an HTML file sent to the client. This approach makes 
// it easier to design an HTML page. ie 'view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'views')); //The path.join() method joins all given path segments 
                                                //together using the platform-specific separator as a delimiter, then normalizes the 
                                                //resulting path.


app.use(express.static(path.join(__dirname, 'public')));  //makes 'public' directory accesisible to any file. make sure you add just '/' 
                                                          //before file name where you accesing it

const secret = process.env.SECRET || 'thisshouldbeabettersecret!';

const store = MongoDBStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret
    }
});

store.on('error', function(e){
    console.log('SESSION STORE ERROR')
});

const sessionConfig = {
    store,
    name:'yelp',
    secret,
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        //secure: true,
        expires:Date.now()+(1000*60*60*24*7),
        maxAge:1000*60*60*24*7
    }
}
app.use(session(sessionConfig));
app.use(flash());
app.use(helmet());

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css"
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];

const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dl77ic1lh/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);


//FOR PASSWORD AND USERNAME 
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{           //we store the 'success' flash message into 'locals' so can have access anywhere in tamplate
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');  //for new campground
    res.locals.error = req.flash('error');     //for error
    next();

})


//to parse(show to page) submitted data from form 
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));                         //'_method' used as query string in url for method override to use
app.engine('ejs', ejsMate);
app.use(ExpressMongoSanitize());


app.use('/', userRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);



//first home page
app.get('/', (req, res)=>{
    res.render('home')
});

                
//HANDLING ERRROR

app.all('*', (req,res,next)=>{
    next(new ExpressError('Page Not Found', 404))
})

app.use((err,req,res,next)=>{
    const {statusCode = 500}= err;
    if(!err.message) err.message ='Something went wrong';
    res.status(statusCode).render('error', {err})
})


const port = process.env.PORT || 3000;
app.listen(port, ()=>{
    console.log(`connected to port ${port}`);
})