const { cookie,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

// Handle user create on POST
exports.validate_cookie = [

    cookie('Token').isJWT().withMessage('Token is incorrect'),
    
    cookie('Token').trim().escape(),

    (req, res, next) => {
        
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // There are errors
            // res.status(422).json({ errors: errors.array() });
            return res.redirect("/login");
        }
        else {
            next();
        }
    }

];


