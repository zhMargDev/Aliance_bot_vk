import {BaseModel, belongsTo, column} from '@ioc:Adonis/Lucid/Orm'
import User from 'App/Models/Base/User'
import {BelongsTo} from '@ioc:Adonis/Lucid/Relations'

export default class UserInfo extends BaseModel {
  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @column({ isPrimary: true })
  public id: number

  @column()
  public user_id: number

  @column()
  public added: number

  @column()
  public auto_added: number

  @column()
  public completed: number

  @column()
  public auto_completed: number

  @column()
  public skipped: number
}
