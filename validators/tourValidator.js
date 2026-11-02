const { body, param } = require('express-validator');

const createTourValidation = [
  body('tour_id')
    .notEmpty()
    .withMessage('tour_id is required')
    .isInt({ min: 1 })
    .withMessage('tour_id must be a positive integer'),
  body('title')
    .notEmpty()
    .withMessage('title is required')
    .isString()
    .withMessage('title must be a string')
    .trim()
    .isLength({ min: 1 })
    .withMessage('title cannot be empty'),
  body('description')
    .notEmpty()
    .withMessage('description is required')
    .isString()
    .withMessage('description must be a string')
    .trim()
    .isLength({ min: 1 })
    .withMessage('description cannot be empty'),
  body('pick_up')
    .notEmpty()
    .withMessage('pick_up is required')
    .isString()
    .withMessage('pick_up must be a string')
    .trim(),
  body('meeting_point')
    .notEmpty()
    .withMessage('meeting_point is required')
    .isString()
    .withMessage('meeting_point must be a string')
    .trim(),
  body('drop_off')
    .notEmpty()
    .withMessage('drop_off is required')
    .isString()
    .withMessage('drop_off must be a string')
    .trim(),
  body('duration')
    .optional()
    .isFloat({ min: 0.1 })
    .withMessage('duration must be a positive number'),
  body('duration_unit')
    .optional()
    .isIn(['days', 'hours', 'weeks', 'months'])
    .withMessage('duration_unit must be one of days, hours, weeks, or months'),
  body('image').optional().isString().withMessage('image must be a string')
];

const updateTourValidation = [
  param('id')
    .notEmpty()
    .withMessage('Tour id is required')
    .isInt({ min: 1 })
    .withMessage('Tour id must be a positive integer'),
  body('title')
    .optional()
    .isString()
    .withMessage('title must be a string')
    .trim()
    .isLength({ min: 1 })
    .withMessage('title cannot be empty'),
  body('description')
    .optional()
    .isString()
    .withMessage('description must be a string')
    .trim()
    .isLength({ min: 1 })
    .withMessage('description cannot be empty'),
  body('pick_up')
    .optional()
    .isString()
    .withMessage('pick_up must be a string')
    .trim(),
  body('meeting_point')
    .optional()
    .isString()
    .withMessage('meeting_point must be a string')
    .trim(),
  body('drop_off')
    .optional()
    .isString()
    .withMessage('drop_off must be a string')
    .trim(),
  body('duration')
    .optional()
    .isFloat({ min: 0.1 })
    .withMessage('duration must be a positive number'),
  body('duration_unit')
    .optional()
    .isIn(['days', 'hours', 'weeks', 'months'])
    .withMessage('duration_unit must be one of days, hours, weeks, or months'),
  body('image').optional().isString().withMessage('image must be a string')
];

const deleteTourValidation = [
  param('id')
    .notEmpty()
    .withMessage('Tour id is required')
    .isInt({ min: 1 })
    .withMessage('Tour id must be a positive integer')
];

module.exports = {
  createTourValidation,
  updateTourValidation,
  deleteTourValidation
};
