/**
 * omit - creates an object composed of enumerable property fields
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to omit
 * @returns {object} - returns the new object
 */
export const omit = (obj, ...fields) => {
  let fruits2 = new Object(obj) 
  for (let [key, value] of Object.entries(obj)) {
    for (let arg of [...fields]) {
      if (key === arg) {
        delete fruits2[key]
      }
    }
  }
return fruits2
};
