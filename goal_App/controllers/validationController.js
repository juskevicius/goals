const { body, param, cookie, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

function isNumeric(obj){
  return !Array.isArray( obj ) && (obj - parseFloat( obj ) + 1) >= 0;
}


exports.validate_cookie = [
  cookie('Token').isJWT().withMessage('Token is incorrect'),
  cookie('Token').trim().escape(),

  (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }
    else {
      return res.status(422).json({
        errors: {
          message: errors.array()
        }
      });
    }
  }
];

exports.user_login_post = [
  body('empId').isLength({ min: 1 }).trim().withMessage('EmpId empty.'),
  body('password').isLength({ min: 1 }).trim().withMessage('Password empty.'),
  
  sanitizeBody('*').trim().escape(),

  (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }
    else {
      return res.status(422).json({
        errors: {
          message: errors.array()
        }
      });
    }
  }
];



exports.goal_add_post = [
  body('name').isLength({ min: 1, max: 100 }).trim().withMessage('Goal failure. Max length is 100 sybmols.'),
  body('initScore').trim().optional({ checkFalsy: true }).isNumeric().isLength({ max: 11 }).withMessage('Initial score failure'),
  body('targScore').trim().optional({ checkFalsy: true }).isNumeric().isLength({ max: 11 }).withMessage('Target score failure'),
  body('comment').isLength({ max: 400 }).trim().withMessage('Comment is too long'),
  body('task').custom(task => { 
    for (i = 0; i < task.length; i++) {
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
    } else {
      return res.status(422).json({
        errors: {
          message: errors.array()
        }
      });
    }
  }
];

exports.goal_details_get = [
  param('id').custom(id => {
    return id.match(/^[a-fA-F0-9]{24}$/) ? true : false;
  }).withMessage('id is not valid'),
  sanitizeBody('*').trim().escape(),

  (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    } else {
      return res.status(422).json({
        errors: {
          message: errors.array()
        }
      });
    }
  }
];

exports.goal_score_post = [
  body('id').custom(id => {
    return id.match(/^[a-fA-F0-9]{24}$/) ? true : false;
  }).withMessage('id is not valid'),
  body('entryId').trim().optional({ checkFalsy: true }).custom(id => {
    return id.match(/^[a-fA-F0-9]{24}$/) ? true : false;
  }).withMessage('id is not valid'),
  body('value').trim().isNumeric().isLength({ min: 1, max: 11 }).withMessage('Current score failure'),
  body('date').trim().isISO8601().withMessage('Date is not valid'),
  
  sanitizeBody('*').trim().escape(),

  (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    } else {
      return res.status(422).json({
        errors: {
          message: errors.array()
        }
      });
    }
  }
];


exports.goal_editWeight_post = [
  body('id').custom(id => {
    return id.match(/^[a-fA-F0-9]{24}$/) ? true : false;
  }).withMessage('id is not valid'),
  body('weight').trim().optional({ checkFalsy: true }).isNumeric().isLength({ max: 11 }).withMessage('Current score failure'),
  
  sanitizeBody('*').trim().escape(),

  (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    } else {
      return res.status(422).json({
        errors: {
          message: errors.array()
        }
      });
    }
  }
];


exports.goal_taskImplementation_post = [
  body('id').custom(id => {
    return id.match(/^[a-fA-F0-9]{24}$/) ? true : false;
  }).withMessage('id is not valid'),
  body('taskId').custom(id => {
    return id.match(/^[a-fA-F0-9]{24}$/) ? true : false;
  }).withMessage('Task id is not valid'),
  body('implemented').trim().optional({ checkFalsy: true }).isNumeric().isLength({ max: 11 }).withMessage('Implementation score failure'),
  body('weight').trim().optional({ checkFalsy: true }).isNumeric().isLength({ max: 11 }).withMessage('weight failure'),
  body('description').isLength({ min: 1, max: 200 }).trim().withMessage('Task description failure. Max length is 200 sybmols.'),
  
  sanitizeBody('*').trim().escape(),

  (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    } else {
      return res.status(422).json({
        errors: {
          message: errors.array()
        }
      });
    }
  }
];


/////////////////////////////////////////// MY OWN GOALS:

// Handle Goal myOwn on GET.
// nothing to validate - JWT (validated) -> req.payload


// Handle Goal edit on POST.

