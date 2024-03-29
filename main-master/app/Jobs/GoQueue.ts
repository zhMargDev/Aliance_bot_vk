// @ts-ignore
import { bull } from './Bull'
import InterlayersController from 'App/Controllers/Http/Bot/InterlayersController'
export default class GoQueue {
  public static async goJob (req) {
    if (await bull.getJob(req.event_id)) {
      return false
    }
    if (req.object.message.date > 1590380811) {
      const key: string = req.event_id
      
      await InterlayersController.index(req)
      /*bull.process(key, async () => {
      })*/
      bull.add(key, req)
    }
  }
}
