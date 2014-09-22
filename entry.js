var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;

var EntrySchema = new Schema({
    title : String,
    from : String,
    contents : String,
    date : Date
});

module.exports = mongoose.model('Entry', EntrySchema);