exports.goal_edit_post = [
  body('id').custom(id => {
    return id.match(/^[a-fA-F0-9]{24}$/) ? true : false;
  }).withMessage('id is not valid'),
  body('name').isLength({ min: 1, max: 100 }).trim().withMessage('Goal failure. Max length is 100 sybmols.'),
  body('initScore').trim().optional({ checkFalsy: true }).isNumeric().isLength({ max: 11 }).withMessage('Initial score failure'),
  body('targScore').trim().optional({ checkFalsy: true }).isNumeric().isLength({ max: 11 }).withMessage('Target score failure'),
  body('comment').isLength({ max: 400 }).trim().withMessage('Comment is too long'),
  body('task').custom(task => { 
    for (i = 0; i < task.length; i++) {
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
    } else {
      return res.status(422).json({
        errors: {
          message: errors.array()
        }
      });
    }
  }
];

// Handle Goal delete on POST.

exports.goal_delete_post = [
  body('id').custom(id => {
    return id.match(/^[a-fA-F0-9]{24}$/) ? true : false;
  }).withMessage('id is not valid'),
  sanitizeBody('*').trim().escape(),

  (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    } else {
      return res.status(422).json({
        errors: {
          message: errors.array()
        }
      });
    }
  }
];

// Handle Goal offerTo on POST.

exports.goal_offerTo_post = [
  
  body('id').custom(id => {
    return id.match(/^[a-fA-F0-9]{24}$/) ? true : false;
  }).withMessage('id is not valid'),
  body('name').isLength({ min: 1, max: 100 }).trim().withMessage('Goal failure. Max length is 100 sybmols.'),
  body('offers.*.owner').custom(id => { return id.match(/^[a-fA-F0-9]{24}$/) ? true : false; }).withMessage('owner id is not valid'),
  body('offers.*.initScore').optional({ checkFalsy: true }).isNumeric().isLength({ max: 11 }).withMessage('Initial score failure'),
  body('offers.*.targScore').trim().optional({ checkFalsy: true }).isNumeric().isLength({ max: 11 }).withMessage('Target score failure'),
  body('offers.*.comment').isLength({ max: 400 }).trim().withMessage('Comment is too long'),
  body('offers.*.task').custom(task => { 
    for (i = 0; i < task.length; i++) {
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
    } else {
      return res.status(422).json({
        errors: {
          message: errors.array()
        }
      });
    }
  }
];

// Handle Goal accept offer on POST.

exports.goal_acceptOffer_post = [
  body('id').custom(id => {
    return id.match(/^[a-fA-F0-9]{24}$/) ? true : false;
  }).withMessage('id is not valid'),
  sanitizeBody('*').trim().escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    } else {
      return res.status(422).json({
        errors: {
          message: errors.array()
        }
      });
    }
  }
];

// Handle Goal owners offer on POST.

exports.goal_ownersOffer_post = [
  body('id').custom(id => {
    return id.match(/^[a-fA-F0-9]{24}$/) ? true : false;
  }).withMessage('id is not valid'),
  body('name').isLength({ min: 1, max: 100 }).trim().withMessage('Goal failure. Max length is 100 sybmols.'),
  body('initScore').trim().optional({ checkFalsy: true }).isNumeric().isLength({ max: 11 }).withMessage('Initial score failure'),
  body('targScore').trim().optional({ checkFalsy: true }).isNumeric().isLength({ max: 11 }).withMessage('Target score failure'),
  body('comment').isLength({ max: 400 }).trim().withMessage('Comment is too long'),
  body('task').custom(task => { 
    for (i = 0; i < task.length; i++) {
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
    } else {
      return res.status(422).json({
        errors: {
          message: errors.array()
        }
      });
    }
  }
];

/////////////////////////////////////////// OTHERS' GOALS:

// Handle Goal others' on GET.
// nothing to validate - JWT (validated) -> req.payload

// Handle Goal approvers offer on POST.

exports.goal_approversOffer_post = [
  body('id').custom(id => {
    return id.match(/^[a-fA-F0-9]{24}$/) ? true : false;
  }).withMessage('id is not valid'),
  body('name').isLength({ min: 1, max: 100 }).trim().withMessage('Goal failure. Max length is 100 sybmols.'),
  body('initScore').trim().optional({ checkFalsy: true }).isNumeric().isLength({ max: 11 }).withMessage('Initial score failure'),
  body('targScore').trim().optional({ checkFalsy: true }).isNumeric().isLength({ max: 11 }).withMessage('Target score failure'),
  body('comment').isLength({ max: 400 }).trim().withMessage('Comment is too long'),
  body('task').custom(task => { 
    for (i = 0; i < task.length; i++) {
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
    } else {
      return res.status(422).json({
        errors: {
          message: errors.array()
        }
      });
    }
  }
];

// Handle Goal approve offer on POST.

exports.goal_approve_post = [
  body('id').custom(id => {
    return id.match(/^[a-fA-F0-9]{24}$/) ? true : false;
  }).withMessage('id is not valid'),
  sanitizeBody('*').trim().escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    } else {
      return res.status(422).json({
        errors: {
          message: errors.array()
        }
      });
    }
  }
];

// Handle Goal reject on POST.

exports.goal_reject_post = [
  body('id').custom(id => {
    return id.match(/^[a-fA-F0-9]{24}$/) ? true : false;
  }).withMessage('id is not valid'),
  sanitizeBody('*').trim().escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    } else {
      return res.status(422).json({
        errors: {
          message: errors.array()
        }
      });
    }
  }
];