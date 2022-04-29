require('dotenv').config();
const express = require('express');

const app = express();
app.use(express.json());

app.use(express.static('build'));

const cors = require('cors');

app.use(cors());
const morgan = require('morgan');
const Person = require('./models/person');

// eslint-disable-next-line no-unused-vars
morgan.token('body', (req, res) => JSON.stringify(req.body));

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

app.get('/api/persons', (request, response) => {
  Person.find({}).then((persons) => response.json(persons));
});

app.post('/api/persons', (request, response, next) => {
  const contactInfo = request.body;

  if (!contactInfo.name) {
    response.status(400).json({ error: 'Name cannot be blank' });
  } else if (!contactInfo.number) {
    response.status(400).json({ error: 'Number cannot be blank' });
  } else {
    const newContact = new Person({
      name: contactInfo.name,
      number: contactInfo.number,
    });

    newContact.save()
      .then((savedContact) => {
        response.json(savedContact);
      })
      .catch((error) => next(error));
  }
});

app.get('/api/persons/:id', (request, response, next) => {
  const { id } = request.params;

  Person.findById(id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.statusMessage = `Person id#${id} not found`;
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.put('/api/persons/:id', (request, response, next) => {
  const { id } = request.params;
  const { name, number } = request.body;

  Person.findByIdAndUpdate(
    id,
    { name, number },
    { new: true, useValidators: true, context: 'query' },
  )
    .then((updatedPerson) => {
      response.json(updatedPerson);
    })
    .catch((error) => next(error));
});

app.delete('/api/persons/:id', (request, response, next) => {
  const { id } = request.params;

  Person.findByIdAndRemove(id)
  // eslint-disable-next-line no-unused-vars
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

app.get('/info', (request, response, next) => {
  const timestamp = new Date();

  Person.find({})
    .then((persons) => {
      response.send(`
        <p>
          Phonebook has info for ${persons.length} people.
        </p>
        <p>
          ${timestamp}
        </p>
      `);
    })
    .catch((error) => next(error));
});

// eslint-disable-next-line consistent-return
function errorHandler(error, request, response, next) {
  console.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  } if (error.name === 'ValidationError') {
    return response.status(400).send({ error: error.message });
  }

  next(error);
}

app.use(errorHandler);

const { PORT } = process.env;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
