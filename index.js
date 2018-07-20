const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const Person = require('./models/person')

morgan.token('respdata', (req) => {
  //console.log(req.body)
  return JSON.stringify(req.body)
})

const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(morgan(':method :url :respdata :status :res[content-length] - :response-time ms'))
app.use(express.static('build'))


app.get('/info', (req, res) => {
  const timestamp = new Date().toLocaleString('en-FI', {
    day : 'numeric',
    month : 'short',
    year : 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    //timeZone: 'Helsink/Finland'
  })
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
  //console.log(timestamp) //, timestamp.toString())

  Person.countDocuments({})
    .then((count) => {
      //console.log('No of documents in Person: ', count)
      res.send(
        '<h1>Hello World, this is Puhelinluettelo!</h1>' +
            '<br/>' + '<div>Puhelinluettelossa on ' +
            count +
            ' henkilön tiedot.</div></br>' +
            timestamp + ' ' + timezone
      )
    })
    .catch((error) => {
      console.log('Failed to fetch # of documents', error)
      res.status(400).send({ error: 'Failed to fetch # of documents' })
    })
})

app.get('/api/persons', (request, response) => {
  //console.log('GET HEADERS', request.headers)
  Person
    .find({})
    .then(persons => {
      //console.log(persons)
      return response.json(persons.map(Person.format))
    })
    .catch(error => {
      console.log('Get all persons failed', error)
      response.status(404).end()
    })
})

app.get('/api/persons/:id', (request, response) => {
  //console.log(request.params.id, typeof request.params.id)
  Person
    .findById(request.params.id)
    .then(person => {
      if (person)
        response.json(new Person.format(person))
      else
        response.status(404).end()
    })
    .catch(error => {
      console.log('app.get: person.find failed', error)
      response.status(400).send({ error: 'malformatted id' })
    })
})

app.put('/api/persons/:id', (request, response) => {
  //console.log(request.params.id, typeof request.params.id)
  const person = {
    name: request.body.name,
    phonenumber: request.body.phonenumber
  }

  Person
    .findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      if (updatedPerson) {
        //console.log('päivitetään henkilön ', person.name, ' numero ', person.phonenumber, ' luetteloon.')
        return response.json(Person.format(updatedPerson))
      }
      else
        response.status(404).end()
    })
    .catch(error => {
      console.log('app.put: person.find failed', error)
      response.status(400).send({ error: 'malformatted id' })
      //response.status(404).end()
    })
})

app.post('/api/persons', (request, response) => {
  const body = request.body
  //console.log('POST BODY', body)
  //console.log('POST HEADERS', request.headers)

  if (body.name === '' || body.name === undefined ||
      body.phonenumber === '' || body.phonenumber === undefined)
    return response.status(400)
      .json({ error: 'name or phone number missing' })
  /* else if (persons.findIndex(person => person.name === body.name) !== -1) {
    return response.status(400)
      .json({ error: 'name must be unique' })
  } */
  else {
    const person = new Person({
      name: body.name,
      phonenumber: body.phonenumber,
    })

    person
      .save()
      .then(savedPerson => {
        //console.log('lisätään henkilö ', person.name, ' numero ', person.phonenumber, ' luetteloon.')
        //mongoose.connection.close()  // where is mongoose connection closed?
        return response.json(Person.format(savedPerson))
        //return response.status(200).end()  // Success
      })
      .catch(error => {
        console.log('person.save failed', error)
        if (error.code === 11000) {  // UNIQUE INDEX DEFINED FOR COLLECTION'S NAME-FIELD IN DB ADMIN UI
          console.log('person.save failed, as name is not unique', error)
          return response.status(400)
            .json({ error: 'name must be unique' })
        }
        else {
          console.log('person.save failed', error)
          return response.status(400)
            .json({ error: 'person.save failed' })
        }
      })
  }
})

app.delete('/api/persons/:id', (request, response) => {
  //console.log('DELETE HEADERS', request.headers)
  //console.log(request.params.id, typeof request.params.id)
  Person
    .findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => {
      console.log('person.delete failed', error)
      response.status(400).send({ error: 'malformatted id' })
    })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Puhelinluettelo server running on port ${PORT}`)
})
