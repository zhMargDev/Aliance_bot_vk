import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import Env from '@ioc:Adonis/Core/Env'

export default class Users extends BaseSchema {
  protected tableName = 'users'

  public async up () {
    if (Env.get('DB_CONNECTION') !== 'tenants') {
      this.schema.createTable(this.tableName, (table) => {
        table.increments('id')
        table.integer('user_id')
        table.text('user_name')
        table.integer('points_all').defaultTo(0)
        table.integer('points_week').defaultTo(0)
        table.text('user_token')
        table.integer('interest_id')
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
