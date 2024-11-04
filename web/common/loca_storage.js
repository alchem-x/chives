export function getFromLocalStorage(key) {
    const s = localStorage.getItem(key)
    try {
        return JSON.parse(s)
    } catch (err) {

    }

}
export function setToLocalStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
}