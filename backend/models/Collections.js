const mongoose = require('mongoose');
const collectionsSchema = new mongoose.Schema({
    collectionsName:{
        type:String,
        required: true,
        minlength: [3, 'Collections Name cannot be smaller than 3 characters'],
        maxlength: [100, 'Collections Name cannot be longer than 100 characters'],
    },

    collectionsSlug:{
        type: String,
        required: true,
        unique:true,
    },
    collectionsImage:{
        type:String,
        required: true,
    },

     isDeleted:{
            type: Boolean,
            default:false,
        },
        deletedAt: {
            type: Date,
            default: null
      },
      deletedBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default:null
      } 
      

}, { timestamps: true });

const Collections = mongoose.model('Collections', collectionsSchema);
module.exports= Collections;
