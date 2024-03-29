import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import Env from '@ioc:Adonis/Core/Env'

export default class Users extends BaseSchema {
  protected tableName = 'users'

  public async up () {
    if (Env.get('DB_CONNECTION') !== 'tenants') {
      this.schema.table(this.tableName, (table) => {
        table.integer('notification_activity')
      })
    }
  }

  public async down () {
    this.schema.table(this.tableName, (table) => {
      table.dropColumn('notification_activity')
    })
  }
}
