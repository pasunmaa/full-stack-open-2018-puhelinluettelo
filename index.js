const express = require('express')
const app = express()
const bodyParser = require('body-parser')

app.use(bodyParser.json())

let persons = [
  {
    "name": "Arto Hellas",
    "phonenumber": "040-123456",
    "id": 1
  },
  {
    "name": "Martti Tienari",
    "phonenumber": "040-123456",
    "id": 2
  },
  {
    "name": "Arto Järvinen",
    "phonenumber": "040-123456",
    "id": 3
  },
  {
    "name": "Lea Kutvonen",
    "phonenumber": "040-123456",
    "id": 4
  },
  {
    "id": 5,
    "name": "Petri Asunmaa",
    "phonenumber": "040-7224824"
  },
  {
    "id": 6,
    "name": "Ville Virtanen",
    "phonenumber": "040-987654321"
  }
]

app.get('/', (req, res) => {
  res.send(
      '<h1>Hello World, this is Puhelinluettelo!</h1>' +
      '<br/>' +
      'type http:/localhost:3001/api/persons to see it')
})

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
        '<div>puhelinluettelossa on ' +
        persons.length +
        ' henkilön tiedot</div></br>' +
        timestamp + " " + timezone
    )
})

app.get('/api/persons', (request, response) => {
    //console.log('GET HEADERS', request.headers)
    response.json(persons)
  })
  
app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})


const generateId = () => {
  return Math.round((Math.random() * 100000000))
}

app.post('/api/persons', (request, response) => {
  const body = request.body
  //console.log('POST BODY', body)
  //console.log('POST HEADERS', request.headers)

  const person = {
    name: body.name,
    phonenumber: body.phonenumber,
    id: generateId()
  }
  console.log('Person = ', person)

  if (body.name === "" || body.name === undefined || 
      body.phonenumber === "" || body.phonenumber === undefined)
    return response.status(400)
      .json({ error: 'name or phone number missing' })
  else if (persons.findIndex(person => person.name === body.name) !== -1) {
    return response.status(400)
      .json({ error: 'name must be unique' })
  }
  else {
    persons = persons.concat(person)
    return response.status(200)  // Success
  }
})

app.delete('/api/persons/:id', (request, response) => {
    //console.log('DELETE HEADERS', request.headers)
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Puhelinluettelo server running on port ${PORT}`)
})