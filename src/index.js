const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const app = express()

morgan.token('body', (req, res) => req.method === 'POST' ? JSON.stringify(req.body) : '')

app.use(express.json())
app.use(cors())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

const generateId = () => Math.round(Math.random()*1e10)

let data = {
	persons: [
		{
			name: "Arto Hellas",
			number: "040-123456",
			id: 1
		},
		{
			name: "Ada Lovelace",
			number: "39-44-5323523",
			id: 2
		},
		{
			name: "Dan Abramov",
			number: "12-43-234345",
			id: 3
		},
		{
			name: "Mary Poppendieck",
			number: "39-23-6423122",
			id: 4
		}
	]
}

app.get('/info', (req, res) => {
	res.send(`<p>Phonebook has info for ${data.persons.length} people</p><p>${new Date().toString()}</p>`)
})

app.get('/api/persons', (req, res) => {
	res.json(data.persons)
})

app.post('/api/persons', (req, res) => {
	const body = req.body

	if (!body.name || !body.number) {
		return res.status(400).json({error: 'content missing'})
	}

	if (data.persons.find(person => person.name === body.name)) {
		return res.status(403).json({error: 'name must be unique'})
	}

	const contact = {
		name: body.name,
		number: body.number,
		id: generateId()
	}
	data.persons.push(contact)
	res.json(contact)
})

app.get('/api/persons/:id', (req, res) => {
	const id = Number(req.params.id)
	const contact = data.persons.find(person => person.id === id)
	contact ? res.json(contact) : res.status(404).end()
})

app.delete('/api/persons/:id', (req, res) => {
	const id = Number(req.params.id)
	data.persons = data.persons.filter(person => person.id !== id)
	res.status(204).end()
})

const PORT = 3001;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
})