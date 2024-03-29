import AddTaskAction from 'App/Controllers/Http/Bot/Modules/Task/Actions/AddTaskAction'
import CompleteTaskAction from 'App/Controllers/Http/Bot/Modules/Task/Actions/CompleteTaskAction'
import SkipTaskAction from 'App/Controllers/Http/Bot/Modules/Task/Actions/SkipTaskAction'
import CurrentTaskAction from 'App/Controllers/Http/Bot/Modules/Task/Actions/CurrentTaskAction'
import CurrentListTaskAction from 'App/Controllers/Http/Bot/Modules/Task/Actions/CurrentListTaskAction'
import CurrentTaskSpotlightAction from 'App/Controllers/Http/Bot/Modules/Task/Actions/CurrentTaskSpotlightAction'
import CompleteListTasks from 'App/Controllers/Http/Bot/Modules/Task/Actions/CompleteListTasks'
import CompleteSpotlightTasks from './Actions/CompleteSpotlightTasks'

export default class TasksActions {
  public static async AddTask (inputValues) {
    return await AddTaskAction.init(inputValues)
  }

  public static async completeTask (inputValues) {
    return await CompleteTaskAction.init(inputValues)
  }

  public static async skipTask (inputValues) {
    return await SkipTaskAction.getAction(inputValues)
  }

  public static async getCurrentTask (inputValues) {
    return await CurrentTaskAction.getCurrentTask(inputValues)
  }

  public static async getCurrentSpotlightTask (inputValues) {
    return await CurrentTaskSpotlightAction.getCurrentSpotlightTask(inputValues)
  }

  public static async getListTasks (inputValues) {
    return await CurrentListTaskAction.getListTasks(inputValues)
  }

  public static async completeListTasks (inputValues) {
    return await CompleteListTasks.init(inputValues)
  }

  public static async completeSpotlightTasks (inputValues) {
    return await CompleteSpotlightTasks.init(inputValues)
  }

  
}
