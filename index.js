const { request, response } = require('express');
const express = require('express');
var morgan = require('morgan');
const app = express();
const port = 3001;

morgan.token('person', request => {
  if (request.method === 'POST') {
    return `${JSON.stringify(request.body)}`;
  }
  return " "
})

app.use(express.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :person'));

const generateId = () => {
  return Math.floor(Math.random() * 1000) + 1;
}

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
]

app.get("/api/persons", (request, response) => {
  response.send(persons);
})

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find(person => person.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
})

app.get("/info", (request, response) => {
  response.send(`
  <p>Phonebook has info for ${persons.length} people.</p>
  <p>${new Date()}</p>
  `)
})

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter(person => person.id !== id);

  response.status(204).end();
})

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'content missing'
    })
  }

  if (persons.find(person => person.name === body.name)) {
    return response.status(400).json({
      error: 'name must be unique'
    })
  }

  const person = {
    id: body.id || generateId(),
    name: body.name,
    number: body.number
  }

  persons = persons.concat(person);
  response.json(person);
})

app.listen(port, () => {
  console.log(`Phonebook app listening on port ${port}`);
})
