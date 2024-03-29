import User from 'App/Models/Base/User'
import TasksActions from '../TasksActions'

export default class TaskAllLikesMessagesController {
  public static async getActionMessage (inputValues) {
    const ActionResponse = {
      message: '',
      attachment: '',
      keyboard: {},
    }
    const currentListTasks = await TasksActions.getListTasks(inputValues)
    let posts = ''
    let postsId = ''
    if (currentListTasks) {
      currentListTasks.forEach(post => {
        // @ts-ignore
        posts = posts + `\nhttps://vk.com/wall${post.owner_id}_${post.post_id}\n`
        // @ts-ignore
        postsId = postsId + `${post.id};`
      })
    }
    User.connection = inputValues.configGroup.database
    const userCurrent = await User.findBy('user_id', inputValues.peerId)
    let points = 0
    if (userCurrent) {
      points = userCurrent.points_all
    }
    // ActionResponse.message = '\n❤➕💬 Баллы начисляются как за лайк, так и за комментарии.'
    // ActionResponse.message = `${ActionResponse.message}\n🔥После нажатия на кнопку "✓ Далее" баллы начислятся за выполненные задания, остальные будут пропущены и больше не будут тебе показаны.`
    // ActionResponse.message = `${ActionResponse.message}\n🎱Общих баллов: ${points}`
    ActionResponse.message = `${ActionResponse.message}\n\nТы можешь изменить количество постов в списке.\nДля этого напиши посты:20.\nКоличество постов должно быть от 1 до 30.`
    ActionResponse.message = `${ActionResponse.message}
    ${posts}
    `
    ActionResponse.keyboard = {
      'one_time': false,
      'buttons': [
        [{
          'action': {
            'type': 'text',
            'payload': {TASK: `TASKLISTCOMPLETE;${postsId}`},
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
    const currentListTasks = await TasksActions.getListTasks(inputValues)
    let posts = ''
    let postsId = ''
    if (currentListTasks) {
      currentListTasks.forEach(post => {
        // @ts-ignore
        posts = posts + `\nhttps://vk.com/wall${post.owner_id}_${post.post_id}\n`
        // @ts-ignore
        postsId = postsId + `${post.id};`
      })
    }
    /*if (pointsAll === 3000) {
      ActionResponse.message = `\nУпс! ВКонтакте пока не даёт информацию по этим постам, но не переживай, в ближайшее время бот автоматически начислит тебе баллы за эти посты. А пока держи новые:
      ${posts}`
    } else if (pointsAll === 0) {
      ActionResponse.message = `\n✖ Жаль, что ты пропускаешь эти посты.
      Если не пропускаешь, значит ВКонтакте отдаёт некорректную информацию по этим постам.
      Не переживай, автозачёт подхватит и у тебя не пропадёт ни один балл.
      А пока держи новые:
      ${posts}`
    } else if (pointsAll > 0) {
      ActionResponse.message = `\nСупер, баллов получено: ${pointsAll}\nВот ещё несколько:
      ${posts}`
    } else {
      ActionResponse.message = '\nЧто-то пошло не так, мы уже разбираемся)'
    }*/
    // ActionResponse.message = `Отлично, двигаемся дальше!\nМы изменили логику начисления баллов, чтобы проблемы ВК не становились нашими.\nВ ближайшие минут 10-20 система все проверит и начислит тебе причитающееся)\nА пока вот новые ссылки:\n\n${posts}`
    ActionResponse.message = `Отлично, двигаемся дальше!\nА пока вот новые ссылки:\n\n${posts}`
    ActionResponse.keyboard = {
      'one_time': false,
      'buttons': [
        [{
          'action': {
            'type': 'text',
            'payload': {TASK: `TASKLISTCOMPLETE;${postsId}`},
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
