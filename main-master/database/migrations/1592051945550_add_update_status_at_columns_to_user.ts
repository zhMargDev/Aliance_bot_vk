import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import Env from '@ioc:Adonis/Core/Env'
import {DateTime} from 'luxon'

export default class Users extends BaseSchema {
  protected tableName = 'users'

  public async up () {
    if (Env.get('DB_CONNECTION') !== 'tenants') {
      this.schema.table(this.tableName, (table) => {
        table.dateTime('updated_status_at').defaultTo(DateTime.local().toString())
      })
    }
  }

  public async down () {
    if (Env.get('DB_CONNECTION') !== 'tenants') {
      this.schema.table(this.tableName, (table) => {
        table.dropColumn('updated_status_at')
      })
    }
  }
}
