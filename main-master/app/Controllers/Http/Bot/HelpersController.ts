export default class TextsController {
  public static randomInteger (min, max) {
    const rand = min + Math.random() * (max + 1 - min)
    return Math.floor(rand)
  }
  public static clearTextLinkPost (text) {
    text = text.split(' ')
    text = text.shift()
    text = text.split('%')
    text = text[0].split('wall')
    text = text.pop()
    text = text.replace('/all', '')
    text = text.replace('%2Fall', '')
    text = text.replace('#actions', '')
    return text
  }
  public static filterTransactionByItem (transactions, action, type = 0) {
    transactions = transactions.filter((transaction) => {
      return transaction.action === action
    })
    if (type !== 0) {
      transactions = transactions.filter((transaction) => {
        return transaction.type === type
      })
    }
    return transactions
  }
  public static filterTransactionByItemAndThisDay (transactions, action, type = 0) {
    transactions = transactions.filter((transaction) => {
      return transaction.action === action && (transaction.createdAt.setZone('Europe/Moscow').toRelativeCalendar() === 'today' || transaction.createdAt.setZone('Europe/Moscow').toRelativeCalendar() === 'сегодня')
    })
    if (type !== 0) {
      transactions = transactions.filter((transaction) => {
        return transaction.type === type
      })
    }
    return transactions
  }
}
