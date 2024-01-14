switch (process.argv[2]){
    case '-r': refresh(); break;
    case '-s': service(); break;
    default: console.log('Please declare working mode!')
}

function refresh(){
    import('./database/data-run.js').then(dr => {
        dr.updateAllData()
            .then(() => (console.log('Extraction has started!')))
            .catch((e) => console.error('Extracting was unsuccessful.\n' + e.stack))
    })
}

function service() { import('./cli/service.js') }