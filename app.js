import express from 'express'
import {extractPage, offersArray} from "./inside.js";
import {deleteAll} from "./database.js";

const server = express()

server.get('/update', async (req, res) => {
    let next = 'https://gotousa.bg/bg/work-and-travel-usa/rabotni-oferti-za-brigada/'
    

})

server.listen(50000, () => console.log("listening..."))