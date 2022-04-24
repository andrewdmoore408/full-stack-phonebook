const mongoose = require('mongoose');

if (process.argv.length < 5 && process.argv.length !== 3) {
  console.log("Usage is: node mongo.js <dbPassword> <newContactName> <newContactNumber>");
  console.log("Or to view all contacts: node mongo.js <dbPassword>");
  process.exit(1);
}

const password = process.argv[2];
const url = `mongodb+srv://andrewdmoore84:${password}@fsomongo.c5ioy.mongodb.net/phonebookApp?retryWrites=true&w=majority`;

mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model('Person', personSchema);

if (process.argv.length == 3) {
  Person.find({})
    .then(persons => {
      console.log('Phonebook:');
      persons.forEach(person => console.log(`${person.name} ${person.number}`));

      mongoose.connection.close();
    });
} else {
  const newPerson = new Person({
    name: process.argv[3],
    number: process.argv[4],
  });

  newPerson.save().then(result => {
    console.log(`Added ${newPerson.name} number ${newPerson.number} to phonebook.`);

    mongoose.connection.close();
  });
}


// mongoose.connect(url);

// const personSchema = new mongoose.Schema({
//   name: string,
//   number: string,s
// });

// const Person = mongoose.model('Person', personSchema);

// const newPerson = new Person({
//   name: process.argv[3],
//   number: process.argv[4],
// });
