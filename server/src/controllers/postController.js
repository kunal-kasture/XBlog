import Post from '../models/Post.js';
import Comment from '../models/Comment.js';

export const createPost = async (req, res, next) => {
  try {
    const { title, content, tags, image } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    let parsedTags = [];
    if (Array.isArray(tags)) {
      parsedTags = tags;
    } else if (typeof tags === 'string' && tags.trim()) {
      parsedTags = tags.split(',').map((t) => t.trim());
    }

    const post = await Post.create({
      title,
      content,
      tags: parsedTags,
      image: image || 'https://picsum.photos/seed/picsum/200/300',
      author: req.user._id,
      likes: [],
      comments: [],
    });

    const responsePost = post.toObject();
    responsePost.author = post.author.toString();

    res.status(201).json(responsePost);
  } catch (error) {
    next(error);
  }
};

export const getPostById = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).populate(
      'author',
      '_id name email avatar'
    );

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const currentUserId = req.user ? req.user._id.toString() : null;
    const likedByCurrentUser = currentUserId
      ? post.likes.some((likeId) => likeId.toString() === currentUserId)
      : false;

    const postObj = post.toObject();

    res.status(200).json({
      ...postObj,
      totalLikes: post.likes.length,
      likedByCurrentUser,
    });
  } catch (error) {
    next(error);
  }
};

export const updatePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (
      post.author.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ message: 'Not authorized to update this post' });
    }

    if (req.body.title !== undefined) post.title = req.body.title;
    if (req.body.content !== undefined) post.content = req.body.content;
    if (req.body.image !== undefined) post.image = req.body.image;
    if (req.body.tags !== undefined) {
      post.tags = Array.isArray(req.body.tags)
        ? req.body.tags
        : req.body.tags.split(',').map((t) => t.trim());
    }

    const updatedPost = await post.save();
    const responsePost = updatedPost.toObject();
    responsePost.author = updatedPost.author.toString();

    res.status(200).json(responsePost);
  } catch (error) {
    next(error);
  }
};

export const getAllPosts = async (req, res, next) => {
  try {
    const filter = {};

    if (req.query.search) {
      filter.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { content: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    if (req.query.tags) {
      const tagList = req.query.tags.split(',').map((t) => t.trim());
      filter.tags = { $in: tagList };
    } else if (req.query.tag) {
      filter.tags = req.query.tag;
    }

    const posts = await Post.find(filter)
      .populate('author', '_id name email avatar')
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
};

export const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (
      post.author.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    await Comment.deleteMany({ post: post._id });
    await post.deleteOne();

    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const likePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const userIdStr = req.user._id.toString();
    const likeIndex = post.likes.findIndex((id) => id.toString() === userIdStr);

    if (likeIndex > -1) {
      post.likes.splice(likeIndex, 1);
      await post.save();
      return res.status(200).json({
        message: 'Post unliked',
        totalLikes: post.likes.length,
      });
    } else {
      post.likes.push(req.user._id);
      await post.save();
      return res.status(200).json({
        message: 'Post liked',
        totalLikes: post.likes.length,
      });
    }
  } catch (error) {
    next(error);
  }
};
