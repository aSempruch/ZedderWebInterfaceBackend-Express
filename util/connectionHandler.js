module.exports = class connectionHandler {

    constructor() {
        this.pool = require('./utils').initMySqlPool();
    }

    _constructRangeQuery(start, end, sites, netids) {
        var s1 = 'SELECT site, posted, covered FROM Data '
        + `\nWHERE postedTime >= '${start} 00:00:00' AND coveredTime <= '${end} 23:59:59'\n`;

        var s2 = '';
        if(sites) {
            s2 += 'AND ('
            sites.map((site, index) => {
                s2 += `site = '${site}'`;
                if (index + 1 < sites.length)
                    s2 += ` OR `;
            });
            s2 += `)\n`;
        }

        var s3 = '';
        if(netids) {
            s3 += `AND (`
            netids.map((netid, index) => {
                s3 += `posted LIKE '${netid}%' OR covered LIKE '${netid}%'`;
                if (index + 1 < netids.length)
                    s3 += ` OR `;
            });
            s3 += ')'
        }

        var query = s1 + s2 + s3;
        return query;
    }

    _constructTopQuery(start, end, sites) {
        var s1 = 'SELECT covered, COUNT(covered) AS count from Data' +
            `\nWHERE covered <> posted AND covered <> 'Open'` +
            `\nAND postedTime >= '${start} 00:00:00' AND coveredTime <= '${end} 23:59:59'` +
            `\nGROUP BY covered` +
            `\nORDER BY count DESC` +
            `\nLIMIT 10`;
        return s1;
    }

    queryRange(params, callback) {
        this.pool.getConnection((err, connection) => {
            if(err)
                return callback(false, err);
            var queryString = this._constructRangeQuery(params.start, params.end, params.site, params.netid);
            connection.query(queryString, (err, results) => {
                connection.release();
                if(err)
                    return callback(false, err);
                return callback(results, false);
            })
        })
    }

    queryTop(params, callback) {
        this.pool.getConnection((err, connection) => {
            if(err)
                return callback(false, err);
            var queryString = this._constructTopQuery(params.start, params.end);
            connection.query(queryString, (err, results) => {
                connection.release();
                if(err)
                    return callback(false, err);
                return callback(results, false);
            })
        })
    }
};