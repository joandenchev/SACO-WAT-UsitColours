import dotenv from 'dotenv'
dotenv.config()

const collection = process.argv[3] ?? 'Work offers'

switch (process.argv[2]){
    case '-r': refresh(); break;
    case '-t': transform(); break;
    default: console.log('Please declare working mode!')
}

function refresh(){
    import('./database/data-run.js').then(dr => {
        dr.updateAllData(collection)
            .catch((e) => console.error('Extracting was unsuccessful!\n' + e.stack))
    })
}

function transform(){
    import('./database/data-run.js').then(dr=>{
        dr.transform(collection)
            .catch((e) => console.error('Transformation unsuccessful!\n' + e.stack))
    })
}