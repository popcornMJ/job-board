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

// route to home page
app.get('/', function(req, res) {
    res.render('index');
});

// route to jobs page
app.get('/jobs', function(req, res) {
    res.render('jobs');
});

// start server
app.listen(PORT, () => {
    console.log('Job Board running on port ${PORT}');
});
