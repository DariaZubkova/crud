const express = require('express')
const fs = require('fs')
const app = express()

app.use(express.json())

app.post('/post', (req, res) => {
    const jsonData = fs.readFileSync('clients.json')
    const existClients = JSON.parse(jsonData)
    const newClient = req.body
    if (newClient.pasport == null || newClient.fullname == null || newClient.phone == null || newClient.email == null) {
        return res.status(400).send({error: true, msg: 'Client missing'})
    }
    const checkClient = existClients.find( client => client.pasport === newClient.pasport)
    if (checkClient) {
        return res.status(409).send({error: true, msg: 'Client already exist'})
    }
    existClients.push(newClient)
    const stringifyData = JSON.stringify(existClients)
    fs.writeFileSync('clients.json', stringifyData)
    res.send({success: true, msg: 'Client added successfully'})
})

app.get('/get', (req, res) => {
    const jsonData = fs.readFileSync('clients.json')
    const clinets = JSON.parse(jsonData)
    res.send(clinets)
})

app.patch('/patch/:pasport', (req, res) => {
    
    const pasport = req.params.pasport
    const updateClient = req.body
    const jsonData = fs.readFileSync('clients.json')
    const existClients = JSON.parse(jsonData)
    const checkClient = existClients.find( client => client.pasport === pasport )
    if (!checkClient) {
        return res.status(409).send({error: true, msg: 'This pasport do not exist'})
    }
    const newListClients = existClients.filter( client => client.pasport !== pasport )
    newListClients.push(updateClient)
    const stringifyData = JSON.stringify(newListClients)
    fs.writeFileSync('clients.json', stringifyData)
    res.send({success: true, msg: 'Client updated successfully'})
})

app.delete('/delete/:pasport', (req, res) => {

    const pasport = req.params.pasport
    const jsonData = fs.readFileSync('clients.json')
    const existClients = JSON.parse(jsonData)
    const checkClient = existClients.find( client => client.pasport === pasport )
    if (!checkClient) {
        return res.status(409).send({error: true, msg: 'This pasport do not exist'})
    }
    const newListClients = existClients.filter( client => client.pasport !== pasport )
    const stringifyData = JSON.stringify(newListClients)
    fs.writeFileSync('clients.json', stringifyData)
    res.send({success: true, msg: 'Client removed successfully'})
})

app.listen(3000, () => {
    console.log('Server runs on port 3000')
})