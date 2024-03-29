import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import Env from '@ioc:Adonis/Core/Env'

export default class InterestsSchema extends BaseSchema {
  protected tableName = 'users'

  public async up () {
    if (Env.get('DB_CONNECTION') !== 'tenants') {
      this.schema.renameTable('interests', 'groups')
    }
  }

  public async down () {
    if (Env.get('DB_CONNECTION') !== 'tenants') {
      this.schema.renameTable('groups', 'interests')
    }
  }
}
