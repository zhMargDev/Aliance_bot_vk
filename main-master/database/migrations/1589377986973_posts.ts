import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import Env from '@ioc:Adonis/Core/Env'

export default class Posts extends BaseSchema {
  protected tableName = 'posts'

  public async up () {
    if (Env.get('DB_CONNECTION') !== 'tenants') {
      this.schema.createTable(this.tableName, (table) => {
        table.increments('id')
        table.integer('user_id')
        table.integer('social').defaultTo(1)
        table.integer('type').defaultTo(1)
        table.integer('interest_id')
        table.integer('owner_id')
        table.integer('post_id')
        table.integer('status').defaultTo(1)
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
