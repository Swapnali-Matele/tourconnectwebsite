const assert = require('node:assert/strict');
const { describe, it, before, beforeEach, after, afterEach } = require('node:test');
const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

const app = require('../app');
const Tour = require('../models/Tour');

const buildValidTour = (tourId) => ({
  tour_id: tourId,
  title: 'Sunset Coastal Escape',
  description: 'A relaxing coastal tour with scenic viewpoints, beach stops, and guided cultural highlights.',
  pick_up: 'Grand Hotel Lobby',
  meeting_point: 'Central Plaza Station',
  drop_off: 'Seaview Resort',
  duration: 3.5,
  duration_unit: 'hours',
  image: 'https://example.com/images/sunset-coastal-escape.jpg'
});

describe('Tour API', () => {
  let mongoServer;

  before(async () => {
    mongoServer = await MongoMemoryServer.create({
      binary: {
        version: '7.0.14'
      }
    });
    await mongoose.connect(mongoServer.getUri(), { dbName: 'tourconnect-test' });
  });

  beforeEach(async () => {
    await Tour.deleteMany({});
  });

  afterEach(async () => {
    await Tour.deleteMany({});
  });

  after(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  it('GET /tour returns 200 and empty list', async () => {
    const res = await request(app).get('/tour');

    assert.equal(res.status, 200);
    assert.deepEqual(res.body, { data: { tour_options: [] } });
  });

  it('POST /tour creates a tour', async () => {
    const payload = buildValidTour(100001);

    const res = await request(app).post('/tour').send(payload);

    assert.equal(res.status, 201);
    assert.equal(res.body.message, 'Tour Created Successfully');
    assert.equal(res.body.data.tour_id, payload.tour_id);
    assert.equal(res.body.data.title, payload.title);
    assert.equal(res.body.data.description, payload.description);
    assert.equal(res.body.data.pick_up, payload.pick_up);
    assert.equal(res.body.data.meeting_point, payload.meeting_point);
    assert.equal(res.body.data.drop_off, payload.drop_off);
    assert.equal(res.body.data.duration, payload.duration);
    assert.equal(res.body.data.duration_unit, payload.duration_unit);
    assert.equal(res.body.data.image, payload.image);
  });

  it('POST /tour rejects duplicate tour_id', async () => {
    const payload = buildValidTour(100002);

    await request(app).post('/tour').send(payload);
    const res = await request(app).post('/tour').send(payload);

    assert.equal(res.status, 409);
    assert.match(res.body.message, /already exists/i);
  });

  it('POST /tour rejects invalid payload', async () => {
    const res = await request(app)
      .post('/tour')
      .send({
        title: '',
        description: '',
        pick_up: '',
        meeting_point: '',
        drop_off: ''
      });

    assert.equal(res.status, 400);
    assert.equal(res.body.success, false);
    assert.equal(res.body.message, 'Validation failed');
    assert.ok(Array.isArray(res.body.errors));
  });

  it('PUT /tour/:id updates an existing tour', async () => {
    const created = await Tour.create(buildValidTour(100003));

    const res = await request(app)
      .put(`/tour/${created.tour_id}`)
      .send({
        title: 'Updated Coastal Escape',
        description: 'Updated coastal tour description.',
        duration: 4,
        duration_unit: 'hours',
        image: 'https://example.com/images/updated.jpg'
      });

    assert.equal(res.status, 200);
    assert.equal(res.body.message, 'Updated Coastal Escape updated Successfully');
    assert.equal(res.body.data.title, 'Updated Coastal Escape');
    assert.equal(res.body.data.description, 'Updated coastal tour description.');
    assert.equal(res.body.data.duration, 4);
    assert.equal(res.body.data.duration_unit, 'hours');
    assert.equal(res.body.data.image, 'https://example.com/images/updated.jpg');
  });

  it('PUT /tour/:id returns 404 when the record does not exist', async () => {
    const res = await request(app)
      .put('/tour/999999')
      .send({ title: 'No Match' });

    assert.equal(res.status, 404);
    assert.match(res.body.message, /not found/i);
  });

  it('DELETE /tour/:id deletes an existing tour', async () => {
    const created = await Tour.create(buildValidTour(100004));

    const res = await request(app).delete(`/tour/${created.tour_id}`);

    assert.equal(res.status, 200);
    assert.equal(res.body.message, 'Sunset Coastal Escape deleted Successfully');

    const stored = await Tour.findOne({ tour_id: created.tour_id });
    assert.equal(stored, null);
  });

  it('DELETE /tour/:id returns 404 when the record does not exist', async () => {
    const res = await request(app).delete('/tour/999999');

    assert.equal(res.status, 404);
    assert.match(res.body.message, /not found/i);
  });
});
