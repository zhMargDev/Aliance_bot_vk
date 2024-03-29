import * as configGroups from "App/Bot/Sources/vk/groups.json";
import PostsController from "App/Controllers/Http/Bot/PostsController";
import VkApiController from "App/Controllers/Http/Bot/Api/VkApiController";
import UsersController from "App/Controllers/Http/Bot/UsersController";
import CompleteTaskAction from "App/Controllers/Http/Bot/Modules/Task/Actions/CompleteTaskAction";
import TransactionsController from "App/Controllers/Http/Bot/TransactionsController";
import BufferTransactionsController from "App/Controllers/Http/Bot/BufferTransactionsController";
import UsersInfoController from "App/Controllers/Http/Bot/UsersInfoController";
import PostsStatisticsController from "App/Controllers/Http/Bot/PostsStatisticsController";

export default class AutoCompleteController {
  public async index(): Promise<any> {
    let requests = [];
    for (let key in configGroups) {
      const configGroup = configGroups[key];
      console.log(configGroup.database);
      if (configGroup.database !== "tenant_nautilus") {
        continue;
      }
      const inputValues = {
        peerId: 1111111111111111111,
        configGroup: configGroup,
      };
      const postsForAutoComplete =
        await PostsController.getPostsForAutoComplete(inputValues);
      const activitesUsersAll =
        await BufferTransactionsController.getByActionAll(inputValues, 3);
      const activitesLikes = await BufferTransactionsController.getByActionAll(
        inputValues,
        1
      );
      const activitesComments =
        await BufferTransactionsController.getByActionAll(inputValues, 2);
      /*console.time('FinishTestTime')
      let transactionsByPostIdCompleted = await BufferTransactionsController.getByPostIdAndAction(inputValues, 754, 3)
      console.timeEnd('FinishTestTime')*/
      // eslint-disable-next-line no-inner-declarations
      function Collection(items) {
        this.items = items;
      }
      Collection.prototype.query = function (whereClause) {
        return this.items.filter(function (item) {
          for (var key in whereClause) {
            if (item[key] !== whereClause[key]) {
              return false;
            }
          }
          return true;
        });
      };
      let colActivitesCompleted = activitesUsersAll.map((item) => {
        return item.serialize();
      });
      let colActivitesLikes = activitesLikes.map((item) => {
        return item.serialize();
      });
      let colActivitesComments = activitesComments.map((item) => {
        return item.serialize();
      });
      const collectionCompleted = new Collection(colActivitesCompleted);
      const collectionLikes = new Collection(colActivitesLikes);
      const collectionComments = new Collection(colActivitesComments);
      for (let i = 0; i <= postsForAutoComplete.length; i++) {
        if (i > 1000) {
          if (!(i % 7) || i === postsForAutoComplete.length) {
            const data = {
              inputValues: inputValues,
              postsForAutoComplete: postsForAutoComplete.slice(
                i,
                i + 6 <= postsForAutoComplete.length
                  ? i + 6
                  : postsForAutoComplete.length
              ),
              i: i,
              ii:
                i + 6 <= postsForAutoComplete.length
                  ? i + 6
                  : postsForAutoComplete.length,
            };
            // @ts-ignore
            //requests.push(this.axiosForPromise(data))
            const mypromise = new Promise((resolve, reject) => {
              console.log(555);
              //this.axiosForPromise(data)
              this.init(
                data,
                collectionCompleted,
                collectionLikes,
                collectionComments
              );
              console.log(666);
            });
            // @ts-ignore
            requests.push(mypromise);
            await VkApiController.delay(100, 100);
          }
          if (!(i % 50) || i === postsForAutoComplete.length) {
            console.log("i: " + i);
            Promise.all(requests).then((values) => {
              console.log(values);
            });
            console.log(111112222);
            await VkApiController.delay(400000, 400000);
            requests = [];
          }
        }
      }
    }
    return true;
  }
  /*public async axiosForPromise (data) {
    return axios.post('http://localhost:3000/api/v1/autocompleted/init/', data)
  }*/
  //public async init ({ request }: HttpContextContract) {
  public async init(
    data,
    collectionCompleted,
    collectionLikes,
    collectionComments
  ) {
    const requestAll = data;
    let allUsers;
    let allUsersIds = [];
    allUsers = await UsersController.getUserAll(requestAll.inputValues);
    for (let user of allUsers) {
      // @ts-ignore
      allUsersIds.push(user.user_id);
    }
    let i = 0;
    let postsArray = [];
    let postsByVK = {
      count: 0,
    };
    for (const post of requestAll.postsForAutoComplete) {
      for (let user of allUsers) {
        if (post.user_id === user.user_id) {
          requestAll.inputValues.peerId = user.user_id;
        }
      }
      // @ts-ignore
      postsArray.push([
        post.id,
        post.owner_id,
        post.post_id,
        `${post.owner_id}_${post.post_id}`,
      ]);
      i++;
      console.log(`${post.id}: ${post.owner_id}_${post.post_id}`);
      if (!(i % 7) || i === requestAll.postsForAutoComplete.length) {
        postsByVK = await this.getCommentsAndLikesPost(
          requestAll.inputValues,
          postsArray
        );
        // @ts-ignore
        if (postsByVK.count > 0) {
          // @ts-ignore
          for (const item of postsByVK.items) {
            await PostsStatisticsController.setPostStatistic(
              requestAll.inputValues,
              item
            );
            for (const userId of allUsersIds) {
              if (item.postInfo && item.postInfo.length === 0) {
                continue;
              }
              if (userId === item.postInfo[0].from_id) {
                continue;
              }
              requestAll.inputValues.peerId = userId;
              await this.addPoints(
                requestAll.inputValues,
                item,
                collectionCompleted,
                collectionLikes,
                collectionComments,
                requestAll.i
              );
            }
          }
        }
        postsArray = [];
      }
    }
    return configGroups;
  }
  public async getCommentsAndLikesPost(inputValues, postsArray) {
    const code = `
          var posts = ${JSON.stringify(postsArray)};
              if(posts == null){
                return {"count": 0, "items": []};
              }
              var items = [];
              var i = 0;
              while(i < posts.length) {
                items = items + [
                  {
                    "postId": posts[i][0],
                    "post": [posts[i][1], posts[i][2]],
                    "postInfo": API.wall.getById({"posts": posts[i][3]}),
                    "likes": API.likes.getList({"type": "post", "owner_id": posts[i][1], "item_id": posts[i][2]})["items"],
                    "comments": API.wall.getComments({"owner_id": posts[i][1], "post_id": posts[i][2], "offset": 0, "count": 100})["items"]
                  }
                ];
                i = i + 1;
              }
            return {"count": items.length, "items": items};
          `;
    //await VkApiController.delay(100, 100)
    return await VkApiController.executeGetLikesAndComments(inputValues, code);
  }
  public static async getCommentsAndLikesPost(inputValues, postsArray) {
    await VkApiController.delay(100, 100);
    const code = `
          var posts = ${JSON.stringify(postsArray)};
              if(posts == null){
                return {"count": 0, "items": []};
              }
              var items = [];
              var i = 0;
              while(i < posts.length) {
                items = items + [
                  {
                    "postId": posts[i][0],
                    "post": [posts[i][1], posts[i][2]],
                    "postInfo": API.wall.getById({"posts": posts[i][3]}),
                    "likes": API.likes.getList({"type": "post", "owner_id": posts[i][1], "item_id": posts[i][2]})["items"],
                    "comments": API.wall.getComments({"owner_id": posts[i][1], "post_id": posts[i][2], "offset": 0, "count": 100})["items"]
                  }
                ];
                i = i + 1;
              }
            return {"count": items.length, "items": items};
          `;
    return await VkApiController.executeGetLikesAndComments(inputValues, code);
  }
  public async addPoints(
    inputValues,
    item,
    collectionCompleted,
    collectionLikes,
    collectionComments,
    i
  ) {
    let pointsForLike = 0;
    let pointsForComments = 0;
    let pointsForCommentsNew = 0;
    if (item.likes && item.likes.includes(inputValues.peerId)) {
      pointsForLike = 3;
    }
    if (item.comments) {
      for (const comment of item.comments) {
        if (comment.from_id === inputValues.peerId) {
          pointsForCommentsNew = await CompleteTaskAction.getPointsForText(
            0,
            comment.text
          );
          if (pointsForCommentsNew > pointsForComments) {
            pointsForComments = pointsForCommentsNew;
          }
        }
      }
    }
    let allPoints = pointsForLike + pointsForComments;
    //console.log(`allPoints: ${allPoints}`)
    if (allPoints > 0) {
      //let transactionsByPostIdCompleted = await BufferTransactionsController.getByPostIdAndAction(inputValues, item.postId, 3)
      const checkCompletedTask = collectionCompleted.query({
        user_id: inputValues.peerId,
        post_id: item.postId,
      });
      //console.log(transactionsByPostIdCompleted)
      console.log(checkCompletedTask.length);
      if (checkCompletedTask.length === 0) {
        console.log("iii: " + i);
        console.log(`post_id: ${item.postId}`);
        console.log(`go: ${allPoints}`);
        await TransactionsController.store(inputValues, item.postId, 3, 2);
        await BufferTransactionsController.store(
          inputValues,
          item.postId,
          3,
          2
        );
        //let transactionsByPostIdLike = await BufferTransactionsController.getByPostIdAndAction(inputValues, item.postId, 1)
        const transactionsByPostIdLike = collectionLikes.query({
          user_id: inputValues.peerId,
          post_id: item.postId,
        });
        if (pointsForLike > 0 && transactionsByPostIdLike.length === 0) {
          await PostsStatisticsController.setIncrementValue(
            inputValues,
            item.postId,
            "bot_auto_likes_count"
          );
          await TransactionsController.store(inputValues, item.postId, 1, 2, {
            points: pointsForLike,
          });
          await BufferTransactionsController.store(
            inputValues,
            item.postId,
            1,
            2,
            { points: pointsForLike }
          );
        }
        //let transactionsByPostIdComment = await BufferTransactionsController.getByPostIdAndAction(inputValues, item.postId, 2)
        let transactionsByPostIdComment = collectionComments.query({
          user_id: inputValues.peerId,
          post_id: item.postId,
        });
        if (pointsForComments > 0 && transactionsByPostIdComment.length === 0) {
          await PostsStatisticsController.setIncrementValue(
            inputValues,
            item.postId,
            "bot_auto_comments_count"
          );
          await TransactionsController.store(inputValues, item.postId, 2, 2, {
            points: pointsForComments,
          });
          await BufferTransactionsController.store(
            inputValues,
            item.postId,
            2,
            2,
            { points: pointsForComments }
          );
        }
        await PostsStatisticsController.setIncrementValue(
          inputValues,
          item.postId,
          "auto_completed"
        );
        await UsersInfoController.changeValue(inputValues, "auto_completed");
        await UsersController.changePointsAll(inputValues, allPoints);
        return true;
      }
    }
    return false;
  }
  public static async addPoints(inputValues, item) {
    let pointsForLike = 0;
    let pointsForComments = 0;
    let pointsForCommentsNew = 0;
    if (item.likes && item.likes.includes(inputValues.peerId)) {
      pointsForLike = 3;
    }
    if (item.comments) {
      for (const comment of item.comments) {
        if (comment.from_id === inputValues.peerId) {
          pointsForCommentsNew = await CompleteTaskAction.getPointsForText(
            0,
            comment.text
          );
          if (pointsForCommentsNew > pointsForComments) {
            pointsForComments = pointsForCommentsNew;
          }
        }
      }
    }
    let allPoints = pointsForLike + pointsForComments;
    //console.log(`allPoints: ${allPoints}`)
    if (allPoints > 0) {
      let transactionsByPostIdCompleted =
        await BufferTransactionsController.getByPostIdAndAction(
          inputValues,
          item.postId,
          3
        );
      if (transactionsByPostIdCompleted === null) {
        console.log(`go: ${allPoints}`);
        await TransactionsController.store(inputValues, item.postId, 3, 2);
        await BufferTransactionsController.store(
          inputValues,
          item.postId,
          3,
          2
        );
        let transactionsByPostIdLike =
          await BufferTransactionsController.getByPostIdAndAction(
            inputValues,
            item.postId,
            1
          );
        if (pointsForLike > 0 && !transactionsByPostIdLike) {
          await PostsStatisticsController.setIncrementValue(
            inputValues,
            item.postId,
            "bot_auto_likes_count"
          );
          await TransactionsController.store(inputValues, item.postId, 1, 2, {
            points: pointsForLike,
          });
          await BufferTransactionsController.store(
            inputValues,
            item.postId,
            1,
            2,
            { points: pointsForLike }
          );
        }
        let transactionsByPostIdComment =
          await BufferTransactionsController.getByPostIdAndAction(
            inputValues,
            item.postId,
            2
          );
        if (pointsForComments > 0 && !transactionsByPostIdComment) {
          await PostsStatisticsController.setIncrementValue(
            inputValues,
            item.postId,
            "bot_auto_comments_count"
          );
          await TransactionsController.store(inputValues, item.postId, 2, 2, {
            points: pointsForComments,
          });
          await BufferTransactionsController.store(
            inputValues,
            item.postId,
            2,
            2,
            { points: pointsForComments }
          );
        }
        await PostsStatisticsController.setIncrementValue(
          inputValues,
          item.postId,
          "auto_completed"
        );
        await UsersInfoController.changeValue(inputValues, "auto_completed");
        await UsersController.changePointsAll(inputValues, allPoints);
        return true;
      }
    }
    return false;
  }

