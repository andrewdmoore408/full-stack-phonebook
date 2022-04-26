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
  }
});

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id;

  Person.findById(id)
    .then(person => {
      if (person) {
        response.json(person);
      } else {
        response.statusMessage = `Person id#${id} not found`;
        response.status(404).end();
      }
    })
    .catch(error => next(error));
});

app.put('/api/persons/:id', (request, response) => {
  const id = request.params.id;
  const body = request.body;

  const person = {
    name: body.name,
    number: body.number,
  };

  Person.findByIdAndUpdate(id, person, {new: true})
    .then(updatedPerson => {
      response.json(updatedPerson);
    })
    .catch(error => next(error));
});

app.delete('/api/persons/:id', (request, response, next) => {
  const id = request.params.id;

  Person.findByIdAndRemove(id)
    .then(result => {
      response.status(204).end();
    })
    .catch(error => next(error));
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

function errorHandler(error, request, response, next) {
  console.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  }

  next(error);
}

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
