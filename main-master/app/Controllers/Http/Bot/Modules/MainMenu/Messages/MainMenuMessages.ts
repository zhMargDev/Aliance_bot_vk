import { DateTime } from "luxon";
import Group from "App/Models/Base/Group";
import User from "App/Models/Base/User";
import UsersController from "App/Controllers/Http/Bot/UsersController";
import PostsController from "App/Controllers/Http/Bot/PostsController";
import UsersInfoController from "App/Controllers/Http/Bot/UsersInfoController";
import BufferTransactionsController from "App/Controllers/Http/Bot/BufferTransactionsController";
import HelpersController from "App/Controllers/Http/Bot/HelpersController";

export default class MainMenuMessages {
  public static async getActionMessage(inputValues) {
    const ActionResponse = {
      message: "",
      attachment: "",
      keyboard: {},
    };
    await UsersController.changeBotStage(inputValues, 1);
    const countPosts = await PostsController.getActivePostsCount(inputValues);
    const countCommandPosts = await PostsController.getActiveCommandPostsCount(
      inputValues
    );
    const countSpotlightPosts =
      await PostsController.getActiveSpotlightPostsCount(inputValues);
    User.connection = inputValues.configGroup.database;
    const transactionsByUserId = await BufferTransactionsController.getByUserId(
      inputValues
    );
    const mainMessage = await this.getMainMessage(
      inputValues,
      transactionsByUserId
    );
    const statisticInfo = await this.getStatisticInfo(
      inputValues,
      transactionsByUserId
    );
    ActionResponse.message = mainMessage + statisticInfo;
    if (inputValues.configGroup.groupId === "325325325325") {
      ActionResponse.keyboard = {
        one_time: false,
        buttons: [
          [
            {
              action: {
                type: "text",
                payload: { TASK: "TALL" },
                label: `Посты [${countPosts}]`,
              },
              color: "positive",
            },
          ],
          [
            {
              action: {
                type: "text",
                payload: { TASK: "TADD" },
                label: "📝 Добавить",
              },
              color: "primary",
            },
          ],
          [
            {
              action: {
                type: "text",
                payload: { SUPPORT: "START" },
                label: "📝 Чат",
              },
              color: "secondary",
            },
            {
              action: {
                type: "text",
                payload: { CHATBOT: "INFO" },
                label: "💡 Инфа",
              },
              color: "secondary",
            },
          ],
        ],
      };
    } else if (inputValues.configGroup.groupId === "325325325") {
      ActionResponse.message = `${ActionResponse.message}\n\nДоступно постов: ${countPosts}`;
      if (countCommandPosts) {
        ActionResponse.message = `${ActionResponse.message}\nДоступно командных постов: ${countCommandPosts}`;
      }
      Group.connection = inputValues.configGroup.database;
      let interest = await Group.query()
        // @ts-ignore
        .where("id", "=", inputValues.currentUser.group_id);
      if (interest.length > 0) {
        ActionResponse.message = `${ActionResponse.message}\n\nТвоя команда: ${interest[0].name}`;
      } else {
        ActionResponse.message = `${ActionResponse.message}\n\nТвоя команда: не выбрано`;
      }
      // if(inputValues.peerId === 3401169 || inputValues.peerId === 1111111111111111111) {
      if (countSpotlightPosts > 0) {
        ActionResponse.keyboard = {
          one_time: false,
          buttons: [
            [
              {
                action: {
                  type: "text",
                  payload: { TASK: "TALL" },
                  label: `Посты [${countCommandPosts}]`,
                },
                color: "positive",
              },
              {
                action: {
                  type: "text",
                  payload: { TASK: "TALLLIKES" },
                  label: "Посты [списком]",
                },
                color: "positive",
              },
            ],
            [
              {
                action: {
                  type: "text",
                  payload: { TASK: "TASKSPOTCOMPLETE" },
                  label: `Прожектор [${countSpotlightPosts}]`,
                },
                color: "positive",
              },
            ],
            [
              {
                action: {
                  type: "text",
                  payload: { TASK: "TADD" },
                  label: "📝 Добавить",
                },
                color: "primary",
              },
            ],
            [
              {
                action: {
                  type: "text",
                  payload: { CHATBOT: "PROFILE" },
                  label: "⚙ Настройки",
                },
                color: "primary",
              },
            ],
            [
              {
                action: {
                  type: "text",
                  payload: { CHATBOT: "INFO" },
                  label: "💡 Инфа",
                },
                color: "secondary",
              },
            ],
          ],
        };
      } else {
        ActionResponse.keyboard = {
          one_time: false,
          buttons: [
            [
              {
                action: {
                  type: "text",
                  payload: { TASK: "TALL" },
                  label: `Посты [${countCommandPosts}]`,
                },
                color: "positive",
              },
              {
                action: {
                  type: "text",
                  payload: { TASK: "TALLLIKES" },
                  label: "Посты [списком]",
                },
                color: "positive",
              },
            ],
            [
              {
                action: {
                  type: "text",
                  payload: { TASK: "TADD" },
                  label: "📝 Добавить",
                },
                color: "primary",
              },
            ],
            [
              {
                action: {
                  type: "text",
                  payload: { CHATBOT: "PROFILE" },
                  label: "⚙ Настройки",
                },
                color: "primary",
              },
            ],
            [
              {
                action: {
                  type: "text",
                  payload: { CHATBOT: "INFO" },
                  label: "💡 Инфа",
                },
                color: "secondary",
              },
            ],
          ],
        };
      }
    } else if (inputValues.configGroup.groupId === "325325325324") {
      Group.connection = inputValues.configGroup.database;
      let interest = await Group.query()
        // @ts-ignore
        .where("id", "=", inputValues.currentUser.group_id);
      if (interest.length > 0) {
        ActionResponse.message = `${ActionResponse.message}\n\nТвоя команда: ${interest[0].name}`;
      } else {
        ActionResponse.message = `${ActionResponse.message}\n\nТвоя команда: не выбрано`;
      }
      ActionResponse.keyboard = {
        one_time: false,
        buttons: [
          [
            {
              action: {
                type: "text",
                payload: { TASK: "TALL" },
                label: `Посты [${countPosts}]`,
              },
              color: "positive",
            },
          ],
          [
            {
              action: {
                type: "text",
                payload: { TASK: "TADD" },
                label: "📝 Добавить",
              },
              color: "primary",
            },
          ],
          [
            {
              action: {
                type: "text",
                payload: { CHATBOT: "PROFILE" },
                label: "⚙ Настройки",
              },
              color: "primary",
            },
          ],
          [
            {
              action: {
                type: "text",
                payload: { CHATBOT: "INFO" },
                label: "💡 Инфа",
              },
              color: "secondary",
            },
          ],
        ],
      };
    } else if (inputValues.configGroup.groupId === "34543564356") {
      ActionResponse.keyboard = {
        one_time: false,
        buttons: [
          [
            {
              action: {
                type: "text",
                payload: { TASK: "TALL" },
                label: `Посты [${countPosts}]`,
              },
              color: "positive",
            },
            {
              action: {
                type: "text",
                payload: { TASK: "TALLLIKES" },
                label: "Посты [списком]",
              },
              color: "positive",
            },
          ],
          [
            {
              action: {
                type: "text",
                payload: { TASK: "TADD" },
                label: "📝 Добавить",
              },
              color: "primary",
            },
          ],
          [
            {
              action: {
                type: "text",
                payload: { CHATBOT: "INFO" },
                label: "💡 Инфа",
              },
              color: "secondary",
            },
          ],
        ],
      };
    } else if (inputValues.configGroup.groupId === "345432543532") {
      Group.connection = inputValues.configGroup.database;
      let interest = await Group.query()
        // @ts-ignore
        .where("id", "=", inputValues.currentUser.group_id);
      if (interest.length > 0) {
        ActionResponse.message = `${ActionResponse.message}\n\nТвоя команда: ${interest[0].name}`;
      } else {
        ActionResponse.message = `${ActionResponse.message}\n\nТвоя команда: не выбрано`;
      }
      ActionResponse.keyboard = {
        one_time: false,
        buttons: [
          [
            {
              action: {
                type: "text",
                payload: { TASK: "TALL" },
                label: `Посты [${countPosts}]`,
              },
              color: "positive",
            },
            {
              action: {
                type: "text",
                payload: { TASK: "TALLLIKES" },
                label: "Посты [списком]",
              },
              color: "positive",
            },
          ],
          [
            {
              action: {
                type: "text",
                payload: { TASK: "TADD" },
                label: "📝 Добавить",
              },
              color: "primary",
            },
          ],
          [
            {
              action: {
                type: "text",
                payload: { CHATBOT: "INFO" },
                label: "💡 Инфа",
              },
              color: "secondary",
            },
          ],
          [
            {
              action: {
                type: "text",
                payload: { CHATBOT: "POINTS" },
                label: "🔑 Key",
              },
              color: "secondary",
            },
          ],
        ],
      };
    } else {
      Group.connection = inputValues.configGroup.database;
      let interest = await Group.query()
        // @ts-ignore
        .where("id", "=", inputValues.currentUser.group_id);
      if (interest.length > 0) {
        ActionResponse.message = `${ActionResponse.message}\n\nТвоя команда: ${interest[0].name}`;
      } else {
        ActionResponse.message = `${ActionResponse.message}\n\nТвоя команда: не выбрано`;
      }
      ActionResponse.keyboard = {
        one_time: false,
        buttons: [
          [
            {
              action: {
                type: "text",
                payload: { TASK: "TALL" },
                label: `Посты [${countPosts}]`,
              },
              color: "positive",
            },
          ],
          [
            {
              action: {
                type: "text",
                payload: { TASK: "TADD" },
                label: "📝 Добавить",
              },
              color: "primary",
            },
          ],
          [
            {
              action: {
                type: "text",
                payload: { CHATBOT: "PROFILE" },
                label: "⚙ Настройки",
              },
              color: "primary",
            },
          ],
          [
            {
              action: {
                type: "text",
                payload: { SUPPORT: "START" },
                label: "📝 Чат",
              },
              color: "secondary",
            },
            {
              action: {
                type: "text",
                payload: { CHATBOT: "INFO" },
                label: "💡 Инфа",
              },
              color: "secondary",
            },
          ],
        ],
      };
    }
    return ActionResponse;
  }
  public static async getMainMessage(inputValues, transactionsByUserId) {
    const completedTransactions =
      HelpersController.filterTransactionByItemAndThisDay(
        transactionsByUserId,
        3
      );
    const lastCompletedTransactions = completedTransactions[0];
    const activePosts = HelpersController.filterTransactionByItemAndThisDay(
      transactionsByUserId,
      5
    );
    const lastActivePost = activePosts[0];
    // Если активных постов больше, чем максимально допустимо
    if (
      activePosts.length >= inputValues.configGroup.settings.max_active_post
    ) {
      let previousTime = lastActivePost.createdAt
        .setZone("Europe/Moscow")
        .setLocale("ru")
        .toFormat("d MMMM, t");
      // @ts-ignore
      let nextTimeTs =
        lastActivePost.createdAt.plus({
          hours: inputValues.configGroup.settings.hours_since_adding,
        }).ts - DateTime.local().ts;
      let nextTime = DateTime.local()
        .plus({ milliseconds: nextTimeTs })
        .setZone("Europe/Moscow")
        .setLocale("ru")
        .toFormat("d MMMM, t");
      return `☑ Статус добавления поста: Неактивный\nПредыдущий пост был добавлен ${previousTime} (МСК)\nТы сможешь добавить свой пост ${nextTime} (МСК)`;
    } else if (inputValues.configGroup.groupId === "342634654364") {
      return "✅ Статус: Активный";
    } else if (
      completedTransactions.length <
      inputValues.configGroup.settings.min_task_day
    ) {
      return `☑ Статус добавления поста: Неактивный\n📝Выполнено за ${inputValues.configGroup.settings.hours_since_adding} часа: ${completedTransactions.length} из ${inputValues.configGroup.settings.min_task_day}`;
    } else {
      let activeTime = lastCompletedTransactions.createdAt
        .plus({ hours: 24 })
        .setZone("Europe/Moscow")
        .setLocale("ru")
        .toFormat("d MMMM, t");
      return `✅ Статус: Активный\n📝Добавление активно до ${activeTime} (МСК)`;
    }
  }
  public static async getStatisticInfo(inputValues, transactionsByUserId) {
    let addedPosts = 0;
    let completedPosts = 0;
    let skippedPosts = 0;
    const UserInfo = await UsersInfoController.getInfoByUserId(inputValues);
    if (UserInfo) {
      addedPosts = UserInfo.added;
      completedPosts = UserInfo.completed;
      skippedPosts = UserInfo.skipped;
    }
    if (!["5432543254325"].includes(inputValues.configGroup.groupId)) {
      const userPoints = await this.getUserPoints(
        inputValues,
        transactionsByUserId
      );
      return `\n
        Общих баллов: ${inputValues.currentUser.points_all}
        Баллов за последние 24 часа:
          - Бот: ${userPoints.UserPointsForLastDay}
          - Автозачёт: ${userPoints.UserPointsForLastDayAuto}
          - Всего: ${userPoints.UserAllPoints}

        ➕ Добавлено: ${addedPosts}
        ✔ Оценено: ${completedPosts}
        ✖ Пропущено: ${skippedPosts}`;
    }
    return "";
  }
  public static async getUserPoints(inputValues, transactionsByUserId) {
    /* Количество баллов за последние 24 часа */
    let UserPointsForLastDay = 0;
    let UserPointsForLastDayAuto = 0;
    let LikesForLastDay;
    let CommentsForLastDay;
    let LikesForLastDayAuto;
    let CommentsForLastDayAuto;
    if (inputValues.configGroup.groupId === "32532523153215") {
      LikesForLastDay = HelpersController.filterTransactionByItemAndThisDay(
        transactionsByUserId,
        1,
        1
      );
      CommentsForLastDay = HelpersController.filterTransactionByItemAndThisDay(
        transactionsByUserId,
        2,
        1
      );
      LikesForLastDayAuto = HelpersController.filterTransactionByItemAndThisDay(
        transactionsByUserId,
        1,
        2
      );
      CommentsForLastDayAuto =
        HelpersController.filterTransactionByItemAndThisDay(
          transactionsByUserId,
          2,
          2
        );
    } else {
      LikesForLastDay = HelpersController.filterTransactionByItem(
        transactionsByUserId,
        1,
        1
      );
      CommentsForLastDay = HelpersController.filterTransactionByItem(
        transactionsByUserId,
        2,
        1
      );
      LikesForLastDayAuto = HelpersController.filterTransactionByItem(
        transactionsByUserId,
        1,
        2
      );
      CommentsForLastDayAuto = HelpersController.filterTransactionByItem(
        transactionsByUserId,
        2,
        2
      );
    }
    LikesForLastDay.forEach((transaction) => {
      if (transaction.data) {
        // @ts-ignore
        UserPointsForLastDay = UserPointsForLastDay + transaction.data.points;
      }
    });
    CommentsForLastDay.forEach((transaction) => {
      if (transaction.data) {
        // @ts-ignore
        UserPointsForLastDay = UserPointsForLastDay + transaction.data.points;
      }
    });
    LikesForLastDayAuto.forEach((transaction) => {
      if (transaction.data) {
        // @ts-ignore
        UserPointsForLastDayAuto =
          UserPointsForLastDayAuto + transaction.data.points;
      }
    });
    CommentsForLastDayAuto.forEach((transaction) => {
      if (transaction.data) {
        // @ts-ignore
        UserPointsForLastDayAuto =
          UserPointsForLastDayAuto + transaction.data.points;
      }
    });
    return {
      UserAllPoints: UserPointsForLastDay + UserPointsForLastDayAuto,
      UserPointsForLastDay,
      UserPointsForLastDayAuto,
    };
  }
}
