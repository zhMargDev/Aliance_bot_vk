import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import Env from '@ioc:Adonis/Core/Env'
import {DateTime} from 'luxon'

export default class Tasks extends BaseSchema {
  protected tableName = 'tasks'

  public async up () {
    if (Env.get('DB_CONNECTION') !== 'tenants') {
      this.schema.table(this.tableName, (table) => {
        table.text('completed_task_day').defaultTo('[]')
        table.dateTime('completed_task_day_at').defaultTo(DateTime.local().toString())
      })
    }
  }

  public async down () {
    if (Env.get('DB_CONNECTION') !== 'tenants') {
      this.schema.table(this.tableName, (table) => {
        table.dropColumn('completed_task_day')
        table.dropColumn('completed_task_day_at')
      })
    }
  }
}
