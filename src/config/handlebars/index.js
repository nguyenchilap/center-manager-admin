module.exports = {
    sum: (a, b) => a + b,
    isNone: param => param === 'none', 
    dateTimeModifier: date => date.toLocaleString(),
    removePercent: (str) => str.replace(new RegExp('%', 'g'), ' '),
    orLogical: (a, b) => a || b,
}