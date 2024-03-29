import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import Env from '@ioc:Adonis/Core/Env'

export default class PostsStatistics extends BaseSchema {
  protected tableName = 'posts_statistics'

  public async up () {
    if (Env.get('DB_CONNECTION') !== 'tenants') {
      this.schema.createTable(this.tableName, (table) => {
        table.increments('id')
        table.integer('post_id')
        table.integer('views_count')
        table.integer('reposts_count')
        table.integer('likes_count')
        table.integer('comments_count')
        table.integer('assignment_count')
        table.timestamps(true)
      })
    }
  }

  public async down () {
    if (Env.get('DB_CONNECTION') !== 'tenants') {
      this.schema.dropTable(this.tableName)
    }
  }
}
