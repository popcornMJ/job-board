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

// file upload middleware
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const upload = multer({ dest: 'uploads/'});

// route for file uploads
app.post('/jobs/upload', upload.single('file'), (req, res) => {
    const filePath = req.file.path;

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error', err);
            return res.status(500).send('File error');
        }

        const lines = data.split('\n').filter(line => line.trim() !== '');
        for (const line of lines) {
            const [title, ...bodyParts] = line.split(':');
            const body = bodyParts.join(':').trim();
            if (title && body) {
                db.pool.query('INSERT INTO jobs (title, body) VALUES (?, ?)', [title.trim(), body]);
            }
        }

        // delete the temporary file after
        fs.unlink(filePath, () => {});
        res.redirect('/jobs');
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
