require('dotenv').config();
const express = require('express');
const Person = require('./models/person');

const app = express();
app.use(express.json());

app.use(express.static('build'));

const morgan = require('morgan');

morgan.token('body', (req, res) => {
    return JSON.stringify(req.body);
});

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

const cors = require('cors');
app.use(cors());

const nextId = () => {
  const currentIds = persons.map(person => person.id);

  let newId = null;

  while (newId === null || currentIds.includes(newId)) {
    newId = Math.floor(Math.random() * (10 ** 6) + 1);
  }

  return newId;
};

let persons = [
  {
    "id": 1,
    "name": "Arto Hellas",
    "number": "040-123456"
    },
  {
    "id": 2,
    "name": "Ada Lovelace",
    "number": "39-44-5323523"
    },
  {
    "id": 3,
    "name": "Dan Abramov",
    "number": "12-43-234345"
    },
  {
    "id": 4,
    "name": "Mary Poppendieck",
    "number": "39-23-6423122"
    }
];

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => response.json(persons));
});

app.post('/api/persons', (request, response) => {
  const contactInfo = request.body;

  if (!contactInfo.name) {
    response.status(400).json({error: 'Name cannot be blank'});
  } else if (!contactInfo.number) {
    response.status(400).json({ error: 'Number cannot be blank' });
  } else if (persons.find(person => person.name === contactInfo.name)) {
    response.status(400).json({ error: 'Name is already taken' });
  } else {
    const newContact = new Person({
      name: contactInfo.name,
      number: contactInfo.number,
    });

    newContact.save().then(savedContact => {
      response.json(savedContact);
    });

    // newContact.id = nextId();
    // persons = persons.concat(newContact);

    // response.json(newContact);
  }
});

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);

  const requestedContact = persons.find(person => person.id === id);

  if (requestedContact) {
    response.json(requestedContact);
  } else {
    response.statusMessage = `No contact has id ${id}`;
    response.status(404).end();
  }
});

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);

  const contactToDelete = persons.find(person => person.id === id);

  if (contactToDelete) {
    persons = persons.filter(person => person.id !== id);
    response.status(204).end();
  } else {
    response.statusMessage = `No contact has id ${id}`;
    response.status(404).end();
  }
});

app.get('/info', (request, response) => {
  const timestamp = new Date();

  response.send(`
    <p>
      Phonebook has info for ${persons.length} people.
    </p>
    <p>
      ${timestamp}
    </p>
  `);
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
