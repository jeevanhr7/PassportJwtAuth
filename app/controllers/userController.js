const User = require('../models/user'),
    mongoose = require('mongoose'),
    _=require('lodash');


exports.create = function (req, res) {
    let user = new User();
    user.name = req.body.name;
    user.description = req.body.description;
    user.save().then(result=> {
        res.json(result);
    })
};


exports.list = function (req, res) {
    User.find({}).exec().then(result=> {
        res.json(result);
    })
};

exports.get = function (req, res) {
    User.find({_id:mongoose.Types.ObjectId(req.params.id)}).exec().then(result=> {
        if(result.length>0)
        res.json(result);
        else
        res.status(400).send({"messge":"No user found with the Specified User Id"})
    })
};



exports.update = function (req, res) {
    let query=_.pick(req.body,'name','description');
    User.findOneAndUpdate({_id:mongoose.Types.ObjectId(req.params.id)},{ $set:query  } ,{new:true}).exec().then(result=>{
        res.json(result);
    })
};