const express = require('express')
const app = express()
//const bodyParser = require('body-parser')

//app.use(bodyParser.json())

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

app.get('/api/persons', (req, res) => {
    res.json(persons)
  })
  
const PORT = 3001
app.listen(PORT, () => {
  console.log(`Puhelinluettelo server running on port ${PORT}`)
})