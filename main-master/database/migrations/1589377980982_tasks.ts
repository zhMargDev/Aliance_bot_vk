import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import Env from '@ioc:Adonis/Core/Env'

export default class Tasks extends BaseSchema {
  protected tableName = 'tasks'

  public async up () {
    if (Env.get('DB_CONNECTION') !== 'tenants') {
      this.schema.createTable(this.tableName, (table) => {
        table.increments('id')
        table.integer('user_id')
        table.integer('type')
        table.integer('social').defaultTo(1)
        table.integer('current_post_id')
        table.text('skipped_post_id').defaultTo('[]')
        table.text('complete_post_id').defaultTo('[]')
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
