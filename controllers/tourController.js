const Tour = require('../models/Tour');
const logger = require('../utils/logger');

const getAllTours = async (req, res, next) => {
  try {
    logger.info('GET /tour called');
    const tours = await Tour.find({}).sort({ createdAt: -1 });

    res.status(200).json({
      data: {
        tour_options: tours.map((tour) => ({
          tour_id: tour.tour_id,
          title: tour.title,
          description: tour.description,
          pick_up: tour.pick_up,
          meeting_point: tour.meeting_point,
          drop_off: tour.drop_off,
          duration: tour.duration,
          duration_unit: tour.duration_unit
        }))
      }
    });
  } catch (error) {
    next(error);
  }
};

const createTour = async (req, res, next) => {
  try {
    logger.info('POST /tour called');

    const newTour = await Tour.create(req.body);
    logger.info(`Tour created: ${newTour.title}`);

    res.status(201).json({
      message: 'Tour Created Successfully',
      data: newTour
    });
  } catch (error) {
    if (error.code === 11000) {
      error.statusCode = 409;
      error.message = `Tour with tour_id ${req.body.tour_id} already exists.`;
    }
    next(error);
  }
};

const updateTour = async (req, res, next) => {
  try {
    logger.info(`PUT /tour/${req.params.id} called`);

    const existingTour = await Tour.findOne({ tour_id: Number(req.params.id) });

    if (!existingTour) {
      const error = new Error(`Tour with id ${req.params.id} not found`);
      error.statusCode = 404;
      throw error;
    }

    const validUpdateFields = ['title', 'description', 'pick_up', 'meeting_point', 'drop_off', 'duration', 'duration_unit', 'image'];
    const requestedUpdate = {};

    validUpdateFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        requestedUpdate[field] = req.body[field];
      }
    });

    const updatedTour = await Tour.findOneAndUpdate(
      { tour_id: Number(req.params.id) },
      { $set: requestedUpdate },
      { new: true, runValidators: true }
    );

    logger.info(`Tour updated: ${updatedTour.title}`);

    res.status(200).json({
      message: `${updatedTour.title} updated Successfully`,
      data: updatedTour
    });
  } catch (error) {
    next(error);
  }
};

const deleteTour = async (req, res, next) => {
  try {
    logger.info(`DELETE /tour/${req.params.id} called`);

    const deletedTour = await Tour.findOneAndDelete({ tour_id: Number(req.params.id) });

    if (!deletedTour) {
      const error = new Error(`Tour with id ${req.params.id} not found`);
      error.statusCode = 404;
      throw error;
    }

    logger.info(`Tour deleted: ${deletedTour.title}`);

    res.status(200).json({
      message: `${deletedTour.title} deleted Successfully`
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllTours,
  createTour,
  updateTour,
  deleteTour
};
