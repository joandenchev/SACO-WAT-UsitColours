export function usitSearch(el, regex) {
    return el.extras.match(regex)
}

export function notNull(el) {
    return !el.extras;
}

