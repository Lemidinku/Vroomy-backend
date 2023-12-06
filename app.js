require('express-async-errors');
const supabase = require('./db/supabase.js');

const express = require('express');
const app = express();
const cors = require("cors")

const carsRouter = require('./routes/cars');
const authRouter = require('./routes/auth');


const notFoundMiddleware = require('./middleware/not-found');
const errorMiddleware = require('./middleware/error-handler');

// middleware
app.use(express.json());
app.use(cors())
// routes

app.get('/', (req, res) => {
  res.send('<h1>Store API</h1><a href="/api/v1/cars">products route</a>');
});

app.use('/api/v1/cars', carsRouter);
app.use('/api/v1/auth', authRouter);

let user;

// auth check
async function checkAuthState() {
  try {
    const { data: session } = await supabase.auth.getSession();
    
    if (session) {
      user = session.user
      console.log('User is authenticated:', session.user);
    } else {
      user = null
      console.log('User is not authenticated');
    }

    const { data: subscription } = await supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        user = session.user
        console.log('Auth state changed. User is authenticated:', session.user);
      } else {
        user = null
        console.log('Auth state changed. User is not authenticated');
      }
    });

    // Unsubscribe when done
    // await subscription.unsubscribe();
  } catch (error) {
    console.error('Error checking auth state:', error.message);
  }
}

// Call the function
checkAuthState();
console.log(user)


























// products route

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
