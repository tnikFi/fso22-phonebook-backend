const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

console.log(`Connecting to ${url}`)

mongoose.connect(url)
	.then(() => console.log('Connected to MongoDB'))
	.catch(error => console.log('Failed to connect to MongoDB:', error.message))

const contactSchema = new mongoose.Schema({
	name: {
		type: String,
		minlength: 3,
		required: true
	},
	number: {
		type: String,
		minlength: 8,
		validate: {
			validator: v => /^[0-9]{2,3}-[0-9]*$/.test(v),
			message: props => `${props.value} is not a valid phone number!`
		},
		required: true
	}
})

contactSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__v
	}
})

module.exports = mongoose.model('Contact', contactSchema)