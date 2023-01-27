/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
    const resultStr = []
    let str = string
    .split('')
    .reduce((acc, el) => {
        acc[el] = (acc[el] || 0) + 1
        return acc
    }, {})

    for (const [key, value] of Object.entries(str)) {
        if (value > size) {
            resultStr.push(key.repeat(size))
        } else {
            resultStr.push(key.repeat(value))
        }
    }
        return resultStr.join('')
}
