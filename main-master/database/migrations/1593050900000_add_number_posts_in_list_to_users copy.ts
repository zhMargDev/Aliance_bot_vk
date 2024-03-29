import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import Env from '@ioc:Adonis/Core/Env'

export default class Users extends BaseSchema {
  protected tableName = 'users'

  public async up () {
    if (Env.get('DB_CONNECTION') !== 'tenants') {
      this.schema.table(this.tableName, (table) => {
        table.integer('number_posts_in_list')
      })
    }
  }

  public async down () {
    this.schema.table(this.tableName, (table) => {
      table.dropColumn('number_posts_in_list')
    })
  }
}
