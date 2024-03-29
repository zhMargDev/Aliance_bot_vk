import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import Env from '@ioc:Adonis/Core/Env'

export default class AuthtenantsSchema extends BaseSchema {
  protected tableName = 'authtenants'

  public async up () {
    if (Env.get('DB_CONNECTION') === 'tenants') {
      this.schema.createTable(this.tableName, (table) => {
        table.increments('id').primary()
        table.string('email', 255).notNullable()
        table.string('password', 180).notNullable()
        table.string('remember_me_token').nullable()
        table.timestamps(true)
      })
    }
  }

  public async down () {
    if (Env.get('DB_CONNECTION') === 'tenants') {
      this.schema.dropTable(this.tableName)
    }
  }
}
