const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const toFixed = (number, n) => {
  return Number(number.toFixed(n));
}

/**
 * calculate the sum of array
 */
const arraySum = (array = []) => {
  let length = array.length;
  let total = 0;
  for (let i = 0; i < length; i++) {
    total += array[i];
  }
  return total;
}

module.exports = {
  formatTime,
  toFixed,
  arraySum,
}
