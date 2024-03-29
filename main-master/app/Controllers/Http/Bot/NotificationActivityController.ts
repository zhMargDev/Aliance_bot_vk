import * as configGroups from "App/Bot/Sources/vk/groups.json";
import UsersController from "App/Controllers/Http/Bot/UsersController";
import NotificationActivityMessages from "./Modules/Other/Messages/NotificationActivityMessages";
import VkApiController from "./Api/VkApiController";
import { DateTime } from "luxon";

export default class NotificationActivityController {
  public async NotificationActivityGoGo() {
    //await this.NotificationActivityGo(456456546)
    await this.NotificationActivityGo(657567567);
  }
  public async NotificationActivityGo(group_id) {
    const inputValues = {
      configGroup: configGroups[group_id],
      peerId: 0,
    };
    console.time("FinishTestTime");
    let users = await UsersController.getUsersAllByNotificationActivity(
      inputValues
    );
    users = users.filter((user) => {
      // @ts-ignore
      const timeUnansweredGo = Math.round(
        (DateTime.local().ts - user.updatedAt.ts) / 1000
      );
      return timeUnansweredGo > user.notification_activity * 86400;
    });
    const membersGroup = await VkApiController.getGroupMembers(inputValues);
    for (let i = 0; i < users.length; i++) {
      inputValues.peerId = users[i].user_id;
      // @ts-ignore
      const checkGroupsIsMember = membersGroup.includes(inputValues.peerId);
      if (checkGroupsIsMember) {
        const message = await VkApiController.getHistoryOneUser(
          inputValues,
          users[i].user_id
        );
        if (!message) {
          continue;
        }
        // @ts-ignore
        const timeUnansweredGo =
          Math.round(DateTime.local().ts / 1000) - message.items[0].date;
        if (timeUnansweredGo > users[i].notification_activity * 86400) {
          const params =
            await NotificationActivityMessages.NotificationActivityMessage();
          if (params) {
            await VkApiController.sendMessage(inputValues, params);
          }
        }
      }
    }
    console.timeEnd("FinishTestTime");
    return users;
  }
}
