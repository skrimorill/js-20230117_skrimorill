/**
 * pick - Creates an object composed of the picked object properties:
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to pick
 * @returns {object} - returns the new object
 */
export const pick = (obj, ...fields) => {
  let fruits2 = {}

  for (let [key, value] of Object.entries(obj)) {
    for (let arg of [...fields]) {
      if (key === arg) {
        fruits2[key] = value
      }
    }
  }
  return fruits2
};
