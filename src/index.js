require('dotenv').config()
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const app = express()
const Contact = require('./models/Contact')

morgan.token('body', (req) => req.method === 'POST' ? JSON.stringify(req.body) : '')

app.use(express.static('build'))
app.use(express.json())
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

app.post('/api/persons', (req, res, next) => {
	const {name, number} = req.body

	const contact = new Contact({name, number})

	contact.save().then(() => {
		res.json(contact)
	}).catch(error => next(error))
})

app.get('/api/persons/:id', (req, res, next) => {
	Contact.findById(req.params.id)
		.then(contact => {
			if (contact) {
				res.json(contact)
			} else {
				res.status(404).end()
			}
		})
		.catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
	const {name, number} = req.body

	Contact.findByIdAndUpdate(req.params.id, {name, number}, { new: true, runValidators: true, context: 'query' })
		.then(updatedContact => {
			res.json(updatedContact)
		})
		.catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
	Contact.findByIdAndRemove(req.params.id)
		.then(() => {
			res.status(204).end()
		})
		.catch(error => next(error))
})

const unknownEndpoint = (req, res) => {
	res.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
	console.error(error.message)

	switch (error.name) {
		case 'CastError':
			return response.status(400).send({ error: 'malformatted id' })
		case 'ValidationError':
			return response.status(400).send({ error: error.message })
	}

	next(error)
}

app.use(errorHandler)


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})