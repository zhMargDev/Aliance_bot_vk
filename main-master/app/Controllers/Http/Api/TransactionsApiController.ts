import Transaction from 'App/Models/Base/Transaction'
import {DateTime} from 'luxon'
import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import * as configGroups from 'App/Bot/Sources/vk/groups.json'

export default class TransactionsApiController {
  //public static async getByActionAndType (inputValues, action, type) {
  public static async getByActionAndType ({ request, response, params }: HttpContextContract): Promise<any> {
    const group = request.header('Group')
    if (group) {
      Transaction.connection = configGroups[group].database
      const transactions = await Transaction.query()
        .where('action', '=', params.action)
        .where('type', '=', params.type)
        .orderBy('createdAt', 'desc')
      return transactions
    }
    return response.status(400).send('E_MISSING_PARAMETER')
  }
  public async getByActionAndTypeLast14 ({ request, response, params }: HttpContextContract): Promise<any> {
    const group = request.header('Group')
    console.log(group)
    console.log(params)
    if (group) {
      const thisTime = DateTime.local()
      const hoursSinceAdding = thisTime.minus({days: 14})
      Transaction.connection = configGroups[group].database
      const transactions = await Transaction.query()
        // @ts-ignore
        .where('createdAt', '>', hoursSinceAdding)
      return transactions
    }
    return response.status(400).send('E_MISSING_PARAMETER')
  }
}
