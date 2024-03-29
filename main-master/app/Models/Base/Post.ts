import { DateTime } from 'luxon'
import {BaseModel, belongsTo, column, hasMany} from '@ioc:Adonis/Lucid/Orm'
import User from 'App/Models/Base/User'
import {BelongsTo, HasMany} from '@ioc:Adonis/Lucid/Relations'
import PostStatistic from 'App/Models/Base/PostStatistic'

export default class Post extends BaseModel {
  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @hasMany(() => PostStatistic, {
    localKey: 'id',
    foreignKey: 'post_id',
  })
  public post_statistics: HasMany<typeof PostStatistic>

  @column({ isPrimary: true })
  public id: number

  @column()
  public user_id: number

  @column()
  public social: number

  @column()
  public type: number

  @column()
  public group_id: number

  @column()
  public owner_id: number

  @column()
  public post_id: number

  @column()
  public stop_like: number

  @column()
  public status: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
