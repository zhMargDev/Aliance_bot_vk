import UserInfo from 'App/Models/Base/UserInfo'

export default class UsersInfoController {
  public static async changeValue (inputValues, column): Promise<any> {
    const allowedParams = ['added', 'auto_added', 'completed', 'auto_completed', 'skipped']
    if (allowedParams.includes(column)) {
      UserInfo.connection = inputValues.configGroup.database
      const UserInfoCurrent = await UserInfo.findBy('user_id', inputValues.peerId)
      if (UserInfoCurrent) {
        UserInfoCurrent[column]++
        await UserInfoCurrent.save()
        if (UserInfoCurrent.$isPersisted) {
          return true
        }
      } else {
        const userInfo = new UserInfo()
        userInfo.user_id = inputValues.peerId
        userInfo[column] = 1
        await userInfo.save()
      }
    }
    return false
  }
  public static async getInfoByUserId (inputValues) {
    UserInfo.connection = inputValues.configGroup.database
    return await UserInfo.
      query()
      // @ts-ignore
      .where('user_id', '=', inputValues.peerId)
      .first()
  }
}
