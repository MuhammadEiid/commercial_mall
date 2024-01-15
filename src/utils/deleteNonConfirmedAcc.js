import schedule from "node-schedule";
import { userModel } from "../../Database/models/User.model.js";

export const deleteNonConfirmedUsers = () => {
  schedule.scheduleJob("0 * * */1 *", async function () {
    const dateNow = new Date().getTime();
    const users = await userModel.find();

    for (const user of users) {
      const createdDate = new Date(user.createdAt).getTime();
      const diffDay = (dateNow - createdDate) / (1000 * 60 * 60 * 24);
      // console.log(diffDay);
      if (user.verified == false && diffDay >= 30) {
        await userModel.findByIdAndDelete(user._id);
      }
    }
  });
};
