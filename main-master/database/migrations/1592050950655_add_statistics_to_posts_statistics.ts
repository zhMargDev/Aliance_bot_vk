import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import Env from '@ioc:Adonis/Core/Env'

export default class PostsStatistics extends BaseSchema {
  protected tableName = 'post_statistics'

  public async up () {
    if (Env.get('DB_CONNECTION') !== 'tenants') {
      this.schema.table(this.tableName, (table) => {
        table.integer('bot_likes_count').defaultTo(0)
        table.integer('bot_auto_likes_count').defaultTo(0)
        table.integer('bot_comments_count').defaultTo(0)
        table.integer('bot_auto_comments_count').defaultTo(0)
        table.integer('showing').defaultTo(0)
        table.integer('completed').defaultTo(0)
        table.integer('auto_completed').defaultTo(0)
        table.integer('skipped').defaultTo(0)
      })
    }
  }

  public async down () {
    if (Env.get('DB_CONNECTION') !== 'tenants') {
      this.schema.table(this.tableName, (table) => {
        table.dropColumn('bot_likes_count')
        table.dropColumn('bot_auto_likes_count')
        table.dropColumn('bot_comments_count')
        table.dropColumn('bot_auto_comments_count')
        table.dropColumn('showing')
        table.dropColumn('completed')
        table.dropColumn('auto_completed')
        table.dropColumn('skipped')
      })
    }
  }
}
