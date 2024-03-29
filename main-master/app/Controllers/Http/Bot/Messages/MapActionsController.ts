import InfoMessagesController from 'App/Controllers/Http/Bot/Modules/Info/Messages/InfoMessagesController'
import PointsMessagesController from 'App/Controllers/Http/Bot/Modules/Info/Messages/PointsMessagesController'
import TaskAllMessagesController from 'App/Controllers/Http/Bot/Modules/Task/Messages/TaskAllMessages'
import TaskAllLikesMessagesController from 'App/Controllers/Http/Bot/Modules/Task/Messages/TaskAllLikesMessages'
import TaskAllLikesSpotlightMessagesController from '../Modules/Task/Messages/TaskAllLikesSpotlightMessages'
import TaskAddMessagesController from 'App/Controllers/Http/Bot/Modules/Task/Messages/TaskAddMessages'
import GroupsChoiseAddActionsController from 'App/Controllers/Http/Bot/Messages/GroupsChoiseAddActionsController'
import GroupsChoiseActionsController from 'App/Controllers/Http/Bot/Messages/GroupsChoiseActionsController'
import MainMenuMessages from 'App/Controllers/Http/Bot/Modules/MainMenu/Messages/MainMenuMessages'
import SupportStartMessages from 'App/Controllers/Http/Bot/Modules/Support/Messages/SupportMessages'
import TasksActions from 'App/Controllers/Http/Bot/Modules/Task/TasksActions'

export default class MapActionsController {
  public static getAction (inputValues) {
    return this.mapActions(inputValues)
  }
  private static async mapActions (inputValues) {
    let currentController
    switch(inputValues.payload.CHATBOT) {
      case 'INFO':
        currentController = await InfoMessagesController.getActionMessage(inputValues)
        break
      case 'POINTS':
        currentController = await PointsMessagesController.getActionMessage(inputValues)
        break
      case 'BACK':
        currentController = await MainMenuMessages.getActionMessage(inputValues)
        break
      case 'PROFILE':
        currentController = await GroupsChoiseActionsController.getActionMessage(inputValues)
        break
    }
    switch(inputValues.payload.SUPPORT) {
      case 'START':
        currentController = await SupportStartMessages.getActionMessage(inputValues, 'start')
        break
    }
    switch(inputValues.payload.TASK) {
      case 'TALL':
        currentController = await TaskAllMessagesController.getActionMessage(inputValues)
        break
      case 'TALLSPOTLIGHT':
        currentController = await TaskAllLikesSpotlightMessagesController.getActionMessage(inputValues)
        break
      case 'TADD':
        currentController = await TaskAddMessagesController.getActionMessage(inputValues)
        break
      case 'TASKSKIP':
        currentController = await TasksActions.skipTask(inputValues)
        break
      case 'TASKCOMPLETE':
        currentController = await TasksActions.completeTask(inputValues)
        break
      case 'TALLLIKES':
        currentController = await TaskAllLikesMessagesController.getActionMessage(inputValues)
        break
    }
    if (inputValues.payload.TASK && inputValues.payload.TASK.includes('TASKLISTCOMPLETE')) {
      currentController = await TasksActions.completeListTasks(inputValues)
    }
    if (inputValues.payload.TASK && inputValues.payload.TASK.includes('TASKSPOTCOMPLETE')) {
      currentController = await TasksActions.completeSpotlightTasks(inputValues)
    }
    if (inputValues.payload.INTEREST) {
      currentController = await GroupsChoiseAddActionsController.getActionMessage(inputValues)
    }
    if (!inputValues.payload) {
      currentController = await MainMenuMessages.getActionMessage(inputValues)
    }
    return currentController
  }
}
