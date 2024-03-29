import BufferTransaction from 'App/Models/Base/BufferTransaction'
import ErrorActionController from 'App/Controllers/Http/Bot/Errors/Actions/ErrorActionController'
import {DateTime} from 'luxon'

export default class BufferTransactionsController {
  public static async store (inputValues, currentPostId = 0, action, type, data = {}) {
    BufferTransaction.connection = inputValues.configGroup.database
    const transaction = await BufferTransaction.create({
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
  public static async deleteOldBufferTransactions (inputValues) {
    const thisTime = DateTime.local()
    const hoursLifetimePost = thisTime.minus({ hours: inputValues.configGroup.settings.lifetime_post })
    BufferTransaction.connection = inputValues.configGroup.database
    const transactions = await BufferTransaction.
      query()
      // @ts-ignore
      .where('createdAt', '<', hoursLifetimePost)
      .delete()
    return transactions
  }
  public static async getByUserId (inputValues) {
    const thisTime = DateTime.local()
    const hoursSinceAdding = thisTime.minus({ hours: inputValues.configGroup.settings.hours_since_adding })
    BufferTransaction.connection = inputValues.configGroup.database
    const transactions = await BufferTransaction.
      query()
      // @ts-ignore
      .where('createdAt', '>', hoursSinceAdding)
      .where('user_id', '=', inputValues.peerId)
      .orderBy('createdAt', 'desc')
    return transactions
  }
  public static async getByActionAll (inputValues, action) {
    const thisTime = DateTime.local()
    const lifetimePost = thisTime.minus({ hours: inputValues.configGroup.settings.lifetime_post })
    BufferTransaction.connection = inputValues.configGroup.database
    const transactions = await BufferTransaction.
      query()
      // @ts-ignore
      .where('createdAt', '>', lifetimePost)
      .where('action', '=', action)
      .orderBy('createdAt', 'asc')
      .limit(400000)
    return transactions
  }
  public static async getByAction (inputValues, action) {
    const thisTime = DateTime.local()
    const hoursSinceAdding = thisTime.minus({ hours: inputValues.configGroup.settings.hours_since_adding })
    BufferTransaction.connection = inputValues.configGroup.database
    const transactions = await BufferTransaction.
      query()
      // @ts-ignore
      .where('createdAt', '>', hoursSinceAdding)
      .where('user_id', '=', inputValues.peerId)
      .where('action', '=', action)
      .orderBy('createdAt', 'desc')
    return transactions
  }
  public static async getByActionLast (inputValues, action) {
    const thisTime = DateTime.local()
    const hoursSinceAdding = thisTime.minus({ hours: inputValues.configGroup.settings.hours_since_adding })
    BufferTransaction.connection = inputValues.configGroup.database
    const transactions = await BufferTransaction.
      query()
      // @ts-ignore
      .where('createdAt', '>', hoursSinceAdding)
      .where('user_id', '=', inputValues.peerId)
      .where('action', '=', action)
      .orderBy('createdAt', 'desc')
      .first()
    return transactions
  }
  public static async getByActionAndType (inputValues, action, type) {
    const thisTime = DateTime.local()
    const hoursSinceAdding = thisTime.minus({ hours: inputValues.configGroup.settings.hours_since_adding })
    BufferTransaction.connection = inputValues.configGroup.database
    const transactions = await BufferTransaction.
      query()
      // @ts-ignore
      .where('createdAt', '>', hoursSinceAdding)
      .where('user_id', '=', inputValues.peerId)
      .where('action', '=', action)
      .where('type', '=', type)
      .orderBy('createdAt', 'desc')
    return transactions
  }
  public static async getByActionAndTypeThisDay (inputValues, action, type) {
    const thisTime = DateTime.local()
    const hoursSinceAdding = thisTime.minus({ hours: inputValues.configGroup.settings.hours_since_adding })
    BufferTransaction.connection = inputValues.configGroup.database
    const transactions = await BufferTransaction.
      query()
      // @ts-ignore
      .where('createdAt', '>', hoursSinceAdding)
      .where('user_id', '=', inputValues.peerId)
      .where('action', '=', action)
      .where('type', '=', type)
      .orderBy('createdAt', 'desc')
    const transactionsToday = transactions.filter((transaction) => {
      return (transaction.createdAt.setZone('Europe/Moscow').toRelativeCalendar() === 'today' || transaction.createdAt.setZone('Europe/Moscow').toRelativeCalendar() === 'сегодня')
    })
    return transactionsToday
  }
  public static async getByPostIdAndAction (inputValues, postId, typeAction) {
    BufferTransaction.connection = inputValues.configGroup.database
    const transactions = await BufferTransaction.
      query()
      .where('user_id', '=', inputValues.peerId)
      .where('post_id', '=', postId)
      .where('action', '=', typeAction)
      .first()
    return transactions
  }
  public static async getCompletedTaskId (inputValues, lifetimePost) {
    BufferTransaction.connection = inputValues.configGroup.database
    const transactions = await BufferTransaction.
      query()
      // @ts-ignore
      .where('createdAt', '>', lifetimePost)
      .where('user_id', '=', inputValues.peerId)
      .where('action', '=', 3)
    const postIds = []
    transactions.forEach((transaction) => {
      // @ts-ignore
      postIds.push(transaction.post_id)
    })
    return postIds
  }
  public static async getSkippedTaskId (inputValues, lifetimePost) {
    BufferTransaction.connection = inputValues.configGroup.database
    const transactions = await BufferTransaction.
      query()
      // @ts-ignore
      .where('createdAt', '>', lifetimePost)
      .where('user_id', '=', inputValues.peerId)
      .where('action', '=', 4)
    const postIds = []
    transactions.forEach((transaction) => {
      // @ts-ignore
      postIds.push(transaction.post_id)
    })
    return postIds
  }
  public static async getActionTaskId (inputValues, lifetimePost, action) {
    BufferTransaction.connection = inputValues.configGroup.database
    const transactions = await BufferTransaction.
      query()
      // @ts-ignore
      .where('createdAt', '>', lifetimePost)
      .where('user_id', '=', inputValues.peerId)
      .where('action', '=', action)
    const postIds = []
    transactions.forEach((transaction) => {
      // @ts-ignore
      postIds.push(transaction.post_id)
    })
    return postIds
  }
  public static async getWaitingTaskId (inputValues, lifetimePost) {
    BufferTransaction.connection = inputValues.configGroup.database
    const transactions = await BufferTransaction.
      query()
      // @ts-ignore
      .where('createdAt', '>', lifetimePost)
      .where('user_id', '=', inputValues.peerId)
      .whereIn('action', [10, 11])
    const postIds = []
    transactions.forEach((transaction) => {
      // @ts-ignore
      postIds.push(transaction.post_id)
    })
    return postIds
  }
  public static async getWaitingSpotlightTaskId (inputValues, lifetimePostSpotlight) {
    BufferTransaction.connection = inputValues.configGroup.database
    const transactions = await BufferTransaction.
      query()
      // @ts-ignore
      .where('createdAt', '>', lifetimePostSpotlight)
      .where('user_id', '=', inputValues.peerId)
      .whereIn('action', [10, 11])
    const postIds = []
    transactions.forEach((transaction) => {
      // @ts-ignore
      postIds.push(transaction.post_id)
    })
    return postIds
  }
}
