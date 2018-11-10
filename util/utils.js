function getToday() {
    var moment = require('moment')();
    return moment.format(`YYYY-MM-DD`);
}

function initMySqlPool() {
    var mysql = require('mysql');
    var keys = require('../keys');
    var pool = mysql.createPool(keys.mysqlOptions);

    return pool;
}

function parseQueries(queries) {
    var { start, end, site, netid } = queries;
    if(site && !Array.isArray(site))
        site = [site];
    if(netid && !Array.isArray(netid))
        netid = [netid];

    if(!start)
        start = getToday();
    if(!end)
        end = getToday();
    return { start, end, site, netid }
}

module.exports = {
    getToday: getToday,
    initMySqlPool: initMySqlPool,
    parseQueries: parseQueries
};