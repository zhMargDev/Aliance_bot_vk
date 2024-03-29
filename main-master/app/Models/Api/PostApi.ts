import { DateTime } from 'luxon'
import {BaseModel, belongsTo, column, hasMany} from '@ioc:Adonis/Lucid/Orm'
import {BelongsTo, HasMany} from '@ioc:Adonis/Lucid/Relations'
import UserApi from 'App/Models/Api/UserApi'
import PostStatisticApi from 'App/Models/Api/PostStatisticApi'

export default class PostApi extends BaseModel {
  public static table = 'posts'

  @belongsTo(() => UserApi)
  public user: BelongsTo<typeof UserApi>

  @hasMany(() => PostStatisticApi, {
    localKey: 'id',
    foreignKey: 'post_id',
  })
  public post_statistics: HasMany<typeof PostStatisticApi>

  @column({ isPrimary: true })
  public id: number

  @column()
  public user_id: number

  @column()
  public group_id: number

  @column()
  public owner_id: number

  @column()
  public post_id: number

  @column()
  public type: number

  @column()
  public stop_like: number

  @column()
  public status: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
