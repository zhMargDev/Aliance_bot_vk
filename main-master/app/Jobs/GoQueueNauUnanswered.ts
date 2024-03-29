// @ts-ignore
import { bullNauUnanswered } from './BullNauUnanswered'
import InterlayersController from 'App/Controllers/Http/Bot/InterlayersController'
export default class GoQueueNauUnanswered {
  public static async goJob (req) {
    if (req.object.message.date > 1590380811) {
      const key: string = req.event_id
      await InterlayersController.index(req)
      /*bullNauUnanswered.process(key, async (req) => {
      })*/
      bullNauUnanswered.add(key, req)
    }
  }
}
