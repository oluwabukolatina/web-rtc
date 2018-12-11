const mongoose = require('mongoose');

const Schema = mongoose.Schema;

//create schema
const UserSchema = new Schema({

	email: {

		type: String,

		required: true

	},

  password: {

    type: String,
    required: true

  }

});

//collection and schema
mongoose.model('users', UserSchema);
