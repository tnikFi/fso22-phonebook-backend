require('dotenv').config()
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const app = express()
const Contact = require('./models/Contact')

morgan.token('body', (req, res) => req.method === 'POST' ? JSON.stringify(req.body) : '')

app.use(express.json())
app.use(express.static('build'))
app.use(cors())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


app.get('/info', (req, res) => {
	Contact.find({}).then(contacts => {
		res.send(`<p>Phonebook has info for ${contacts.length} people</p><p>${new Date().toString()}</p>`)
	})
})

app.get('/api/persons', (req, res) => {
	Contact.find({}).then(contacts => {
		res.json(contacts)
	})
})

app.post('/api/persons', (req, res) => {
	const body = req.body

	if (!body.name || !body.number) {
		return res.status(400).json({error: 'content missing'})
	}

	const contact = new Contact({
		name: body.name,
		number: body.number
	})

	contact.save().then(result => {
		res.json(contact)
	}).catch(error => {
		console.log('Failed to POST:', error.message)
	})
})

app.get('/api/persons/:id', (req, res) => {
	Contact.findById(req.params.id).then(contact => {
		if (contact) {
			res.json(contact)
		} else {
			res.status(404).end()
		}
	})
})

app.delete('/api/persons/:id', (req, res) => {
	const id = Number(req.params.id)
	data.persons = data.persons.filter(person => person.id !== id)
	res.status(204).end()
})

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
})