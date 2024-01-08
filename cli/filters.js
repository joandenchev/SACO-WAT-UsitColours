import o from "./query.js";

//executes a function for each element in the array and returns a new empty array (it can be populated with result.push(el))
export function filter(filterFunction, offers = o, args) {
    const result = []
    for (const el of offers) {
        filterFunction(el, result, args)
    }
    return result
}

export function comaOperation(el, result){
    const els = []
    el.extras.trim().split(/\s*[.,!?-]+\s*/g).forEach(e => e && els.push(e))
    els.forEach(e => result.push({ id: el.id, word: e }))
}

export function usitSearch(el, result, [regex, filterOut]){
    if ( !(filterOut ^!! el.extras.match(regex)) )
        result.push(el)
}