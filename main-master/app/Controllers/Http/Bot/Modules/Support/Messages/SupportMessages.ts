import TextsController from 'App/Controllers/Http/Bot/TextsController'
import UsersController from 'App/Controllers/Http/Bot/UsersController'
import User from 'App/Models/Base/User'
import VkApiController from 'App/Controllers/Http/Bot/Api/VkApiController'

export default class SupportMessages {
  public static async getActionMessage (inputValues, chatCommand) {
    if (chatCommand === 'start_admin' || chatCommand === 'start') {
      await UsersController.changeBotStage(inputValues, 10)
    } else if (chatCommand === 'admin_notification') {
      await UsersController.changeBotStage(inputValues, 11)
    } else {
      await UsersController.changeBotStage(inputValues, 1)
    }
    const ActionResponse = {
      message: '',
      attachment: '',
      keyboard: {},
    }
    if (chatCommand === 'admin_notification') {
      User.connection = inputValues.configGroup.database
      const userCurrent = await User.findBy('user_id', inputValues.peerId)
      const url = `https://vk.com/gim${inputValues.configGroup.groupId}?sel=${inputValues.peerId}&msgid=${inputValues.idMessage}`
      const shortLinkDialog = await VkApiController.getShortLink(inputValues.configGroup, url)
      ActionResponse.message = `${userCurrent?.user_id} (${userCurrent?.user_name})\n🌐 Открыт диалог: ${shortLinkDialog.short_url}\n💬 Сообщение: ${inputValues.text}`
    } else {
      ActionResponse.message = await TextsController.getText(inputValues.configGroup, 'support', chatCommand)
    }
    if (chatCommand === 'start_admin' || chatCommand === 'start') {
      ActionResponse.keyboard = {
        'one_time': false,
        'buttons': [
          [{
            'action': {
              'type': 'text',
              'payload': {CHATBOT: 'BACK'},
              'label': '❌ Закрыть чат',
            },
            'color': 'secondary',
          }],
        ],
      }
    }
    return ActionResponse
  }
}
