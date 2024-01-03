import {JSDOM} from 'jsdom'
import fetch from 'node-fetch'
import {sendDocuments} from "./database.js"

const infos = {
    "Ниво на английски:": "englishLevel",
    "Начални дати:": "beginningDates",
    "Крайни дати:": "finishDates",
    "Особености:": "specialties",
    "Бакшиши:": "tips",
    "Настаняване:": "accommodation",
    "Екстри:": "extras"
}

class WorkOffer{
    title
    link
    location
    hourlyPay
    tips
    accommodation
    extras
    averageWeeklyHours
    beginningDates
    finishDates
    state
    specialties
    englishLevel
    overtime
    applicationPeriod
    imageLink
    constructor(offerHtml) {

        const redLine  = offerHtml[0].textContent.trim().split(/\s*\n+\s*/)
        const innerSide= offerHtml[1].textContent.trim().split(/\n\s*\n/).map(el => el.trim().replace(/\s{2,}/g, ' '))
        const greyLine = offerHtml[2].textContent.trim().match(/[а-яa-z].*[а-яa-z]/gi)

        this.title = redLine[0]
        this.location  = redLine[1]
        this.hourlyPay = parseFloat(redLine[2].split(' ')[0].slice(1))

        const len = innerSide.length
        for (let i = 0; i < len; ++i) {

            let infosKeys = Object.keys(infos)
            let jLen = infosKeys.length
            let j = 0 //counts true iterations of second for loop

            for (let n = j; n < jLen; n++) {
                if (innerSide[i] === infosKeys[n]){
                    this[infos[infosKeys[n]]] = innerSide[++i]
                    ++j
                }
            }
        }

        this.state = greyLine[0].split(',')[1].trim()
        this.applicationPeriod = greyLine[1].match(/[а-яА-Я \w]+/)[0]
        this.link = offerHtml[2].querySelector('a').href

        this.overtime = /възможност за допълнителни часове/.test(this.specialties)
        this.averageWeeklyHours = parseInt(/\d+/.exec(this.specialties)[0])
        this.tips = /да|yes/i.test(this.tips)
        this.imageLink = offerHtml[1].querySelector('a img').src

        if (typeof this.accommodation === "string"){
            if (this.accommodation.toLowerCase() === 'безплатно'){
                this.accommodation = 0
            } else if (this.accommodation.match(/седмица/i)){
                this.accommodation = parseInt(this.accommodation.match(/\d+/)[0])
            } else if (this.accommodation.match(/\sден(\s|$)/i)){
                this.accommodation = parseInt(this.accommodation.match(/\d+/)[0])*7
            }
        }

    }
}

export async function extractPage(pageLink, collection, returnOn){
    const head = await fetch(pageLink)
    if (!head.ok) { throw new Error(`Failed to fetch page: ${head.status} ${head.statusText}`) }
    const html = await head.text()

    const dom   = new JSDOM(html)
    const document = dom.window.document

    const offers   = document.querySelectorAll(".container-fluid .col-lg-12.col-sm-12.col-xs-12.more-positions-container > div")
    const offersArray = []

    let counter = 0
     function addOffer(){
        const offerHtml = [offers[counter++], offers[counter++], offers[counter++]]
        const workOffer = new WorkOffer(offerHtml)
        offersArray.push(workOffer)
    }

    while (offers.length > counter+2) addOffer()
    await  sendDocuments(offersArray, collection)

    if (returnOn) {
        const s = document.querySelector('.pages').textContent.split(/\s+/)
        return s[s.length-1]
    }
}