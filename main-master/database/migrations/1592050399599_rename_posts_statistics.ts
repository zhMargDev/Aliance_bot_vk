import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import Env from '@ioc:Adonis/Core/Env'

export default class InterestsSchema extends BaseSchema {
  protected tableName = 'posts_statistics'

  public async up () {
    if (Env.get('DB_CONNECTION') !== 'tenants') {
      this.schema.renameTable('posts_statistics', 'post_statistics')
    }
  }

  public async down () {
    if (Env.get('DB_CONNECTION') !== 'tenants') {
      this.schema.renameTable('post_statistics', 'posts_statistics')
    }
  }
}
