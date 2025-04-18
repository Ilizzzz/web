const Rating = require('../models/Rating');
const Resource = require('../models/Resource');

const createRating = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.resourceId);
    
    if (!resource) {
      return res.status(404).json({ error: '资源不存在' });
    }

    const rating = new Rating({
      user: req.user._id,
      resource: req.params.resourceId,
      score: req.body.score,
      comment: req.body.comment
    });

    await rating.save();
    await updateResourceAverageRating(req.params.resourceId);
    
    res.status(201).json(rating);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: '已经评价过此资源' });
    }
    res.status(500).json({ error: '创建评分失败' });
  }
};

const updateRating = async (req, res) => {
  try {
    const rating = await Rating.findOne({
      _id: req.params.ratingId,
      user: req.user._id
    });

    if (!rating) {
      return res.status(404).json({ error: '评分不存在或无权修改' });
    }

    rating.score = req.body.score;
    rating.comment = req.body.comment;
    await rating.save();
    
    await updateResourceAverageRating(rating.resource);
    
    res.json(rating);
  } catch (error) {
    res.status(500).json({ error: '更新评分失败' });
  }
};

const deleteRating = async (req, res) => {
  try {
    const rating = await Rating.findOneAndDelete({
      _id: req.params.ratingId,
      user: req.user._id
    });

    if (!rating) {
      return res.status(404).json({ error: '评分不存在或无权删除' });
    }

    await updateResourceAverageRating(rating.resource);
    
    res.json({ message: '评分已删除' });
  } catch (error) {
    res.status(500).json({ error: '删除评分失败' });
  }
};

const getResourceRatings = async (req, res) => {
  try {
    const ratings = await Rating.find({ resource: req.params.resourceId })
      .populate('user', 'username')
      .sort({ createdAt: -1 });

    res.json(ratings);
  } catch (error) {
    res.status(500).json({ error: '获取评分失败' });
  }
};

const getUserRatings = async (req, res) => {
  try {
    const ratings = await Rating.find({ user: req.user._id })
      .populate('resource', 'title description type category')
      .sort({ createdAt: -1 });

    res.json(ratings);
  } catch (error) {
    res.status(500).json({ error: '获取评分失败' });
  }
};

// Helper function to update resource's average rating
const updateResourceAverageRating = async (resourceId) => {
  const result = await Rating.aggregate([
    { $match: { resource: resourceId } },
    { $group: { _id: null, average: { $avg: '$score' }, count: { $sum: 1 } } }
  ]);

  const averageRating = result[0]?.average || 0;
  const ratingCount = result[0]?.count || 0;

  await Resource.findByIdAndUpdate(resourceId, {
    averageRating,
    ratingCount
  });
};

module.exports = {
  createRating,
  updateRating,
  deleteRating,
  getResourceRatings,
  getUserRatings
}; 