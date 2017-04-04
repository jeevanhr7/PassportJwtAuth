/*jshint esversion: 6 */
const mongoose = require('mongoose'),
    app = require('./config/express'),
    config = require('./config/env');
// make bluebird default Promise for mongoose
//Promise = require('bluebird');

mongoose.Promise = require('bluebird');


// connect to mongo db
mongoose.connect(config.db, {server: {socketOptions: {keepAlive: 1}}});
mongoose.connection.on('error', () => {
    throw new Error(`unable to connect to database: ${config.db}`);
});

// print mongoose logs in dev env
if (config.MONGOOSE_DEBUG) {
    mongoose.set('debug', (collectionName, method, query, doc) => {
        console.log(`${collectionName}.${method}`, doc);
    });
}


app.listen(config.port, () => {
    console.log(`API Server started on port ${config.port} (${config.env})`);
});