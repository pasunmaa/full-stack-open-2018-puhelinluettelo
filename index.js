const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const Person = require('./models/person')

morgan.token('respdata', getResponseData = (req, res) => {
  //console.log(req.body)
  return JSON.stringify(req.body)
})

const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(morgan(':method :url :respdata :status :res[content-length] - :response-time ms'))
app.use(express.static('build'))


app.get('/info', (req, res) => {
    timestamp = new Date().toLocaleString('en-FI', {  
        day : 'numeric',
        month : 'short',
        year : 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        //timeZone: 'Helsink/Finland'
    })
    timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    //console.log(timestamp) //, timestamp.toString())
    res.send(
        '<h1>Hello World, this is Puhelinluettelo!</h1>' +
        '<br/>' + '<div>puhelinluettelossa on ' +
        persons.length +
        ' henkilön tiedot</div></br>' +
        timestamp + " " + timezone
    )
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
            const p1 = new Person.format(updatedPerson)
            //console.log(p1)
            return response.json(p1)
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

  if (body.name === "" || body.name === undefined || 
      body.phonenumber === "" || body.phonenumber === undefined)
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
          const p1 = new Person.format(savedPerson)
          //console.log(p1)
          return response.json(p1)
          //return response.status(200).end()  // Success
      })
      .catch(error => 
        {console.log('person.save failed', error)})
  }
})

app.delete('/api/persons/:id', (request, response) => {
    //console.log('DELETE HEADERS', request.headers)
    //console.log(request.params.id, typeof request.params.id)
    Person
      .findByIdAndRemove(request.params.id)
      .then(result => {
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