  public static async addPointsForList(inputValues, item) {
    let pointsForLike = 0;
    let pointsForComments = 0;
    let pointsForCommentsNew = 0;
    if (item.likes && item.likes.includes(inputValues.peerId)) {
      pointsForLike = 3;
    }
    if (item.comments) {
      for (const comment of item.comments) {
        if (comment.from_id === inputValues.peerId) {
          pointsForCommentsNew = await CompleteTaskAction.getPointsForText(
            0,
            comment.text
          );
          if (pointsForCommentsNew > pointsForComments) {
            pointsForComments = pointsForCommentsNew;
          }
        }
      }
    }
    let allPoints = pointsForLike + pointsForComments;
    if (allPoints > 0) {
      let transactionsByPostIdCompleted =
        await BufferTransactionsController.getByPostIdAndAction(
          inputValues,
          item.postId,
          3
        );
      if (transactionsByPostIdCompleted === null) {
        await TransactionsController.store(inputValues, item.postId, 3, 1);
        await BufferTransactionsController.store(
          inputValues,
          item.postId,
          3,
          1
        );
        let transactionsByPostIdLike =
          await BufferTransactionsController.getByPostIdAndAction(
            inputValues,
            item.postId,
            1
          );
        if (pointsForLike > 0 && !transactionsByPostIdLike) {
          await PostsStatisticsController.setIncrementValue(
            inputValues,
            item.postId,
            "bot_likes_count"
          );
          await TransactionsController.store(inputValues, item.postId, 1, 1, {
            points: pointsForLike,
          });
          await BufferTransactionsController.store(
            inputValues,
            item.postId,
            1,
            1,
            { points: pointsForLike }
          );
        }
        let transactionsByPostIdComment =
          await BufferTransactionsController.getByPostIdAndAction(
            inputValues,
            item.postId,
            2
          );
        if (pointsForComments > 0 && !transactionsByPostIdComment) {
          await PostsStatisticsController.setIncrementValue(
            inputValues,
            item.postId,
            "bot_comments_count"
          );
          await TransactionsController.store(inputValues, item.postId, 2, 1, {
            points: pointsForComments,
          });
          await BufferTransactionsController.store(
            inputValues,
            item.postId,
            2,
            1,
            { points: pointsForComments }
          );
        }
        await PostsStatisticsController.setIncrementValue(
          inputValues,
          item.postId,
          "completed"
        );
        await UsersInfoController.changeValue(inputValues, "completed");
        await UsersController.changePointsAll(inputValues, allPoints);
      }
    } else {
      await TransactionsController.store(inputValues, item.postId, 4, 2);
      await BufferTransactionsController.store(inputValues, item.postId, 4, 2);
    }
    return allPoints;
  }
}
