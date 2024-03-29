//import VkApiController from 'App/Controllers/Http/Bot/Api/VkApiController'
//import ErrorMessagesController from 'App/Controllers/Http/Bot/Errors/Messages/ErrorMessagesController'

export default class ErrorActionController {
  // @ts-ignore
  public static async sendAdminErrorAction(inputValues, textError) {
    /* const params = await ErrorMessagesController.getAdminErrorMessage(inputValues, textError)
    inputValues.peerId = 1111111111111111111
    if (params) {
      await VkApiController.sendMessage(inputValues, params)
    } */
    return true;
  }
}
