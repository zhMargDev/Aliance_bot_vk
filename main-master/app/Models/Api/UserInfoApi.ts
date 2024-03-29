import {BaseModel, belongsTo, column} from '@ioc:Adonis/Lucid/Orm'
import UserApi from 'App/Models/Api/UserApi'
import {BelongsTo} from '@ioc:Adonis/Lucid/Relations'

export default class UserInfoApi extends BaseModel {
  @belongsTo(() => UserApi)
  public user: BelongsTo<typeof UserApi>

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
