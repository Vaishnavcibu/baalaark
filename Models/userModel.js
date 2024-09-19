var mongoose = require('mongoose');
var UserSchema=mongoose.Schema({
    username:{
        type:String
    },
    password:{
        type:String
    },
    status:{
        type:String,
        default:"Active"
    },
    role:{
        type:String,
        default:"admin"
    }
}, 
{ 
    //timestamps: true
    timestamps: { createdAt: 'create_date', updatedAt: 'update_date' }
});


var sample = module.exports = mongoose.model('UserModel', UserSchema);
module.exports.get = function (callback, limit) {
    sample.find(callback).limit(limit);
} 