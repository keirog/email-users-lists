const mongoose = require('mongoose');
module.exports = (next) => mongoose.connection.db.dropDatabase(next);