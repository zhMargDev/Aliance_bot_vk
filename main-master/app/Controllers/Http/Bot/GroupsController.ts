import Group from 'App/Models/Base/Group'

export default class GroupController {
  public static async getGroupByCode (inputValues): Promise<any> {
    Group.connection = inputValues.configGroup.database
    return await Group
      .query()
      .where('code', inputValues.code)
      .firstOrFail()
  }
}
