import UsersController from 'App/Controllers/Http/Bot/UsersController'
import Post from 'App/Models/Base/Post'
import {DateTime} from 'luxon'
import Task from 'App/Models/Base/Task'

export default class DesertClearDateActionsController {
  public async init () {
    const users = await UsersController.getUserAll('tenant_desert')
    for (const user of users) {
      Post.connection = 'tenant_desert'
      await Post.query().where('user_id', user.user_id).update({ created_at: DateTime.local().minus({ hours: 24 }) })
      Task.connection = 'tenant_desert'
      await Task.query().where('user_id', user.user_id).update({ completed_task_day: '[]' })
    }
    return true
  }
}
