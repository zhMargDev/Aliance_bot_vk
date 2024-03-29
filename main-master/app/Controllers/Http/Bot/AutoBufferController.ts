import * as configGroups from 'App/Bot/Sources/vk/groups.json'
import BufferTransactionsController from 'App/Controllers/Http/Bot/BufferTransactionsController'

export default class AutoBudderController {
  public async init (): Promise<any> {
    for (let key in configGroups) {
      const configGroup = configGroups[key]
      const inputValues = {
        'configGroup': configGroup,
      }
      console.time('FinishTestTime')
      if (configGroup.database) {
        await BufferTransactionsController.deleteOldBufferTransactions(inputValues)
      }
      console.timeEnd('FinishTestTime')
    }
  }
}
