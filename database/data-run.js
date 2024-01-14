import {extractPage} from "./work-offers.js"
import {dbClientClose, deleteAll} from "./database.js";

export async function updateAllData(collection) {

    console.log('Deleting old data...')
    await deleteAll(collection)
    console.log('Old data deleted!')
    const promises = []

    console.log('Extracting new data...')
    const link = process.env.OFFERS_LINK
    const count = await extractPage(link, collection, true)

    for (let i = 2; i <= count; i++) {
        promises.push(extractPage(link + `page/${i}/`, collection)
            .then(() => (console.log(`Page ${i<10 ? ' ' + i : i} extracted.`)))
            .catch(() => (console.error(`Page ${i} produced error.`))))
    }

    await Promise.all(promises)
    console.log('Data extraction completed!')

    await dbClientClose()
}

export async function transform(collection){

}