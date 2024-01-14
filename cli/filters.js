export function comaOperation(el, storage) {
    const els = []
    el.extras.trim().split(/\s*[.,!?-]+\s*/g).forEach(e => e && els.push(e))
    els.forEach(e => storage.push({id: el.id, word: e}))
}

export function usitSearch(el, regex) {
    return el.extras.match(regex)
}

export function notNull(el) {
    return !el.extras;
}