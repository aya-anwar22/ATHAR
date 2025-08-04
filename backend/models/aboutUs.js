const mongoose = require('mongoose');
const aboutSchema = new mongoose.Schema({
    bio: {
        type: String,
        required: true
    },
    title:{
        type:String
    },
    description:{
        type: String
    },
    photoUrl:{
        type:String,
    }
});

const About = mongoose.model('aboutUs', aboutSchema)
module.exports = About;
