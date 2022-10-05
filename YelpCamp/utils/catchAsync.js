
// below function 'func' teakes another function as argument, executes it
//And if it 'catch' error it return the error to 'next' where 'next' is error handling middleware
module.exports = func =>{
    return (req, res, next)=>{
        func(req,res,next).catch(next);
    }
}