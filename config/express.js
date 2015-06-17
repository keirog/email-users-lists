'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');
const basicAuth = require('basic-auth-connect');


const config = require('./config');

module.exports = () => {

    let app = express();

    app.use(compression());

    app.use(bodyParser.urlencoded({
        extended: true,
        limit:'10mb'
    }));

    // NOTE: we expose the public folder before adding basic authentication!
    app.use(express.static('./public'));

    require('../app/routes/__gtg.server.routes')(app);

    // Authenticator
    app.use(basicAuth(config.authUser, config.authPassword));

    app.use(bodyParser.json({
        limit:'10mb'
    }));

    require('../app/routes/users.server.routes.js')(app);
    require('../app/routes/lists.server.routes.js')(app);
    require('../app/routes/listsByUser.server.routes.js')(app);
    require('../app/routes/usersByList.server.routes.js')(app);


    return app;
};