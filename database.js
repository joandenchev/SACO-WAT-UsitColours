import {MongoClient} from 'mongodb'

const cString = 'mongodb://localhost:27017/'
const usit = 'UsitColours_SACO'
const client = new MongoClient(cString,{ useNewUrlParser: true })

async function connectToMongoDB() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
    } catch (e) {
        console.error(e)
    }

    process.on('SIGINT', async () => {
        await client.close();
        console.log('Disconnected from MongoDB');
        process.exit(0);
    });
}
await connectToMongoDB();

export async function sendDocuments(documentArray, collection){
    const  col = client.db(usit).collection(collection ?? 'Work offers')
    return col.insertMany(documentArray)
}

export async function deleteAll(collection){
    const  col = client.db(usit).collection(collection)
    return col.deleteMany({})
}