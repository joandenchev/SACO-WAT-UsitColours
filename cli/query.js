import {getClient} from "../database/database.js";
import { filter, usitSearch} from "./filters.js";
let [client, dbName] = getClient()
const collectionName = 'Work offers'
const offers = []
let id = 0

function cast(){
     client
         .db(dbName)
         .collection(collectionName)
         .find({})
         .stream()
         .on('data', (data) => {
             offers.push({ id: ++id, extras: data.extras })
         })
         .on('end', end)
} cast()

function end(){
    maximumCast()
    client.close().then(r => console.log('\nEnded. ', r ?? ''))
}

function maximumCast(){
    const notNullArray = []
    for (const el of offers){
        if (el.extras)
            notNullArray.push(el)
    }

    const finalArray = filter(usitSearch, notNullArray, [/безплат(ен|н*)/gi, false])
    for (const finalArrayElement of finalArray) {
        console.log(finalArrayElement)
    }

}
export default function (){
    return offers
}
