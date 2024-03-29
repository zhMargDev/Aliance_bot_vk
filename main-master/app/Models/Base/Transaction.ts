import { DateTime } from 'luxon'
import {BaseModel, belongsTo, column} from '@ioc:Adonis/Lucid/Orm'
import User from 'App/Models/Base/User'
import {BelongsTo} from '@ioc:Adonis/Lucid/Relations'

export default class Transaction extends BaseModel {
  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @column({ isPrimary: true })
  public id: number
  @column()
  public user_id: number
  @column()
  public post_id: number
  @column()
  public action: number
  @column()
  public type: number
  @column()
  public data: object

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
