import TextsController from 'App/Controllers/Http/Bot/TextsController'
import UsersController from 'App/Controllers/Http/Bot/UsersController'
import {DateTime} from 'luxon'
import TasksActions from 'App/Controllers/Http/Bot/Modules/Task/TasksActions'
import VkApiController from 'App/Controllers/Http/Bot/Api/VkApiController'
import MapActionsController from 'App/Controllers/Http/Bot/Messages/MapActionsController'
import CurrentTaskAction from 'App/Controllers/Http/Bot/Modules/Task/Actions/CurrentTaskAction'
import DesertDay3NextMessagesController
  from 'App/Controllers/Http/Bot/Modules/Desert/Messages/DesertDay3NextMessagesController'
import TasksController from 'App/Controllers/Http/Bot/TasksController'
import PostsController from 'App/Controllers/Http/Bot/PostsController'

export default class DesertActionsController {
  public static async getAction (inputValues) {
    const checkGroupsIsMember = await UsersController.checkGroupsIsMember(inputValues) // состоит ли пользователь в группе
    if (!checkGroupsIsMember) {
      return false
    }
    const userCurrent = await UsersController.getUserById(inputValues)
    if (!userCurrent) {
      await UsersController.registerNewUserForDesert(inputValues)
    } else {
      //const params = await DesertActionsController.getActionWaitAfterRegisterMessage(inputValues)
      //await VkApiController.sendMessage(inputValues, params)
    }
    let params
    // @ts-ignore
    if (DateTime.local().setZone('Europe/Moscow').ts > 1591211599010) { // 03 июня 2020
      let task = await TasksController.getTaskByUserId(inputValues)
      if (!task) {
        await CurrentTaskAction.getCurrentTask(inputValues)
        task = await TasksController.getTaskByUserId(inputValues)
      }
      // @ts-ignore
      let completedTaskDay = JSON.parse(task.completed_task_day)
      if (completedTaskDay.length >= 7) {
        const params = await DesertDay3NextMessagesController.getActionDoneTasksMessage(inputValues)
        await VkApiController.sendMessage(inputValues, params)
        return true
      }
      if (await PostsController.checkLinkPost(inputValues)) {
        params = await TasksActions.AddTask(inputValues)
        if (params) {
          if (params.message.includes('Молодец')) {
            params.keyboard = {
              'one_time': false,
              'buttons': [
                [{
                  'action': {
                    'type': 'text',
                    'payload': {TASK: 'TALL'},
                    'label': 'Выполнить задания',
                  },
                  'color': 'positive',
                }],
              ],
            }
          } else {
            params.keyboard = {'buttons': [], 'one_time': true}
          }
          await VkApiController.sendMessage(inputValues, params)
        }
      } else if (inputValues.payload.TASK) {
        console.log(inputValues.payload.TASK)
        params = await MapActionsController.getAction(inputValues)
        console.log(params)
        if (params) {
          await VkApiController.sendMessage(inputValues, params)
        }
      }
    // @ts-ignore
    //if (DateTime.local().setZone('Europe/Moscow').ts > 1592203799000) { // 10:00 МСК 15 июня 2020
    // @ts-ignore
    } else if (DateTime.local().setZone('Europe/Moscow').ts > 1591211599000) { // 03 июня 2020
      if (await PostsController.checkLinkPost(inputValues)) {
        params = await TasksActions.AddTask(inputValues)
      }
      if (params) {
        if (params.message.includes('успешно')) {
          params.keyboard = {
            'one_time': false,
            'buttons': [
              [{
                'action': {
                  'type': 'text',
                  'payload': {DESERT: 'DAY1'},
                  'label': 'Готово',
                },
                'color': 'positive',
              }],
            ],
          }
        } else {
          params.keyboard = {'buttons': [],'one_time': true}
        }
        await VkApiController.sendMessage(inputValues, params)
      }
    }
    return true
  }
  public static async getActionUserRegisterMessage (inputValues) {
    const ActionResponse = {
      message: '',
      attachment: '',
      keyboard: {'buttons': [],'one_time': true},
    }
    ActionResponse.message = await TextsController.getText(inputValues.configGroup,'register', 'userRegisterMessageAfterRegister')
    return ActionResponse
  }
  public static async getActionWaitAfterRegisterMessage (inputValues) {
    const ActionResponse = {
      message: '',
      attachment: '',
      keyboard: {'buttons': [],'one_time': true},
    }
    ActionResponse.message = await TextsController.getText(inputValues.configGroup,'register', 'waitMessageAfterRegister')
    return ActionResponse
  }
}
