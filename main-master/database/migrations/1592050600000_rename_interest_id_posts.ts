import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import Env from '@ioc:Adonis/Core/Env'

export default class Posts extends BaseSchema {
  protected tableName = 'posts'

  public async up () {
    if (Env.get('DB_CONNECTION') !== 'tenants') {
      this.schema.table(this.tableName, (table) => {
        table.renameColumn('interest_id', 'group_id')
      })
    }
  }

  public async down () {
    if (Env.get('DB_CONNECTION') !== 'tenants') {
      this.schema.table(this.tableName, (table) => {
        table.renameColumn('group_id', 'interest_id')
      })
    }
  }
}
