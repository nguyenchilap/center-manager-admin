module.exports = {
    sum: (a, b) => a + b,
    isNone: param => param === 'none', 
    dateTimeModifier: date => {
        if (date) return date.toLocaleString();
        return date;
    },
    removePercent: (str) => str.replace(new RegExp('%', 'g'), ' '),
    orLogical: (a, b) => a || b,
}