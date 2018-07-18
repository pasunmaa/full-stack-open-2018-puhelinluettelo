const mongoose = require('mongoose')

// const url = 'mongodb://<dbuser>:<dbpassword>@ds139341.mlab.com:39341/puhelinluettelo'
// Luetaan dbuser ja dbpassword ympäristömuuttujista, joita ei tallenneta Githubiin
// console.log('DB CREDENTIALS: ',process.env.DbUserPuhLuet+':'+process.env.DbPasswordPuhLuet)
const url = 'mongodb://' + 
    process.env.DbUserPuhLuet + ':' +
    process.env.DbPasswordPuhLuet + 
    '@ds139341.mlab.com:39341/puhelinluettelo'

mongoose.connect(url, { useNewUrlParser: true })

const PersonSchema = mongoose.Schema({
    name: String,
    phonenumber: String,
    id: String
})

PersonSchema.statics.format = function (person) {
    return ({
        name: person.name,
        phonenumber:  person.phonenumber,
        id: person._id 
    })
}

const Person = mongoose.model('Person', PersonSchema)

module.exports = Person