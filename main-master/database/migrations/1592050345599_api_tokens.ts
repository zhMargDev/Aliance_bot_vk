import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import Env from '@ioc:Adonis/Core/Env'

export default class ApiTokensSchema extends BaseSchema {
  protected tableName = 'api_tokens'

  public async up () {
    if (Env.get('DB_CONNECTION') === 'tenants') {
      this.schema.createTable(this.tableName, (table) => {
        table.increments('id').primary()
        // table.integer('user_id').references('id').inTable('users').onDelete('CASCADE')
        table.integer('user_id').unsigned().notNullable().index('user_id')
        table.string('name').notNullable()
        table.string('type').notNullable()
        table.string('token', 64).notNullable()
        /**
         * "useTz: true" utilizes timezone option in PostgreSQL and MSSQL
         */
        table.timestamp('expires_at', {useTz: true}).nullable()
        table.timestamp('created_at', {useTz: true}).nullable()

        table.foreign('user_id').references('authtenants.id').onDelete('cascade')
      })
    }
  }

  public async down () {
    if (Env.get('DB_CONNECTION') === 'tenants') {
      this.schema.dropTable(this.tableName)
    }
  }
}
