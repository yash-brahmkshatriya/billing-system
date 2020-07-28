module.exports = {
    ensureAuthenticated:function(req,res,next){
        console.log('EA->',req.headers);
        if(req.isAuthenticated()){return next()}
        // res.redirect('/api/user/login')
        res.json("Access Denied")
    },
    forwardAuthenticated: function(req,res,next){
        if(!req.isAuthenticated()){return next()}
        res.redirect('/dashboard')
    }
}