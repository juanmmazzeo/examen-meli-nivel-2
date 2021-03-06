import express from 'express';
import bodyParser from 'body-parser';
import routerMutants from './routes/mutant';
import db from './db/db';
// Set up the express app
const app = express();

// Parse incoming requests data
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/api', routerMutants);

const PORT = 5000;
db.authenticate();
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`)
});

export default app;