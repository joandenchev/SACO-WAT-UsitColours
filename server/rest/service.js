import express from 'express'
import {updateAllData} from "../database/data-run.js"


export const server = express()

server.use(express.static('client/dist'))

server.get('/update', async (req, res) => {
    await updateAllData()
    res.send('Function executed!')
})


server.listen(50000)