const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema({
    name: {type: String},
    description: {type: String},
    active: {type: Boolean, default: true},
    cratedDate:{type:Date,default:Date.now()}
});

/*userSchema.pre('save', function (next) {
    // if (this.name && this.isNew) {
    //     this.name = 'PR_' + this.name;
    // }
    if (this.creator && this.isNew) {
        this.owner = this.creator
    }
    next();
});*/

module.exports = mongoose.model('User', userSchema);