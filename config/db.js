const mongoose = require('mongoose');
mongoose.connect(process.env.pathMongo,{useNewUrlParser:true});
mongoose.Promise = global.Promise;