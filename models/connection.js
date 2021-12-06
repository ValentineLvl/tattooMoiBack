var mongoose = require('mongoose');

var options = {
    connectTimeoutMS: 5000,
    useUnifiedTopology : true,
    useNewUrlParser: true,
}

mongoose.connect('mongodb://betulilhan:UR6YWDOHS8UM3r2V@cluster0-shard-00-00.ah6ab.mongodb.net:27017,cluster0-shard-00-01.ah6ab.mongodb.net:27017,cluster0-shard-00-02.ah6ab.mongodb.net:27017/tattoomoi?ssl=true&replicaSet=atlas-3o99k0-shard-0&authSource=admin&retryWrites=true&w=majority',
    options,
    function(err){
        console.log(err);
    }
)

module.exports = mongoose