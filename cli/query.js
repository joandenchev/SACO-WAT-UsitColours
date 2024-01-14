import {getClient} from "../database/database.js"
import {usitSearch, notNull } from "./filters.js"
const [client, dbName] = getClient()
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
    console.log()
    maximumCast()
    client.close().then(() => console.log('Process ended.'))
}

function maximumCast(){
    let c = 0
    const {filtered: f1, remaining: notN} = filter(offers, notNull, c)
    //const {filtered: f2, remaining: res1} = filter(notN, usitSearch, c+=f1.length, /безплат(ен|н*)/gi)
    const {filtered: f3, remaining: res2} = filter(notN, usitSearch, c+=f1.length, /бонуси?/gi)
    const {filtered: f4, remaining: res4} = filter(res2, usitSearch, c+=f3.length, /хран/gi)
    const {filtered: f5, remaining: res5} = filter(res4, usitSearch, c+=f4.length, /(работа|позиция)/gi)
    const {filtered: f6, remaining: res6} = filter(res5, usitSearch, c+=f5.length, /(отстъпк|намален)/gi)
    const {filtered: f7, remaining: res7} = filter(res6, usitSearch, c+ f6.length, /(бакшиш|работодател|фитнес)/gi)
    f3.forEach(e=>console.log(e.id + ': ' + e.extras))
}

function filter(elements, filterFn, alreadyFilteredCount = 0, ...args){
    const filtered  = []
    const remaining = []

    for (const el of elements) {
        if (filterFn(el, ...args)) {
            filtered.push(el)
        } else {
            remaining.push(el)
        }
    }

    console.log(
         `\x1b[1;30m${'-'.repeat(13) + ' F: ' + '-'.repeat(13)}
        \r\x1b[33mFiltered out ${filtered.length} cases from ${offers.length}.
        \r\x1b[31mRemaining ${offers.length-filtered.length-alreadyFilteredCount}.
        \r\x1b[35mCompletion: ${Math.floor((alreadyFilteredCount + filtered.length) / offers.length * 100)}%
        \r\x1b[30m${'-'.repeat(30)}\x1b[0m\n`
    )

    return {filtered, remaining}
}