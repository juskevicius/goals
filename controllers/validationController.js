const { body, param, cookie, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

function isNumeric(obj) {
  return !Array.isArray(obj) && (obj - parseFloat(obj) + 1) >= 0;
}

exports.validate_cookie = [
  cookie('Token').isJWT().withMessage('Token is incorrect'),
  cookie('Token').trim().escape(),

  (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }
    return res.status(422).json({
      errors: {
        message: errors.array(),
      },
    });
  },
];

exports.user_login_post = [
  body('empId').trim().escape().isLength({ min: 1 }).withMessage('EmpId empty.'),
  body('password').trim().escape().isLength({ min: 1 }).withMessage('Password empty.'),
  sanitizeBody('*').trim().escape(),

  (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }
    return res.status(422).json({
      errors: {
        message: errors.array(),
      },
    });
  },
];

exports.goal_add_post = [
  body('name').trim().escape().isLength({ min: 1, max: 100 })
    .withMessage('Goal failure. Max length is 100 sybmols.'),
  body('initScore').trim().escape().optional({ checkFalsy: true }).isNumeric().isLength({ max: 11 }).withMessage('Initial score failure'),
  body('targScore').trim().escape().optional({ checkFalsy: true }).isNumeric().isLength({ max: 11 }).withMessage('Target score failure'),
  body('comment').trim().escape().isLength({ max: 400 }).withMessage('Comment is too long'),
  body('task').trim().escape().custom((task) => {
    for (let i = 0; i < task.length; i += 1) {
      if (task[i].description.length > 200 || (task[i].weight && (!isNumeric(task[i].weight) || task[i].weight.toString().length > 11))) {
        return false;
      }
    }
    return true;
  }).withMessage('Task failure. Max task length is 200 symbols. Task weight must be numeric.'),

  sanitizeBody('*').trim().escape(),

  (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }
    return res.status(422).json({
      errors: {
        message: errors.array(),
      },
    });
  },
];

exports.goal_details_get = [
  param('id').trim().escape().custom((id) => { return id.match(/^[a-fA-F0-9]{24}$/) ? true : false; }).withMessage('id is not valid'),
  sanitizeBody('*').trim().escape(),

  (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }
    return res.status(422).json({
      errors: {
        message: errors.array(),
      },
    });
  },
];

exports.goal_score_post = [
  body('id').trim().escape().custom((id) => { return id.match(/^[a-fA-F0-9]{24}$/) ? true : false; }).withMessage('id is not valid'),
  body('entryId').trim().escape().optional({ checkFalsy: true }).custom((id) => { return id.match(/^[a-fA-F0-9]{24}$/) ? true : false; }).withMessage('id is not valid'),
  body('value').trim().escape().isNumeric().isLength({ min: 1, max: 11 }).withMessage('Current score failure'),
  body('date').trim().escape().isISO8601().withMessage('Date is not valid'),

  sanitizeBody('*').trim().escape(),

  (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }
    return res.status(422).json({
      errors: {
        message: errors.array(),
      },
    });
  },
];

exports.goal_scoreDelete_post = [
  body('id').trim().escape().custom((id) => { return id.match(/^[a-fA-F0-9]{24}$/) ? true : false; }).withMessage('id is not valid'),
  body('entryId').trim().escape().custom((id) => { return id.match(/^[a-fA-F0-9]{24}$/) ? true : false; }).withMessage('id is not valid'),

  sanitizeBody('*').trim().escape(),

  (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }
    return res.status(422).json({
      errors: {
        message: errors.array(),
      },
    });
  },
];


exports.goal_editWeight_post = [
  body('id').trim().escape().custom((id) => { return id.match(/^[a-fA-F0-9]{24}$/) ? true : false; }).withMessage('id is not valid'),
  body('weight').trim().escape().optional({ checkFalsy: true }).isNumeric().isLength({ max: 11 }).withMessage('Current score failure'),

  sanitizeBody('*').trim().escape(),

  (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }
    return res.status(422).json({
      errors: {
        message: errors.array(),
      },
    });
  },
];


