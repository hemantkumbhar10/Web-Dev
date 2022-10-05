//HANDLING ERRORS

//'Error' is built in error which is parent class from which we extending(creating)
//child class 'ExpressError'
class ExpressError extends Error{
    constructor(message,statusCode){                   //'consrtructor()' creates instance/object of the class
        super();                             //It is used to call the constructor of the parent class and to access the parent's properties and methods.
        this.message = message;
        this.statusCode = statusCode;
    }
}

module.exports = ExpressError;