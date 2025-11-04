const express = require('express');
const { engine } = require('express-handlebars');

// init app
const app = express();
PORT = 3000;

app.use(express.static('public'));  // static files from public directory

// handlebars
app.engine('.hbs', engine({ 
    extname: ".hbs",
    defaultLayout: 'main'
 }));  // create instance of hbs engine to process templates
app.set('view engine', '.hbs');  // tell express to use hbs 
app.set('views', './views');

// database
const db = require('./db-connector');

// route to home page
app.get('/', function(req, res) {
    res.render('index');
});

// route to jobs page
app.get('/jobs', function(req, res) {
    const query = "SELECT * FROM jobs";

    db.pool.query(query, (err, results) => {
        if (err) {
            console.error('DB query error:', err);
            res.status(500).send('DB error');
        } else {
            res.render('jobs', { jobs: results });
        }
    });
});


// parser for incoming HTTP reqs
const bodyParser = require('body-parser');

// Express router
const jobsRouter = require('./routes/jobs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// jobs routes
app.use('/jobs', jobsRouter);

// start server
app.listen(PORT, () => {
    console.log(`Job Board running on port ${PORT}`);
});