exports.goal_taskImplementation_post = [
  body('id').trim().escape().custom((id) => { return id.match(/^[a-fA-F0-9]{24}$/) ? true : false; }).withMessage('id is not valid'),
  body('taskId').trim().escape().custom((id) => { return id.match(/^[a-fA-F0-9]{24}$/) ? true : false; }).withMessage('Task id is not valid'),
  body('implemented').trim().escape().optional({ checkFalsy: true }).isNumeric().isLength({ max: 11 }).withMessage('Implementation score failure'),
  body('weight').trim().escape().optional({ checkFalsy: true }).isNumeric().isLength({ max: 11 }).withMessage('weight failure'),
  body('description').trim().escape().isLength({ min: 1, max: 200 }).withMessage('Task description failure. Max length is 200 sybmols.'),

  sanitizeBody('*').trim().escape(),

  (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }
    return res.status(422).json({
      errors: {
        message: errors.array(),
      },
    });
  },
];


//                      MY OWN GOALS:

// Handle Goal myOwn on GET.
// nothing to validate - JWT (validated) -> req.payload


// Handle Goal edit on POST.

exports.goal_edit_post = [
  body('id').trim().escape().custom((id) => { return id.match(/^[a-fA-F0-9]{24}$/) ? true : false; }).withMessage('id is not valid'),
  body('name').trim().escape().isLength({ min: 1, max: 100 }).withMessage('Goal failure. Max length is 100 sybmols.'),
  body('initScore').trim().escape().optional({ checkFalsy: true }).isNumeric().isLength({ max: 11 }).withMessage('Initial score failure'),
  body('targScore').trim().escape().optional({ checkFalsy: true }).isNumeric().isLength({ max: 11 }).withMessage('Target score failure'),
  body('comment').trim().escape().isLength({ max: 400 }).withMessage('Comment is too long'),
  body('task').trim().escape().optional({ checkFalsy: true }).custom((task) => { 
    for (let i = 0; i < task.length; i += 1) {
      if (task[i].description.length > 200 || (task[i].weight && (!isNumeric(task[i].weight) || task[i].weight.toString().length > 11))) {
        return false;
      }
    }
    return true;
  }).withMessage('Task failure. Max task length is 200 symbols. Task weight must be numeric.'),

  sanitizeBody('*').trim().escape(),

  (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }
    return res.status(422).json({
      errors: {
        message: errors.array(),
      },
    });
  },
];

// Handle Goal delete on POST.

exports.goal_delete_post = [
  body('id').trim().escape().custom((id) => { return id.match(/^[a-fA-F0-9]{24}$/) ? true : false; }).withMessage('id is not valid'),
  sanitizeBody('*').trim().escape(),

  (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }
    return res.status(422).json({
      errors: {
        message: errors.array(),
      },
    });
  },
];

// Handle Goal offerTo on POST.

exports.goal_offerTo_post = [
  body('id').trim().escape().custom((id) => { return id.match(/^[a-fA-F0-9]{24}$/) ? true : false; }).withMessage('id is not valid'),
  body('name').trim().escape().isLength({ min: 1, max: 100 }).withMessage('Goal failure. Max length is 100 sybmols.'),
  body('offers.*.owner').trim().escape().custom((id) => { return id.match(/^[a-fA-F0-9]{24}$/) ? true : false; }).withMessage('owner id is not valid'),
  body('offers.*.initScore').trim().escape().optional({ checkFalsy: true }).isNumeric().isLength({ max: 11 }).withMessage('Initial score failure'),
  body('offers.*.targScore').trim().escape().optional({ checkFalsy: true }).isNumeric().isLength({ max: 11 }).withMessage('Target score failure'),
  body('offers.*.comment').trim().escape().isLength({ max: 400 }).withMessage('Comment is too long'),
  body('offers.*.task').trim().escape().custom((task) => { 
    for (let i = 0; i < task.length; i += 1) {
      if (task[i].description.length > 200 || (task[i].weight && (!isNumeric(task[i].weight) || task[i].weight.toString().length > 11))) {
        return false;
      }
    }
    return true;
  }).withMessage('Task failure. Max task length is 200 symbols. Task weight must be numeric.'),

  sanitizeBody('*').trim().escape(),

  (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }
    return res.status(422).json({
      errors: {
        message: errors.array(),
      },
    });
  },
];

