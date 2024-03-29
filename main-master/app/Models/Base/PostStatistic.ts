import { DateTime } from 'luxon'
import {BaseModel, belongsTo, column} from '@ioc:Adonis/Lucid/Orm'
import {BelongsTo} from '@ioc:Adonis/Lucid/Relations'
import Post from 'App/Models/Base/Post'

export default class PostStatistic extends BaseModel {
  public get table () {
    return 'post_statistics'
  }

  @belongsTo(() => Post)
  public post: BelongsTo<typeof Post>


  @column({ isPrimary: true })
  public id: number

  @column()
  public post_id: number

  @column()
  public views_count: number

  @column()
  public reposts_count: number

  @column()
  public likes_count: number

  @column()
  public bot_likes_count: number

  @column()
  public bot_auto_likes_count: number

  @column()
  public comments_count: number

  @column()
  public bot_comments_count: number

  @column()
  public bot_auto_comments_count: number

  @column()
  public assignment_count: number

  @column()
  public showing: number

  @column()
  public completed: number

  @column()
  public auto_completed: number

  @column()
  public skipped: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
