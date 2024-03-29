export default class TextsController {
  public static async getText (configGroup: any, type: string, id: any, replaceArray: any = {}) {
    let text = configGroup.texts[type][id]
    for(let i in replaceArray) {
      text = text.replace(i, replaceArray[i])
    }
    return text
  }
}
