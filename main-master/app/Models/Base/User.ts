import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, hasOne } from '@ioc:Adonis/Lucid/Orm'
import Post from 'App/Models/Base/Post'
import { HasMany, HasOne } from '@ioc:Adonis/Lucid/Relations'
import UserInfo from 'App/Models/Base/UserInfo'
import Transaction from 'App/Models/Base/Transaction'

export default class User extends BaseModel {
  @hasMany(() => Post, {
    localKey: 'user_id',
    foreignKey: 'user_id',
  })
  public posts: HasMany<typeof Post>

  @hasOne(() => UserInfo, {
    localKey: 'user_id',
    foreignKey: 'user_id',
  })
  public info: HasOne<typeof UserInfo>

  @hasMany(() => Transaction, {
    localKey: 'user_id',
    foreignKey: 'user_id',
  })
  public transactions: HasMany<typeof Transaction>

  @column({ isPrimary: true })
  public id: number
  @column()
  public user_id: number
  @column()
  public user_name: string
  @column()
  public group_id: number
  @column()
  public points_all: number
  @column()
  public points_week: number
  @column()
  public status: number
  @column()
  public bot_stage: number
  @column()
  public user_token: string
  @column()
  public number_posts_in_list: number
  @column()
  public notification_activity: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
