import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import * as configGroups from 'App/Bot/Sources/vk/groups.json'
import UserApi from 'App/Models/Api/UserApi'
import GroupsController from 'App/Controllers/Http/Bot/GroupsController'
import TransactionsController from 'App/Controllers/Http/Bot/TransactionsController'
import GroupApi from 'App/Models/Api/GroupApi'
import User from 'App/Models/Base/User'
import BufferTransactionsController from 'App/Controllers/Http/Bot/BufferTransactionsController'

export default class UsersApiController {
  /*public async index ({ request, response }: HttpContextContract): Promise<any> {
    const group = request.header('Group')
    if (group) {
      UserApi.connection = configGroups[group].database
      return await UserApi.all()
    }
    return response.status(400).send('E_MISSING_PARAMETER')
  }*/
  public async index ({ request, response }: HttpContextContract): Promise<any> {
    const group = request.header('Group')
    if (group) {
      GroupApi.connection = configGroups[group].database
      const groups = await GroupApi.all()
      UserApi.connection = configGroups[group].database
      const users = await UserApi.all()
      for (const user of users) {
        groups.forEach((group) => {
          if (group.id === user.group_id) {
            // @ts-ignore
            user.group_name = group.name
          }
        })
        // @ts-ignore
        if (user.status === '2' || user.status === '3') {
          const configGroup = configGroups[group]
          const inputValues = {
            'peerId': user.user_id,
            'configGroup': configGroup,
          }
          const dataChangeStatusPriorityUser = await BufferTransactionsController.getByActionLast(inputValues, 7)
          if (
            dataChangeStatusPriorityUser === null
          ) {
            // Пользователи с закончившимся приоритетом
            user.status = 1
          }
        }
      }
      return users
    }
    return response.status(400).send('E_MISSING_PARAMETER')
  }
  public async userLastActives ({ request, response, params }: HttpContextContract): Promise<any> {
    const group = request.header('Group')
    if (group) {
      let inputValues = {
        'peerId': params.user_id,
        'configGroup': configGroups[group],
        'code': null,
      }
      GroupApi.connection = configGroups[group].database
      const groups = await GroupApi.all()
      User.connection = configGroups[group].database
      const users = await User.all()
      users.forEach((user) => {
        groups.forEach((group) => {
          if (group.id === user.group_id) {
            // @ts-ignore
            user.group_id = group.name
            user.user_token = ''
            user.points_week = 0
          }
        })
      })
      const transactions = await TransactionsController.getByActionAndTypeLast(inputValues)
      transactions.forEach((transaction) => {
        users.forEach((user) => {
          if (transaction.user_id === user.user_id) {
            // @ts-ignore
            if (transaction.data.points) {
              // @ts-ignore
              user.points_week = user.points_week + transaction.data.points
              //console.log(`User: ${user.user_id} - ${user.points_week}`)
            }
          }
        })
      })
      return users
      /*GroupApi.connection = configGroups[group].database
      const groups = await GroupApi.all()
      User.connection = configGroups[group].database
      const users = await User.all()
      users.forEach((user) => {
        groups.forEach((group) => {
          if (group.id === user.group_id) {
            // @ts-ignore
            user.group_id = group.name
          }
        })
      })
      return users*/
    }
    return response.status(400).send('E_MISSING_PARAMETER')
  }
  public async show ({ request, response, params }: HttpContextContract): Promise<any> {
    const group = request.header('Group')
    if (group) {
      UserApi.connection = configGroups[group].database
      return await UserApi.findByOrFail('user_id', params.id)
    }
    return response.status(400).send('E_MISSING_PARAMETER')
  }

  public async store ({ request, response }: HttpContextContract): Promise<any> {
    const group = request.header('Group')
    const allowedParams = ['group_id', 'user_name', 'points_all']
    if (group) {
      const params = request.all()
      if (!params.user_id) {
        return response.status(400).send('E_MISSING_PARAMETER')
      }
      let inputValues = {
        'peerId': params.user_id,
        'configGroup': configGroups[group],
        'code': null,
      }
      UserApi.connection = configGroups[group].database
      const searchPayload = { user_id: params.user_id }
      const savePayload = {}
      for (let param in params) {
        if (allowedParams.includes(param)) {
          savePayload[param] = params[param]
        }
      }
      if (params['group_code']) {
        inputValues.code = params['group_code']
        const groupByCode = await GroupsController.getGroupByCode(inputValues)
        savePayload['group_id'] = groupByCode.serialize().id
      }
      const user = await UserApi.findBy('user_id', params.user_id)
      if (!user) {
        await TransactionsController.store(inputValues, 0, 6, 1)
      } else {
        await TransactionsController.store(inputValues, 0, 7, 3)
      }
      return await UserApi.updateOrCreate(searchPayload, savePayload)
    }
    return response.status(400).send('E_MISSING_PARAMETER')
  }
}
