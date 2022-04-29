const mongoose = require('mongoose');

const url = process.env.MONGODB_URI;
console.log('Connecting to ', url);

mongoose.connect(url)
  // eslint-disable-next-line no-unused-vars
  .then((_) => {
    console.log('Connected to DB');
  })
  .catch((error) => {
    console.log('Error connecting to MongoDB: ', error.message);
  });

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: String,
    minLength: 8,
    validate: {
      // eslint-disable-next-line no-useless-escape
      validator: (num) => /\d{3}[\.-]\d{3}[\.-]\d{4}/.test(num),
    },
    required: true,
  },
});

personSchema.set('toJSON', {
  transform: (document, returnedObj) => {
    /* eslint-disable */
    returnedObj.id = returnedObj._id.toString(),
    delete returnedObj._id;
    delete returnedObj.__v;
    /* eslint-enable */
  },
});

module.exports = mongoose.model('Person', personSchema);
