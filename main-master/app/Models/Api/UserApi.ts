import { DateTime } from 'luxon'
import {BaseModel, column, hasMany} from '@ioc:Adonis/Lucid/Orm'
import {HasMany} from '@ioc:Adonis/Lucid/Relations'
import PostApi from 'App/Models/Api/PostApi'

export default class UserApi extends BaseModel {
  public static table = 'users'
  @hasMany(() => PostApi)
  public posts: HasMany<typeof PostApi>

  @column({ isPrimary: true })
  public id: number
  @column()
  public user_id: number
  @column()
  public user_name: string
  @column()
  public group_id: number
  @column()
  public group_name: string
  @column()
  public points_all: number
  @column()
  public status: number
  @column()
  public number_posts_in_list: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
