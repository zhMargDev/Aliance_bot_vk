import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Task extends BaseModel {
  @column({ isPrimary: true })
  public id: number
  @column()
  public user_id: number
  @column()
  public type: number
  @column()
  public social: number
  @column()
  public current_post_id: number
  @column()
  // @ts-ignore
  public skipped_post_id: string
  @column()
  // @ts-ignore
  public complete_post_id: string
  @column()
  public completed_task_day: string

  @column.dateTime({ autoCreate: true })
  public completed_task_day_at: DateTime

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
