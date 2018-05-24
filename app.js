var express = require('express');
var Liquid = require('liquidjs');
var app = express();
var engine = Liquid();

app.use(express.static(__dirname + '/dist'));

app.engine('liquid', engine.express()); 
app.set('views', './dist');
app.set('view engine', 'liquid');

app.get('/', function (req, res) {
    res.render('layout', {
        user: 'murilo foda'
    });
});

app.listen(3000);
console.log('Express listening on port 3000');