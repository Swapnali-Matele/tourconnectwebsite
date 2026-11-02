const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema(
  {
    tour_id: {
      type: Number,
      required: [true, 'tour_id is required'],
      unique: true,
      trim: true
    },
    title: {
      type: String,
      required: [true, 'title is required'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'description is required'],
      trim: true
    },
    pick_up: {
      type: String,
      required: [true, 'pick_up is required'],
      trim: true
    },
    meeting_point: {
      type: String,
      required: [true, 'meeting_point is required'],
      trim: true
    },
    drop_off: {
      type: String,
      required: [true, 'drop_off is required'],
      trim: true
    },
    duration: {
      type: Number,
      min: [0.1, 'duration must be a positive number']
    },
    duration_unit: {
      type: String,
      enum: {
        values: ['days', 'hours', 'weeks', 'months'],
        message: 'duration_unit must be one of days, hours, weeks, or months'
      },
      default: 'days'
    },
    image: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
);

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
