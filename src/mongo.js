const mongoose = require('mongoose')

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url = `mongodb+srv://fullstack:${password}@cluster0.2znznle.mongodb.net/contacts?retryWrites=true&w=majority`

mongoose.connect(url)

const contactSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Contact = mongoose.model('Contact', contactSchema)

if (name && number) {
    const contact = new Contact({name, number})

    contact.save().then(result => {
        console.log(`added ${name} number ${number} to phonebook`);
        mongoose.connection.close()
    })
} else {
    Contact
        .find({})
        .then(result => {
            console.log('Phonebook:');
            result.forEach(contact => {
                console.log(`${contact.name} ${contact.number}`);
            })
            mongoose.connection.close()
        })
    
}