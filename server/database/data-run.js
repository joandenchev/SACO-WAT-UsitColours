import {extractPage} from "./work-offers.js"
import {deleteAll, getCollectionNames, getInfo, updateActuality} from "./database.js";

export async function updateAllData() {

    //get information about the collections and determine which one should be updated
    const info = await getInfo()
    let newCollection;

    for (const el of info['actuality']){
        const key = Object.keys(el)[0]

        if (el[key]){
            newCollection = key
        }
    }

    //empty the collection
    await deleteAll(newCollection)

    //write the new contents
    const link = 'https://gotousa.bg/bg/work-and-travel-usa/rabotni-oferti-za-brigada/'
    const count = await extractPage(link, newCollection, true)


    for (let i = 2; i <= count; i++) {
        extractPage(link + `page/${i}/`, newCollection)
            .then(() => (console.log(`Page ${i<10 ? ' ' + i : i} extracted.`)))
            .catch(() => (console.error(`Page ${i} produced error.`)))
    }
    console.log('Looping has finished.')

    //set the collection for the next update
    const collectionNames = (await getCollectionNames()).filter(el => el.name !== 'info').map(e=> e.name)

    const actualityValues = []
    let trueSet = false

    for (const col of collectionNames) {
        actualityValues.push({
            [col]: ( col===newCollection || trueSet ) ? false : ( trueSet=true )
        })
    }
    await updateActuality(actualityValues)
}