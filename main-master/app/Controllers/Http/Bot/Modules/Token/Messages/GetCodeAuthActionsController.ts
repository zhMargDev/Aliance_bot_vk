//import Env from '@ioc:Adonis/Core/Env'
import VkApiController from "App/Controllers/Http/Bot/Api/VkApiController";

export default class InfoActionsController {
  public static async getActionMessage(configGroup) {
    const ActionResponse = {
      message: "",
      attachment: "",
      keyboard: {},
    };
    const url = `https://oauth.vk.com/authorize?client_id=${configGroup.client_id}&display=page&redirect_uri=https://api.weplex.app/api/v1/auth/${configGroup.groupId}&scope=wall,group,offline&response_type=code&v=${configGroup.v}`;
    const shortLink = await VkApiController.getShortLink(configGroup, url);
    ActionResponse.message = `Нажми на кнопку "Активировать" или перейди по ссылке, чтобы активировать бота: ${shortLink.short_url}\nЕсли не получается активировать, то попробуй зайти с мобильного браузера или с компьютера.`;
    /* ActionResponse.keyboard = {
      'one_time': false,
      'buttons': [
        [{
          action: {
            type: 'open_link',
            link: url,
            label: 'Активировать',
            payload: JSON.stringify({
              url: url,
            }),
          },
        }],
      ],
    } */
    return ActionResponse;
  }
}
