var express = require('express');
var router = express.Router();

// Custom utility functions
var util = require('../util/utils');
var connectionHandler = require('../util/connectionHandler');
var queryHandler = new connectionHandler();

router.use(function(req, res, next) {
    // TODO : Change this to your domain
    res.header("Access-Control-Allow-Origin", "*");
    next();
});

router.get('/range', (req, res) => {
    var params = util.parseQueries(req.query);

    if(!params.site)
        return res.status(400).send({ message: 'No sites specified' });

    queryHandler.queryRange(params, (json, err) => {
        if(err) return res.status(400).send({ message: err });
        res.json(json);
    });
});

router.get('/top', (req, res) => {
    var params = util.parseQueries(req.query);

    queryHandler.queryTop(params, (json, err) => {
        if(err) return res.status(400).send({ message: err });
        res.json(json);
    });
});

module.exports = router;