// Handle Goal accept offer on POST.

exports.goal_acceptOffer_post = [
  body('id').trim().escape().custom((id) => { return id.match(/^[a-fA-F0-9]{24}$/) ? true : false; }).withMessage('id is not valid'),
  sanitizeBody('*').trim().escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }
    return res.status(422).json({
      errors: {
        message: errors.array(),
      },
    });
  },
];

// Handle Goal owners offer on POST.

exports.goal_ownersOffer_post = [
  body('id').trim().escape().custom((id) => { return id.match(/^[a-fA-F0-9]{24}$/) ? true : false; }).withMessage('id is not valid'),
  body('name').trim().escape().isLength({ min: 1, max: 100 }).withMessage('Goal failure. Max length is 100 sybmols.'),
  body('initScore').trim().escape().optional({ checkFalsy: true }).isNumeric().isLength({ max: 11 }).withMessage('Initial score failure'),
  body('targScore').trim().escape().optional({ checkFalsy: true }).isNumeric().isLength({ max: 11 }).withMessage('Target score failure'),
  body('comment').trim().escape().isLength({ max: 400 }).withMessage('Comment is too long'),
  body('task').trim().escape().custom((task) => {
    for (let i = 0; i < task.length; i += 1) {
      if (task[i].description.length > 200 || (task[i].weight && (!isNumeric(task[i].weight) || task[i].weight.toString().length > 11))) {
        return false;
      }
    }
    return true;
  }).withMessage('Task failure. Max task length is 200 symbols. Task weight must be numeric.'),

  sanitizeBody('*').trim().escape(),

  (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }
    return res.status(422).json({
      errors: {
        message: errors.array(),
      },
    });
  },
];

//                   OTHERS' GOALS:

// Handle Goal others' on GET.
// nothing to validate - JWT (validated) -> req.payload

// Handle Goal approvers offer on POST.

exports.goal_approversOffer_post = [
  body('id').trim().escape().custom((id) => { return id.match(/^[a-fA-F0-9]{24}$/) ? true : false; }).withMessage('id is not valid'),
  body('name').trim().escape().isLength({ min: 1, max: 100 }).withMessage('Goal failure. Max length is 100 sybmols.'),
  body('initScore').trim().escape().optional({ checkFalsy: true }).isNumeric().isLength({ max: 11 }).withMessage('Initial score failure'),
  body('targScore').trim().escape().optional({ checkFalsy: true }).isNumeric().isLength({ max: 11 }).withMessage('Target score failure'),
  body('comment').trim().escape().isLength({ max: 400 }).withMessage('Comment is too long'),
  body('task').trim().escape().custom((task) => {
    for (let i = 0; i < task.length; i += 1) {
      if (task[i].description.length > 200 || (task[i].weight && (!isNumeric(task[i].weight) || task[i].weight.toString().length > 11))) {
        return false;
      }
    }
    return true;
  }).withMessage('Task failure. Max task length is 200 symbols. Task weight must be numeric.'),

  sanitizeBody('*').trim().escape(),

  (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }
    return res.status(422).json({
      errors: {
        message: errors.array(),
      },
    });
  },
];

// Handle Goal approve offer on POST.

exports.goal_approve_post = [
  body('id').trim().escape().custom((id) => { return id.match(/^[a-fA-F0-9]{24}$/) ? true : false; }).withMessage('id is not valid'),
  sanitizeBody('*').trim().escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }
    return res.status(422).json({
      errors: {
        message: errors.array(),
      },
    });
  },
];

// Handle Goal reject on POST.

exports.goal_reject_post = [
  body('id').trim().escape().custom((id) => { return id.match(/^[a-fA-F0-9]{24}$/) ? true : false; }).withMessage('id is not valid'),
  sanitizeBody('*').trim().escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }
    return res.status(422).json({
      errors: {
        message: errors.array(),
      },
    });
  },
];
