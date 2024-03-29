import axios from 'axios'
import * as configGroups from 'App/Bot/Sources/vk/groups.json'
import VkApiController from 'App/Controllers/Http/Bot/Api/VkApiController'
import {DateTime} from 'luxon'

export default class UnansweredTaskController {
  public async UnansweredGoGo () {
    //await this.UnansweredGo(186925139)
    await this.UnansweredGo(186662606)
    //await this.UnansweredGo(193802273)
    await this.UnansweredGo(166709779)
    await this.UnansweredGo(191895214)
    await this.UnansweredGo(194983949)
    await this.UnansweredGo(193411179)
  }
  public async UnansweredGo (group_id) {
    let offset = 0
    if (group_id === 193411179) {
      offset = 0
    }
    let requests = []
    const inputValues = {
      'configGroup': configGroups[group_id],
    }
    const UnansweredGo = await VkApiController.getUnansweredGo(inputValues, offset)
    let UnansweredReq = {}
    for (let i = 0; i < 50; i++) {
      if (UnansweredGo.items[i]) {
        // @ts-ignore
        const timeUnansweredGo = Math.round(DateTime.local().ts / 1000) - UnansweredGo.items[i].last_message.date
        if (
          timeUnansweredGo > 60 && timeUnansweredGo < 86400
        ) {
          UnansweredReq = {
            'type': 'message_new',
            'object': {
              'message': {},
            },
            'group_id': group_id,
            'event_id': `${group_id}_${UnansweredGo.items[i].last_message.peer_id}_${UnansweredGo.items[i].last_message.conversation_message_id}`,
          }
          // @ts-ignore
          UnansweredReq.object.message = UnansweredGo.items[i].last_message
          await this.delay()
          await axios.post('https://api.weplex.app/api/v1/initUnanswered', UnansweredReq)
          // @ts-ignore
          await requests.push(axios.post('https://api.weplex.app/api/v1/initUnanswered', UnansweredReq))
        }
      }
    }
    await Promise.all(requests)
  }
  public async delay () {
    return new Promise(resolve => setTimeout(resolve, 100))
  }
}
