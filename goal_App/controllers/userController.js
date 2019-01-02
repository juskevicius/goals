const Unit = require('../models/Unit');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const passport = require('passport');


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
        return res.status(422).json({ "Login": "Login unsuccessful. Either id or password is incorrect" });
    })(req, res, next);
}

// Handle user logout on GET

exports.logout_get = (req, res) => {
    req.logout();
    res.cookie("Token", "", { expires: new Date(0)});
};

/////////////////////////// USER MANAGEMENT

//Handle user create on GET

exports.user_create_get = (req, res) => {
    User.find({}, (err, users) => {
        if (err) { return err; }
        return res.send({ users });
    });
};

// Handle user create on POST

exports.user_create_post = (req, res, next) => {
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
            return res.send('successfuly added a user');
        }
    );
}

// Handle user update on POST

exports.user_update_post = (req, res) => {
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
            return res.send('successfuly updated a user');
        });
    });
}

// Handle user delete on POST

exports.user_delete_post = (req, res, next) => {
    User.findByIdAndRemove(req.body.id, (err) => {
        if (err) { return err; }
        return res.send('successfuly deleted a user');
    });
}


/////////////////////////// UNIT MANAGEMENT


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
            return res.send({ units, users});
        });
    });
};

// Handle unit create on POST.

exports.unit_create_post = (req, res) => {
    /* Create a new unit */
    var newUnit = new Unit({
        name: req.body.name,
        owner: req.body.owner,
        unitType: req.body.unitType,
        parentTo: req.body.parentTo,
        childTo: req.body.childTo,
    });
    newUnit.save((err) => {
        if (err) { return err; }
        return res.send('successfuly added a unit');
    });
};

// Handle unit update on POST.

exports.unit_update_post = (req, res) => {
    Unit.findById(req.body.id, (err, unit) => {
        if (err) { return err; }
        /* Update existing unit */
        unit.set({
            name: req.body.name,
            owner: req.body.owner,
            unitType: req.body.unitType,
            parentTo: req.body.parentTo,
            childTo: req.body.childTo,
            _id: req.body.id
        });
        unit.save((err) => {
            if (err) { return err; }
            return res.send('successfuly updated a unit');
        });
    });
}

// Handle unit delete on POST.

exports.unit_delete_post = (req, res) => {
    Unit.findByIdAndRemove(req.body.id, (err) => {
        if (err) { return err; }
        return res.send('successfuly deleted a unit');
    });
};

