const Favorite = require('../models/Favorite');
const Resource = require('../models/Resource');

const addFavorite = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.resourceId);
    
    if (!resource) {
      return res.status(404).json({ error: '资源不存在' });
    }

    const favorite = new Favorite({
      user: req.user._id,
      resource: req.params.resourceId
    });

    await favorite.save();
    res.status(201).json({ message: '已添加到收藏' });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: '已经收藏过此资源' });
    }
    res.status(500).json({ error: '添加收藏失败' });
  }
};

const removeFavorite = async (req, res) => {
  try {
    const favorite = await Favorite.findOneAndDelete({
      user: req.user._id,
      resource: req.params.resourceId
    });

    if (!favorite) {
      return res.status(404).json({ error: '未找到收藏记录' });
    }

    res.json({ message: '已取消收藏' });
  } catch (error) {
    res.status(500).json({ error: '取消收藏失败' });
  }
};

const getFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find({ user: req.user._id })
      .populate({
        path: 'resource',
        select: 'title description type category concept fileUrl thumbnailUrl'
      })
      .sort({ createdAt: -1 });

    res.json(favorites);
  } catch (error) {
    res.status(500).json({ error: '获取收藏列表失败' });
  }
};

module.exports = {
  addFavorite,
  removeFavorite,
  getFavorites
}; 