import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import * as configGroups from 'App/Bot/Sources/vk/groups.json'
import GroupApi from 'App/Models/Api/GroupApi'

export default class GroupsApiController {
  public async index ({ request, response }: HttpContextContract): Promise<any> {
    const group = request.header('Group')
    if (group) {
      GroupApi.connection = configGroups[group].database
      return await GroupApi.all()
    }
    return response.status(400).send('E_MISSING_PARAMETER')
  }
  public async show ({ request, response, params }: HttpContextContract): Promise<any> {
    const group = request.header('Group')
    if (group) {
      GroupApi.connection = configGroups[group].database
      return await GroupApi.findByOrFail('id', params.id)
    }
    return response.status(400).send('E_MISSING_PARAMETER')
  }

  public async getParentGroups ({ request, response }: HttpContextContract): Promise<any> {
    const group = request.header('Group')
    if (group) {
      GroupApi.connection = configGroups[group].database
      return await GroupApi
        .query()
        .where('parent_id', 0)
    }
    return response.status(400).send('E_MISSING_PARAMETER')
  }

  public async getGroupByParentId ({ request, response, params }: HttpContextContract): Promise<any> {
    const group = request.header('Group')
    if (group) {
      GroupApi.connection = configGroups[group].database
      return await GroupApi
        .query()
        .where('parent_id', params.id)
        .firstOrFail()
    }
    return response.status(400).send('E_MISSING_PARAMETER')
  }

  public async getGroupByCode ({ request, response, params }: HttpContextContract): Promise<any> {
    const group = request.header('Group')
    if (group) {
      GroupApi.connection = configGroups[group].database
      return await GroupApi
        .query()
        .where('code', params.code)
        .firstOrFail()
    }
    return response.status(400).send('E_MISSING_PARAMETER')
  }

  public async store ({ request, response }: HttpContextContract): Promise<any> {
    const group = request.header('Group')
    const allowedParams = ['name', 'weight', 'parent_id', 'parent_code', 'code']
    if (group) {
      const params = request.all()
      let searchPayload
      GroupApi.connection = configGroups[group].database
      if (params.code) {
        searchPayload = { code: params.code }
      } else {
        searchPayload = { id: params.id }
      }
      const savePayload = {}
      for (let param in params) {
        if (allowedParams.includes(param)) {
          savePayload[param] = params[param]
        }
      }
      return await GroupApi.updateOrCreate(searchPayload, savePayload)
    }
    return response.status(400).send('E_MISSING_PARAMETER')
  }
}
