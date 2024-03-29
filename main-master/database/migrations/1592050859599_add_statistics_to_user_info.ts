import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import Env from '@ioc:Adonis/Core/Env'

export default class UserInfos extends BaseSchema {
  protected tableName = 'user_infos'

  public async up () {
    if (Env.get('DB_CONNECTION') !== 'tenants') {
      this.schema.table(this.tableName, (table) => {
        table.integer('added').defaultTo(0)
        table.integer('auto_added').defaultTo(0)
        table.integer('completed').defaultTo(0)
        table.integer('auto_completed').defaultTo(0)
        table.integer('skipped').defaultTo(0)
      })
    }
  }

  public async down () {
    if (Env.get('DB_CONNECTION') !== 'tenants') {
      this.schema.table(this.tableName, (table) => {
        table.dropColumn('added')
        table.dropColumn('auto_added')
        table.dropColumn('completed')
        table.dropColumn('auto_completed')
        table.dropColumn('skipped')
      })
    }
  }
}
