import { userModel } from "../../../Database/models/User.model.js";
import { catchError } from "../../utils/catchError.js";
import * as handler from "../controllersHandler.js";

const getUserProfile = handler.getUserProfile(userModel, "User");
const updateUser = handler.updateProfile(userModel, "User");
const logout = handler.logout(userModel, "User");

const changePassword = handler.changePassword(userModel, "User");

const toggleLikeDislikeBlog = catchError(async (req, res, next) => {
  const { id } = req.params;

  const updateOperation = req.user.likedBlogs.includes(id)
    ? { $pull: { likedBlogs: id } }
    : { $addToSet: { likedBlogs: id } };

  await userModel.findByIdAndUpdate(req.user._id, updateOperation, {
    new: true,
  });

  const message = req.user.likedBlogs.includes(id)
    ? "Blog disliked successfully"
    : "Blog liked successfully";

  res.status(200).json({ message });
});

const toggleSaveUnsaveBlog = catchError(async (req, res, next) => {
  const { id } = req.params;

  const updateOperation = req.user.savedBlogs.includes(id)
    ? { $pull: { savedBlogs: id } }
    : { $addToSet: { savedBlogs: id } };

  await userModel.findByIdAndUpdate(req.user._id, updateOperation, {
    new: true,
  });

  const message = req.user.savedBlogs.includes(id)
    ? "Blog unsaved successfully"
    : "Blog saved successfully";

  res.status(200).json({ message });
});

const getSavedBlogs = handler.getUserSpecificItem(userModel, "savedBlogs");

const getLikedBlogs = handler.getUserSpecificItem(userModel, "likedBlogs");

export {
  toggleLikeDislikeBlog,
  toggleSaveUnsaveBlog,
  changePassword,
  logout,
  updateUser,
  getUserProfile,
  getSavedBlogs,
  getLikedBlogs,
};
