# Tour Connect

Tour Connect is a simple Node.js backend project for managing tour information in MongoDB. It includes REST API endpoints, request validation, centralized error handling, Winston logging, Morgan HTTP logging, Swagger API documentation, and a basic browser-based API testing UI.

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose
- dotenv
- express-validator
- Winston
- Morgan
- Swagger
- swagger-ui-express

## Project Structure

```text
tour-connect/
├── config/
│   └── db.js
├── controllers/
│   └── tourController.js
├── docs/
│   └── swagger.js
├── logs/
├── middleware/
│   ├── errorMiddleware.js
│   └── validationMiddleware.js
├── models/
│   └── Tour.js
├── public/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── routes/
│   └── tourRoutes.js
├── utils/
│   └── logger.js
├── validators/
│   └── tourValidator.js
├── .env
├── .env.example
├── .gitignore
├── app.js
├── index.js
├── package.json
├── README.md
└── logs/
```

## Installation

1. Open the project folder.
2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file based on `.env.example`.

## Environment Variables

Create a `.env` file with the following:

```env
PORT=3000
MONGODB_URI=mongodb://username@host/database
NODE_ENV=development
```

## MongoDB Configuration

1. Make sure MongoDB is installed and running locally.
2. Create or use a database named `your-database-name`.
3. Set the connection string in `.env`:

```env
MONGODB_URI=mongodb://username@host/database
```

If MongoDB is not running, the application will fail to connect and log a clear error message.

## How to Run the Project

Development mode:

```bash
npm run dev
```

Production mode:

```bash
npm start
```

The server runs on port 3000 by default.

## API Endpoints

### GET /tour
Returns all tours.

### POST /tour
Creates a new tour.

### PUT /tour/:id
Updates a tour by `tour_id`.

### DELETE /tour/:id
Deletes a tour by `tour_id`.

## Request Example: Create Tour

```http
POST http://localhost:3000/tour
Content-Type: application/json

{
  "tour_id": 50872,
  "title": "Description of Tour",
  "description": "string",
  "pick_up": "string",
  "meeting_point": "string",
  "drop_off": "string",
  "duration": 2.5,
  "duration_unit": "days"
}
```

## Response Example: Successful Create

```json
{
  "message": "Tour Created Successfully",
  "data": {
    "tour_id": 50872,
    "title": "Description of Tour",
    "description": "string",
    "pick_up": "string",
    "meeting_point": "string",
    "drop_off": "string",
    "duration": 2.5,
    "duration_unit": "days"
  }
}
```

## Response Example: Get All Tours

```json
{
  "data": {
    "tour_options": [
      {
        "tour_id": 50872,
        "title": "Description of Tour",
        "description": "string",
        "pick_up": "string",
        "meeting_point": "string",
        "drop_off": "string",
        "duration": 2.5,
        "duration_unit": "days"
      }
    ]
  }
}
```

## Swagger Documentation

Swagger UI is available at:

```text
http://localhost:3000/api-docs
```

Swagger includes the endpoints, request body parameters, validation responses, and Tour schema.

## Logging

Winston logs are written to:

- `logs/combined.log`
- `logs/error.log`

Morgan logs all HTTP requests through the application logger.

## Validation

The backend validates required fields and invalid data for POST and PUT requests. Examples of invalid data include:

- missing `tour_id`
- invalid `tour_id`
- missing `title`
- empty `title`
- missing `description`
- invalid `duration`
- zero or negative `duration`

## Error Handling

Centralized middleware handles:

- validation errors
- duplicate `tour_id`
- tour not found
- MongoDB errors
- invalid request data
- unexpected errors

Responses are returned in JSON format without exposing stack traces in normal production responses.

## Basic UI

A simple browser UI is available at:

```text
http://localhost:3000/
```

It allows the user to:

- view all tours
- create a new tour
- update an existing tour
- delete a tour
- see toast notifications for success/error messages

## Testing Instructions

1. Start MongoDB.
2. Start the server:

```bash
npm run dev
```

3. Open the browser UI at `http://localhost:3000/`.
4. Use the UI or Postman/Insomnia to test the API.
5. Check the logs in the `logs` folder.
6. Open Swagger UI at `http://localhost:3000/api-docs`.

## Notes

This project focuses only on the required Tour Connect backend functionality and the simple API demonstration UI. It intentionally does not include authentication, booking, payment, user management, or other unrelated features.
