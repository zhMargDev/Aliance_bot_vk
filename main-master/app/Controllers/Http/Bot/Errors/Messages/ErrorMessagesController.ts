import TextsController from 'App/Controllers/Http/Bot/TextsController'
import VkApiController from 'App/Controllers/Http/Bot/Api/VkApiController'
import User from 'App/Models/Base/User'

export default class ErrorMessagesController {
  public static async getAdminErrorMessage (inputValues, textError) {
    const ActionResponse = {
      message: '',
      attachment: '',
      keyboard: {},
    }

    User.connection = inputValues.configGroup.database
    const userCurrent = await User.findBy('user_id', inputValues.peerId)
    const url = `https://vk.com/gim${inputValues.configGroup.groupId}?sel=${inputValues.peerId}&msgid=${inputValues.idMessage}`
    const shortLinkDialog = await VkApiController.getShortLink(inputValues.configGroup, url)
    ActionResponse.message = `${userCurrent?.user_id} (${userCurrent?.user_name})\n🌐 Произошла ошибка: ${shortLinkDialog.short_url}\n${textError}\n🌐'-------------'`
    return ActionResponse
  }
  public static async getUserErrorMessage (inputValues) {
    const ActionResponse = {
      message: '',
      attachment: '',
      keyboard: {},
    }
    ActionResponse.message = await TextsController.getText(inputValues.configGroup,'error', 0)
    return ActionResponse
  }
}
