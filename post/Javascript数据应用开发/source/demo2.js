let transactions = [
  {
    timestamp: 1519864292535,
    category: '餐饮',
    price: 6.00
  },
  {
    timestamp: 1519874872261,
    category: '餐饮',
    price: 12.00
  },
  {
    timestamp: 1519899849526,
    category: '餐饮',
    price: 52.50
  },
  {
    timestamp: 1519953249020,
    category: '餐饮',
    price: 4.50
  },
  {
    timestamp: 1519963102270,
    category: '餐饮',
    price: 13.50
  },
  {
    timestamp: 1519999849526,
    category: '餐饮',
    price: 104.25
  }
]

transactions = transactions.map(function(data) {
  data.moment = moment(data.timestamp)
  return data
})
console.log(transactions);

const transactionsGroupedByDate = _.groupBy(transactions, function(transaction) {
  return transaction.moment.format('YYYY-MM-DD')
})
console.log(transactionsGroupedByDate)

const transactionsGroupedByWeek = _.groupBy(transactions, function(transaction) {
  return transaction.moment.format('YYYY-WW')
})
console.log(transactionsGroupedByWeek)

const transactionsGroupedByMonth = _.groupBy(transactions, function(transaction) {
  return transaction.moment.format('YYYY-MM')
})
console.log(transactionsGroupedByMonth)