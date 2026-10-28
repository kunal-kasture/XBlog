import Comment from '../models/Comment.js';
import Post from '../models/Post.js';

export const addComment = async (req, res, next) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: 'Comment text is required' });
    }

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comment = await Comment.create({
      text,
      post: post._id,
      author: req.user._id,
    });

    post.comments.push(comment._id);
    await post.save();

    const commentObj = comment.toObject();
    commentObj.post = comment.post.toString();
    commentObj.author = comment.author.toString();

    res.status(201).json(commentObj);
  } catch (error) {
    next(error);
  }
};

export const getCommentsByPost = async (req, res, next) => {
  try {
    const comments = await Comment.find({ post: req.params.id })
      .populate('author', '_id name email avatar')
      .sort({ createdAt: -1 });

    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    const post = await Post.findById(comment.post);
    const isCommentAuthor = comment.author.toString() === req.user._id.toString();
    const isPostAuthor = post && post.author.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isCommentAuthor && !isPostAuthor && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    if (post) {
      post.comments = post.comments.filter(
        (cId) => cId.toString() !== comment._id.toString()
      );
      await post.save();
    }

    await comment.deleteOne();

    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    next(error);
  }
};
