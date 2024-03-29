import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class GroupApi extends BaseModel {
  public static table = 'groups'
  @column({ isPrimary: true })
  public id: number
  @column()
  public parent_id: number
  @column()
  public parent_code: string
  @column()
  public name: string
  @column()
  public code: string
  @column()
  public weight: number
}
