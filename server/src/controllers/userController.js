import User from '../models/User.js';
import Post from '../models/Post.js';

export const getUserById = async (req, res, next) => {
  try {
    const userId = req.params.user_id === 'me' ? req.user?._id : req.params.user_id;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const postCount = await Post.countDocuments({ author: user._id });

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      postCount,
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const postCount = await Post.countDocuments({ author: user._id });

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      postCount,
    });
  } catch (error) {
    next(error);
  }
};

export const updateMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (req.body.name !== undefined) user.name = req.body.name;
    if (req.body.avatar !== undefined) user.avatar = req.body.avatar;
    if (req.body.email !== undefined) user.email = req.body.email.toLowerCase();
    if (req.body.password) user.password = req.body.password;

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      avatar: updatedUser.avatar,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyPosts = async (req, res, next) => {
  try {
    const posts = await Post.find({ author: req.user._id }).sort({ createdAt: -1 });

    const formattedPosts = posts.map((post) => {
      const postObj = post.toObject();
      return {
        ...postObj,
        commentCount: post.comments ? post.comments.length : 0,
      };
    });

    res.status(200).json(formattedPosts);
  } catch (error) {
    next(error);
  }
};
