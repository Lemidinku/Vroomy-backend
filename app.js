require('express-async-errors');
const supabase = require('./db/supabase.js');

const express = require('express');
const app = express();
const cors = require("cors")

const carsRouter = require('./routes/cars');
const authRouter = require('./routes/auth');
const requestsRouter = require("./routes/requests.js")
const bookingsRouter = require("./routes/bookings.js")
const rentsRouter = require("./routes/rents.js")
const notificationsRouter = require("./routes/notifications.js")


const notFoundMiddleware = require('./middleware/not-found');
const errorMiddleware = require('./middleware/error-handler');

// middleware
app.use(express.json());
app.use(cors())
// routes

app.get('/', (req, res) => {
  res.send('<h1>Store API</h1><a href="/api/v1/cars">Cars route</a>');
});

app.use('/api/v1/cars', carsRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/requests', requestsRouter);
app.use('/api/v1/bookings', bookingsRouter);
app.use('/api/v1/rents', rentsRouter);
app.use('/api/v1/notifications', notificationsRouter);


app.use(notFoundMiddleware);
app.use(errorMiddleware);

const port = process.env.PORT || 9000;

const start = async () => {
  try {
    app.listen(port, () => console.log(`Server is listening port ${port}...`));
  } catch (error) {
    console.log(error);
  }
};

start();
