'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');
const basicAuth = require('basic-auth-connect');
const dbDown = require('../app/utils/dbDown.server.utils');


const config = require('./config');

module.exports = () => {

    let app = express();

    app.use(compression());

    app.use(bodyParser.urlencoded({
        extended: true,
        limit:'10mb'
    }));

    app.use(bodyParser.json({
        limit:'10mb'
    }));

    // NOTE: we expose the public folder before adding basic authentication!
    app.use(express.static('./public'));

    // NOTE: we expose the health and gtg endpoints folder before adding basic authentication!
    require('../app/routes/__health.server.routes')(app);
    require('../app/routes/__gtg.server.routes')(app);

    app.use(dbDown);
    // Authenticator
    app.use(basicAuth(config.authUser, config.authPassword));

    require('../app/routes/users.server.routes.js')(app);
    require('../app/routes/lists.server.routes.js')(app);
    require('../app/routes/listsByUser.server.routes.js')(app);
    require('../app/routes/usersByList.server.routes.js')(app);
    require('../app/routes/metadata.server.routes.js')(app);


    return app;
};
