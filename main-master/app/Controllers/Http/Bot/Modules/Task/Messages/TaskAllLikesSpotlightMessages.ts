import BufferTransactionsController from '../../../BufferTransactionsController'
import PostsController from '../../../PostsController'
import TasksActions from '../TasksActions'

export default class TaskAllLikesSpotlightMessagesController {
  public static async getActionMessage (inputValues) {
    const ActionResponse = {
      message: '',
      attachment: '',
      keyboard: {},
    }
    const currentSpotlightTask = await TasksActions.getCurrentSpotlightTask(inputValues)
    let postId = 0
    if(currentSpotlightTask) {
    const postById = await PostsController.getPostById(inputValues, currentSpotlightTask.id)
      if (postById) {
        ActionResponse.attachment = `wall${postById.owner_id}_${postById.post_id}`
        postId = postById.id
      }
    }
    ActionResponse.message = `В этом разделе ты сможешь найти актуальные посты из Прожектора.\nПодробнее: https://vk.com/wall-128870047_105770\n\n`
    // const completedTaskByTransactions = await BufferTransactionsController.getByPostIdAndAction(inputValues, postId, 3)
    /*if(completedTaskByTransactions) {
      ActionResponse.message = ActionResponse.message + 'У тебя уже начисленны баллы за этот пост, но ты можешь дать обратную связь на добровольных началах :)\n\n'
    }*/
    ActionResponse.keyboard = {
      'one_time': false,
      'buttons': [
        [{
          'action': {
            'type': 'text',
            'payload': {TASK: `TASKSPOTCOMPLETE;${postId}`},
            'label': '✓ Далее',
          },
          'color': 'positive',
        }],
        [{
          'action': {
            'type': 'text',
            'payload': {CHATBOT: 'BACK'},
            'label': '🔙 Вернуться',
          },
          'color': 'secondary',
        }],
      ],
    }
    return ActionResponse
  }
  public static async getActionCompleteMessage (inputValues) {
    const ActionResponse = {
      message: '',
      attachment: '',
      keyboard: {},
    }
    const currentSpotlightTask = await TasksActions.getCurrentSpotlightTask(inputValues)
    let postId = 0
    if(currentSpotlightTask) {
    const postById = await PostsController.getPostById(inputValues, currentSpotlightTask.id)
      if (postById) {
        ActionResponse.attachment = `wall${postById.owner_id}_${postById.post_id}`
        ActionResponse.message = `Супер, двигаемся дальше!\nДержи новый пост из Прожектора.\n\n`
        postId = postById.id
      }
    }
    /*const completedTaskByTransactions = await BufferTransactionsController.getByPostIdAndAction(inputValues, postId, 3)
    if(completedTaskByTransactions) {
      ActionResponse.message = ActionResponse.message + 'У тебя уже начисленны баллы за этот пост, но ты можешь дать обратную связь на добровольных началах :)\n\n'
    }*/
    ActionResponse.keyboard = {
      'one_time': false,
      'buttons': [
        [{
          'action': {
            'type': 'text',
            'payload': {TASK: `TASKSPOTCOMPLETE;${postId}`},
            'label': '✓ Далее',
          },
          'color': 'positive',
        }],
        [{
          'action': {
            'type': 'text',
            'payload': {CHATBOT: 'BACK'},
            'label': '🔙 Вернуться',
          },
          'color': 'secondary',
        }],
      ],
    }
    return ActionResponse
  }
}
