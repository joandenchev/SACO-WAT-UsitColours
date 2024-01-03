switch (process.argv[2]){
    case '-r': refresh(); break;
    case '-s': service(); break;
}

function refresh(){
    import('./server/database/data-run.js').then(dr => {
        dr.updateAllData()
            .then(() => (console.log('Extraction has started!')))
            .catch((e) => console.error('Extracting was unsuccessful.\n' + e.stack))
    })}

function service() { import('./server/rest/service.js') }