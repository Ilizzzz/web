const Comment = require('../models/Comment');

const createComment = async (req, res) => {
  try {
    const comment = new Comment({
      content: req.body.content,
      resource: req.params.resourceId,
      user: req.user._id,
      parentComment: req.body.parentComment
    });
    await comment.save();
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ error: '创建评论失败' });
  }
};

const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ resource: req.params.resourceId })
      .populate('user', 'username')
      .populate('parentComment')
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: '获取评论失败' });
  }
};

const updateComment = async (req, res) => {
  try {
    const comment = await Comment.findOne({
      _id: req.params.commentId,
      user: req.user._id
    });

    if (!comment) {
      return res.status(404).json({ error: '评论不存在或无权修改' });
    }

    comment.content = req.body.content;
    await comment.save();
    res.json(comment);
  } catch (error) {
    res.status(500).json({ error: '更新评论失败' });
  }
};

const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findOne({
      _id: req.params.commentId,
      user: req.user._id
    });

    if (!comment) {
      return res.status(404).json({ error: '评论不存在或无权删除' });
    }

    await comment.remove();
    res.json({ message: '评论已删除' });
  } catch (error) {
    res.status(500).json({ error: '删除评论失败' });
  }
};

const likeComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    
    if (!comment) {
      return res.status(404).json({ error: '评论不存在' });
    }

    const userId = req.user._id;
    const likeIndex = comment.likes.indexOf(userId);

    if (likeIndex === -1) {
      comment.likes.push(userId);
    } else {
      comment.likes.splice(likeIndex, 1);
    }

    await comment.save();
    res.json({ likes: comment.likes.length });
  } catch (error) {
    res.status(500).json({ error: '操作失败' });
  }
};

module.exports = {
  createComment,
  getComments,
  updateComment,
  deleteComment,
  likeComment
}; 