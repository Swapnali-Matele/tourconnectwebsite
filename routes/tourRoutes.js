/**
 * @swagger
 * tags:
 *   name: Tours
 *   description: Tour management endpoints
 */

const express = require('express');
const { getAllTours, createTour, updateTour, deleteTour } = require('../controllers/tourController');
const validate = require('../middleware/validationMiddleware');
const { createTourValidation, updateTourValidation, deleteTourValidation } = require('../validators/tourValidator');

const router = express.Router();

/**
 * @swagger
 * /tour:
 *   get:
 *     summary: Get all tours
 *     tags: [Tours]
 *     responses:
 *       200:
 *         description: List of tours retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     tour_options:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Tour'
 *       500:
 *         description: Server error
 */
router.get('/', getAllTours);

/**
 * @swagger
 * /tour:
 *   post:
 *     summary: Create a new tour
 *     tags: [Tours]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Tour'
 *     responses:
 *       201:
 *         description: Tour created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Tour Created Successfully
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       409:
 *         description: Duplicate tour id
 */
router.post('/', createTourValidation, validate, createTour);

/**
 * @swagger
 * /tour/{id}:
 *   put:
 *     summary: Update an existing tour
 *     tags: [Tours]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Tour id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               duration:
 *                 type: number
 *     responses:
 *       200:
 *         description: Tour updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Tour not found
 */
router.put('/:id', updateTourValidation, validate, updateTour);

/**
 * @swagger
 * /tour/{id}:
 *   delete:
 *     summary: Delete a tour
 *     tags: [Tours]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Tour id
 *     responses:
 *       200:
 *         description: Tour deleted successfully
 *       404:
 *         description: Tour not found
 */
router.delete('/:id', deleteTourValidation, validate, deleteTour);

module.exports = router;
