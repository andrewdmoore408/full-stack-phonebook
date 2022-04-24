const express = require('express');
const app = express();
app.use(express.json());

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
  response.json(persons);
});

app.post('/api/persons', (request, response) => {
  const newContact = request.body;

  if (!newContact.name) {
    response.status(400).json({error: 'Name cannot be blank'});
  } else if (!newContact.number) {
    response.status(400).json({ error: 'Number cannot be blank' });
  } else if (persons.find(person => person.name === newContact.name)) {
    response.status(400).json({ error: 'Name is already taken' });
  } else {
    newContact.id = nextId();
    persons = persons.concat(newContact);

    response.json(newContact);
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

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
