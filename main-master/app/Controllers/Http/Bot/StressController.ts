// import axios from 'axios'
import * as configGroups from 'App/Bot/Sources/vk/groups.json'
import UsersController from 'App/Controllers/Http/Bot/UsersController'

export default class StressController {
  public async init () {
    //BufferTransaction.connection = inputValues.configGroup.database
    console.time('FinishTestTime')
    /* let requests = []
    let i
    for (i = 0; i < 100; i++) {
      // @ts-ignore
      requests.push(axios.get('http://localhost:3000/api/v1/stress/go'))
    }
    await Promise.all(requests) */
    console.timeEnd('FinishTestTime')
    return 88
  }
  public async go () {
    const inputValues = {
      'configGroup': configGroups[193411179],
    }
    console.log(111)
    const users = await UsersController.getUserAll(inputValues)
    console.log(users.length)
    return 1
  }
}
