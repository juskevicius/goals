const Unit = require('../models/Unit');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const passport = require('passport');

//Handle user create on GET

exports.user_create_get = (req, res, next) => {
    User.find({}, (err, users) => {
        if (err) { return err; }
        res.render("./pug/userCreate.pug", { users: users});
    });
};

// Handle user create on POST
exports.user_create_post = (req, res, next) => {
    /*
    body('empId').isLength({ min: 1 }).trim().withMessage('EmpId empty.'),
    body('name').isLength({ min: 1 }).trim().withMessage('Name empty.'),
    body('password').isLength({ min: 1 }).trim().withMessage('Password empty.'),
    body('role').isLength({ min: 1 }).trim().withMessage('Role empty.'),*/

    const newUser = new User(
        {
            empId: req.body.empId,
            name: req.body.name,
            role: req.body.role
        }
        );
    newUser.setPassword(req.body.password);
    return newUser.save(
         (err) => {
            if (err) { return err; }
            res.redirect('/users');
        }
    );
}

// Handle user update on POST
exports.user_update_post = (req, res, next) => {


    /*body('empId').isLength({ min: 1 }).trim().withMessage('EmpId empty.'),
    body('name').isLength({ min: 1 }).trim().withMessage('Name empty.'),
    body('role').isLength({ min: 1 }).trim().withMessage('Role empty.'),*/
  
    User.findById(req.body.id, (err, user) => {
        if (err) { return err; }
        user.empId = req.body.empId;
        user.name = req.body.name;
        user.role = req.body.role;
        if (req.body.password) {
            user.setPassword(req.body.password);
        }
        user.save((err) => {
            if (err) return err;
            res.redirect('/users');
        });
    });
}

// Handle user delete on POST
exports.user_delete_post = (req, res, next) => {

    /*body('empId').isLength({ min: 1 }).trim().withMessage('EmpId empty.'),
    body('name').isLength({ min: 1 }).trim().withMessage('Name empty.'),
    body('role').isLength({ min: 1 }).trim().withMessage('Role empty.')*/

    // Data from form is valid. Update the user
    User.findByIdAndRemove(req.body.id, (err) => {
        if (err) { return err; }
        res.redirect('/users');
    });
}


// Handle user login on GET

exports.user_login_get = function(req, res, next) {
    res.render('login.jsx');
};

// Handle user login on POST

exports.user_login_post = (req, res, next) => {
    passport.authenticate('local', { session: false }, (err, passportUser, info) => {
        if(err) { return err; }
        if(passportUser) {
        const user = passportUser;
        user.token = passportUser.generateJWT();
        res.locals.currUser = user._id;
        res.cookie("Token", user.token, { httpOnly: true, secure: false, maxAge: 2592000000 });
        return next();
        }
        return res.status(422).json({ "Login": "Unsuccessful. Either id or password is incorrect" });
    })(req, res, next);
}

// Handle unit create on GET.
exports.unit_create_get = function(req, res) {
    Unit.
    find({}).
    populate("parentTo").
    populate("childTo").
    populate("owner").
    exec((err, units) => {
        if (err) { return err; }
        User.find({}, (err, users) => {
            if (err) { return err; }
            console.log('results: ');
            console.log(units);
            console.log(users);
            return res.send({ units, users});
        });
    });
};

exports.unit_create_post = (req, res) => {
    /* Create a new user */
    var newUnit = new Unit({
        name: req.body.name,
        owner: req.body.owner,
        unitType: req.body.unitType,
        parentTo: req.body.parentTo,
        childTo: req.body.childTo,
    });
    newUnit.save((err) => {
        if (err) { return err; }
        res.redirect('/units');
    });
};

exports.unit_update_post = (req, res) => {
    
    Unit.findById(req.body.id, (err, unit) => {
        if (err) { return err; }
        /* Update existing unit */
        unit.name = req.body.name ? req.body.name : unit.name;
        unit.owner = req.body.owner ? req.body.owner : unit.owner;
        unit.unitType = req.body.unitType ? req.body.unitType : unit.unitType;
        unit.parentTo = req.body.parentTo ? req.body.parentTo : unit.parentTo;
        unit.childTo = req.body.childTo ? req.body.childTo : unit.childTo;
        unit.save((err) => {
            if (err) { return err; }
            res.redirect('/units');
        });
    });
}

exports.logout_get = (req, res) => {
    req.logout();
    res.cookie("Token", "", { expires: new Date(0)});
    res.redirect("/login");
};

exports.unit_delete_post = (req, res) => {
    Unit.findByIdAndRemove(req.body.id, (err) => {
        if (err) { return err; }
        res.redirect('/units');
    });
};
