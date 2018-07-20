const mongoose = require('mongoose')

// korvaa url oman tietokantasi urlilla. ethän laita salasanaa Githubiin!
// const url = 'mongodb://<dbuser>:<dbpassword>@ds139341.mlab.com:39341/puhelinluettelo'
// Luetaan dbuser ja dbpassword ympäristömuuttujista, joita ei tallenneta Githubiin
// console.log(process.env.DbUserPuhLuet+':'+process.env.DbPasswordPuhLuet)
let url = 'mongodb://' + 
    process.env.DbUserPuhLuet + ':' +
    process.env.DbPasswordPuhLuet

if (process.env.NODE_ENV === 'production')
    url = url.concat('@ds139341.mlab.com:39341/puhelinluettelo')
else
    url = url.concat('@ds245478.mlab.com:45478/puhelinluettelo_dev')

//console.log('url = ', url)

mongoose.connect(url, { useNewUrlParser: true })

const Person = mongoose.model('Person', {
  name: String,
  phonenumber: String,
})

if (process.argv[2] !== undefined && process.argv[3] !== undefined)
{
    const person = new Person({
        name: process.argv[2],
        phonenumber: process.argv[3],
    })

    person
        .save()
        .then(response => {
            console.log('lisätään henkilö ', person.name, ' numero ', person.phonenumber, ' luetteloon.')
            mongoose.connection.close()
    })
}
else {
    console.log('Puhelinluettelo:')
    Person
        .find({})
        .then(result => {
            result.forEach(person => {
                console.log(person.name, person.phonenumber)
            })
            mongoose.connection.close()
    })
}