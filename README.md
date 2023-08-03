# challenge_beer-tap-dispenser
A Complete well Commented and Tested code.

**Project Documentation: Dispenser API**

**Introduction:**

This project involves creating a Dispenser API that allows users to interact with dispensers. The API is built using Node.js, Express.js, and MongoDB. The API provides endpoints to create, retrieve, and update dispensers, as well as record dispenser usage and retrieve usage statistics.

**Main Flow:**

1. Add Dispenser to the Database.
(Post) `http://localhost:3000/dispensers/`
Body Request:
`{
    "flow_volume": "0.7"
}`

**Dispenser is closed initially.**

2. (Post) `http://localhost:3000/dispenser_usage`

Body Request:
`{
    "dispenserId": "64cb2585b552296d9511aa22"
}`

Response:
`{
    "message": "Opened"
}`

This will open the dispenser, make `is_open = true` of that dispenser and creates a new thread start working for tracking time. This thread check for status of `is_open` after every second and stops when status of `is_open` changes to `false`.

3. When Dispenser is closed again.

(Patch) `http://localhost:3000/dispensers/:id`

**Body Request:**
`{
    "is_open": "false"
}`

4. This thread stops and stores:
`dispenser_id,
start_time,
end_time,
money_made`

in `DispenserUsage` Collection.


**Requirements:**

To run this project, you need the following software installed on your system:

1. Node.js: The server-side JavaScript runtime environment.
2. MongoDB: A NoSQL database for storing dispenser and usage data.

**Getting Started:**

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/dispenser-api.git
   cd dispenser-api
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   - Create a `.env` file in the root directory.
   - Add the MongoDB connection URI and other necessary environment variables in the `.env` file:
     ```
     MONGODB_URI=mongodb://localhost:27017/dispenser-api
     PORT=3000
     ```

4. Start the server:
   ```
   npm start
   ```

**Endpoints:**

1. `POST /dispensers`: Create a new dispenser with flow volume, open status, total usage time, and total money made.

2. `GET /dispensers`: Retrieve all dispensers in the database.

3. `GET /dispensers/:id`: Retrieve a specific dispenser by its ID.

4. `PATCH /dispensers/:id`: Update a specific dispenser by its ID (change is_open status).
   
4. `POST /dispenser_usage`: Receive `{"dispenserId": "any valid Id"}` update its `is_open` status to `true`, start a new thread that record  time.  This thread check for status of `is_open` after every second and stops when status of `is_open` changes to `false`. The thread stops and stores:
`dispenser_id,
start_time,
end_time,
money_made`

in `DispenserUsage` Collection.

5. `GET /dispenser_usage/:id/usage_count`: Get the total number of times a dispenser was used.

6. `GET /dispenser_usage/:id/total_usage_time`: Get the total time for which a dispenser was used.

7. `GET /dispenser_usage/:id/total_money_made`: Get the total amount of money a dispenser has made.

**Testing:**

The project includes unit tests for each endpoint using the Mocha and Chai testing frameworks. To run the tests:

```
npm test
```

**Project Structure:**

The project follows a well-organized directory structure:

- `app.js`: The main entry point of the application.
- `models/Dispenser.js`: Defines the Dispenser model using Mongoose.
- `models/DispenserUsage.js`: Defines the DispenserUsage model using Mongoose.
- `routes/dispenser.js`: Contains the API routes for dispensers.
- `routes/dispenserUsage.js`: Contains the API routes for dispensers Usage.
- `dispenserUsageWorker.js`: Worker thread to calculate dispenser usage.
- `test/dispenser.test.js`: Contains the unit tests for the Dispenser APIs.
- `test/dispenserUsage.test.js`: Contains the unit tests for the DispenserUsage APIs.

**Dependencies:**

The project uses the following main dependencies:

- `express`: A web framework for Node.js to create the API.
- `mongoose`: An ODM library for MongoDB to interact with the database.
- `worker_threads`: A built-in module to create and run worker threads for background tasks.
- `chai` and `chai-http`: Assertion libraries for writing tests.
- `mocha`: A testing framework to run the tests.

**Conclusion:**

The Dispenser API project provides a simple and efficient way to manage and track dispenser usage. The API offers endpoints to create and manage dispensers, record usage data, and retrieve usage statistics. It is built using industry-standard tools and follows best practices for creating a scalable and maintainable API.
