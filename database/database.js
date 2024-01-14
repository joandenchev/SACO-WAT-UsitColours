import {MongoClient} from 'mongodb'

const usit = 'UsitColours_SACO'
const client = new MongoClient(process.env.MONGODB_CONNECTION_STRING)

await connectToMongoDB()
async function connectToMongoDB() {
    try {
        await client.connect()
        console.log('\x1b[1;36mStarting SACO-WAT-UsitColours\x1b[0m')
        console.log('Connected to MongoDB')
    } catch (e) {
        console.error(e.stack)
    }

    process.on('SIGINT', async () => {
        await client.close()
        console.log('Disconnected from MongoDB')
        process.exit(0)
    });
}


export async function dbClientClose(){
    await client.close()
    console.log('Disconnected from MongoDB')
}

export async function sendDocuments(documentArray, collection){
    const  col = client.db(usit).collection(collection ?? 'Work offers')
    return col.insertMany(documentArray)
}

export async function deleteAll(collection){
    const  col = client.db(usit).collection(collection)
    return col.deleteMany({})
}

export async function getInfo(){
    return client.db(usit).collection('info').findOne({})
}

export async function updateActuality(actualityObject){
    client.db(usit).collection('info').updateOne({}, { $set: { actuality: actualityObject } })
        .catch(e => (console.error(e.stack)))
}

export async function getCollectionNames(){
    return (await client.db(usit).listCollections().toArray()).filter(el => el.name)
}

export function getClient(){
    return [client, usit]
}