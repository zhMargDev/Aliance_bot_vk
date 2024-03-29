import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import * as configGroups from 'App/Bot/Sources/vk/groups.json'
import PostStatistic from 'App/Models/Base/PostStatistic'

export default class StatisticApiController {
  public async getPosts ({ request, response }: HttpContextContract): Promise<any> {
    const group = request.header('Group')
    if (group) {
      PostStatistic.connection = configGroups[group].database
      return await PostStatistic
        .query()
        .limit(1000)
    }
    return response.status(400).send('E_MISSING_PARAMETER')
  }
  public async getPostById ({ request, response, params }: HttpContextContract): Promise<any> {
    const group = request.header('Group')
    if (group) {
      PostStatistic.connection = configGroups[group].database
      return await PostStatistic
        .query()
        .where('post_id', params.id)
        .where('views_count', '>', 0)
    }
    return response.status(400).send('E_MISSING_PARAMETER')
  }
}
