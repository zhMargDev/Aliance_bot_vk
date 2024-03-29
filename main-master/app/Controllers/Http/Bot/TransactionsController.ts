import Transaction from 'App/Models/Base/Transaction'
import ErrorActionController from 'App/Controllers/Http/Bot/Errors/Actions/ErrorActionController'
import {DateTime} from 'luxon'

export default class TransactionsController {
  public static async store (inputValues, currentPostId = 0, action, type, data = {}) {
    Transaction.connection = inputValues.configGroup.database
    const transaction = await Transaction.create({
      'user_id': inputValues.peerId,
      'post_id': currentPostId,
      'action': action,
      'type': type,
      'data': data,
    })
    if (transaction.$isPersisted) {
      return true
    }
    const textError = 'errorTransactions: Ошибка при записи транзакции'
    await ErrorActionController.sendAdminErrorAction(inputValues, textError)
    return false
  }
  public static async getByActionAndTypeLast (inputValues) {
    const hoursSinceAdding = DateTime.fromObject({ year: 2020, month: 8, day: 24})
    const hoursSinceAddingEnd = DateTime.fromObject({ year: 2020, month: 8, day: 30})
    Transaction.connection = inputValues.configGroup.database
    const transactions = await Transaction.
      query()
      // @ts-ignore
      .where('createdAt', '>=', hoursSinceAdding)
      // @ts-ignore
      .where('createdAt', '<=', hoursSinceAddingEnd)
      .whereIn('action', [
        1,
        2,
      ])
      .whereIn('type', [
        1,
        2,
        3,
      ])
      .orderBy('createdAt', 'desc')
    console.log(transactions)
    return transactions
  }
  public static async getByActionAllDate (inputValues, typeAction) {
    Transaction.connection = inputValues.configGroup.database
    const transactions = await Transaction.
      query()
      .where('user_id', '=', inputValues.peerId)
      .where('action', '=', typeAction)
    return transactions
  }
}
