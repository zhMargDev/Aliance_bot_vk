import {DateTime} from 'luxon'
import PostEmptyActionsController from 'App/Controllers/Http/Bot/Messages/PostEmptyActionsController'
import VkApiController from 'App/Controllers/Http/Bot/Api/VkApiController'
import HelpersController from 'App/Controllers/Http/Bot/HelpersController'
import PostsController from 'App/Controllers/Http/Bot/PostsController'
import BufferTransactionsController from 'App/Controllers/Http/Bot/BufferTransactionsController'
import PostEmptySpotlightActionsController from '../../../Messages/PostEmptySpotlightActionsController'

export default class CurrentTaskSpotlightAction {
  public static async getCurrentSpotlightTask(inputValues, skipedPost = [], complitePost = []) {
    const thisTime = DateTime.local()
    const lifetimePost = thisTime.minus({ hours: 500 })
    const lifetimePostSpotlight = thisTime.minus({ hours: 72 })
    const updatedTimePost = thisTime.minus({ minutes: 15 })
    const completedTaskByTransactions = await BufferTransactionsController.getActionTaskId(inputValues, lifetimePostSpotlight, 11)
    const skippedTaskByTransactions = await BufferTransactionsController.getActionTaskId(inputValues, lifetimePostSpotlight, 11)
    // const waitingTaskByTransactions = await BufferTransactionsController.getWaitingTaskId(inputValues, lifetimePost)
    const waitingTaskByTransactions = await BufferTransactionsController.getWaitingTaskId(inputValues, lifetimePostSpotlight)
    const allPosts = await PostsController.getPostsAll(inputValues, lifetimePostSpotlight, skipedPost, complitePost, completedTaskByTransactions, skippedTaskByTransactions, updatedTimePost, waitingTaskByTransactions, 2)
    if (allPosts.length === 0) {
      const params = await PostEmptySpotlightActionsController.getActionMessage()
      await VkApiController.sendMessage(inputValues, params)
      return false
    }
    const currentPost = allPosts[HelpersController.randomInteger(0, allPosts.length - 1)]
    return currentPost
  }
}
