import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import Env from '@ioc:Adonis/Core/Env'

export default class Transactions extends BaseSchema {
  protected tableName = 'buffer_transactions'

  public async up () {
    if (Env.get('DB_CONNECTION') !== 'tenants') {
      this.schema.createTable(this.tableName, (table) => {
        table.increments('id')
        table.integer('user_id')
        table.integer('post_id')
        table.integer('action').defaultTo(0)
        table.integer('type').defaultTo(0)
        table.json('data')
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
