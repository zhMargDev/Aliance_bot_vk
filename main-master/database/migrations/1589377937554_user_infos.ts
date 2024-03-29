import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import Env from '@ioc:Adonis/Core/Env'

export default class UserInfos extends BaseSchema {
  protected tableName = 'user_infos'

  public async up () {
    if (Env.get('DB_CONNECTION') !== 'tenants') {
      this.schema.createTable(this.tableName, (table) => {
        table.increments('id')
        table.integer('user_id')
      })
    }
  }

  public async down () {
    if (Env.get('DB_CONNECTION') !== 'tenants') {
      this.schema.dropTable(this.tableName)
    }
  }
}
