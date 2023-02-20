/* eslint-disable no-useless-escape */
import numeral from 'numbro'
import uuid from 'uuid'

const lowerCase = (value) => {
  return value ? value.toLowerCase() : value
}

const upperCase = (value) => {
  return value ? (value.toLowerCase() === 'wsol' ? 'wSOL' : value.toUpperCase()) : value
}

const upperCaseFirstLetter = (lower) => {
  if (lower) {
    const upper = lower.replace(/^\w/, function (chr) {
      return chr.toUpperCase()
    })
    return upper
  }
  return ''
}

// Format number like 9,999,999
const formatNumberBro = (number, mantissa = 4, options) => {
  const trimMantissa = get(options, 'trimMantissa', true)
  const isReturnNaN = get(options, 'isReturnNaN')
  const textNa = get(options, 'textNa')

  if (number !== true && number !== false && number !== 'null' && number !== null &&
    !isNaN(number) && number !== undefined && number !== 'NaN' && number !== Infinity) {
    const realNumber = number.numerator ? number.toSignificant(6) : number
    if (typeof realNumber === 'string' || typeof realNumber === 'number') {
      if (realNumber.toString().length > 0) {
        return numeral(realNumber.toString().replace(/\,/g, '')).format({ trimMantissa, thousandSeparated: true, mantissa: parseInt(mantissa) })
      }
    }
  }
  return isReturnNaN ? (textNa || 'N/A') : (trimMantissa ? 0 : '0.00')
}

const formatBilion = (labelValue, mssa = 2) => {
  // Nine Zeroes for Billions
  let mantissa = mssa
  if (mssa === 0) {
    mantissa = 2
  }

  const numFormat = Math.abs(Number(labelValue)) >= 1.0e+9
    ? (Math.abs(Number(labelValue)) / 1.0e+9).toFixed(mantissa) + ' B'
    // Six Zeroes for Millions
    : Math.abs(Number(labelValue)) >= 1.0e+6
      ? (Math.abs(Number(labelValue)) / 1.0e+6).toFixed(mantissa) + ' M'
      // Three Zeroes for Thousands
      : formatNumberBro(labelValue, mantissa)

  return numFormat === 'N/A' ? '' : numFormat
}

export const generateRandom = (limit = 16, isNumber) => {
  let text = ''
  const possible = isNumber ? '123456789' : 'abcdefghijklmnopqrstuvwxyz'
  for (let i = 0; i < limit; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return text
}

const generateDeviceID = (key) => {
  const idV4 = uuid.v4()
  return { id: uuid.v5(key, idV4), public: idV4 }
}

const validateLink = (url, isReturnError) => {
  if (!/^(f|ht)tps?:\/\//i.test(url)) {
    const newUrl = 'https://' + url

    const pattern = '([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?(/.*)?'

    if (new RegExp(pattern).test(newUrl)) {
      return isReturnError ? true : newUrl
    } else {
      return isReturnError ? false : `https://www.google.com/search?q=${url}&oq=${url}`
    }
  }
  return isReturnError ? true : url
}

const countDots = (number, letter = '\\.') => {
  const string = number.toString()
  return (string.match(RegExp(letter, 'g')) || []).length
}

export const compareString = (value, value2) => {
  return lowerCase(value) === lowerCase(value2)
}

// Convert 2e8 to real number
export const scientificToDecimal = (num) => {
  const sign = Math.sign(num)
  // if the number is in scientific notation remove it
  if (/\d+\.?\d*e[\+\-]*\d+/i.test(num)) {
    const zero = '0'
    const parts = String(num).toLowerCase().split('e') // split into coeff and exponent
    const e = parts.pop() // store the exponential part
    let l = Math.abs(e) // get the number of zeros
    const direction = e / l // use to determine the zeroes on the left or right
    const coeffArray = parts[0].split('.')

    if (direction === -1) {
      coeffArray[0] = Math.abs(coeffArray[0])
      num = zero + '.' + new Array(l).join(zero) + coeffArray.join('')
    } else {
      const dec = coeffArray[1]
      if (dec) l = l - dec.length
      num = coeffArray.join('') + new Array(l + 1).join(zero)
    }
  }

  if (sign < 0) {
    num = -num
  }
  return num
}

const validateEmail = (email) => {
  if (email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return !re.test(String(email.trim()).toLowerCase())
  } else {
    return true
  }
}

const validateNumber = (strNumber) => {
  try {
    const reg = /^([0-9_.,]+)$/
    return reg.test(scientificToDecimal(strNumber))
  } catch (error) {
    return false
  }
}

export default {
  compareString,
  validateEmail,
  countDots,
  validateNumber,
  generateRandom,
  validateLink,
  generateDeviceID,
  upperCaseFirstLetter,
  formatNumberBro,
  formatBilion,
  lowerCase,
  upperCase
}
