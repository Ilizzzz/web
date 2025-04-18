const Resource = require('../models/Resource');

const createResource = async (req, res) => {
  try {
    const resource = new Resource({
      ...req.body,
      uploader: req.user._id
    });
    await resource.save();
    res.status(201).json(resource);
  } catch (error) {
    res.status(500).json({ error: '创建资源失败' });
  }
};

const getResources = async (req, res) => {
  try {
    const { type, category, concept, isPremium, page = 1, limit = 10 } = req.query;
    const query = {};
    
    if (type) query.type = type;
    if (category) query.category = category;
    if (concept) query.concept = concept;
    if (isPremium !== undefined) query.isPremium = isPremium;

    const resources = await Resource.find(query)
      .populate('uploader', 'username')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Resource.countDocuments(query);

    res.json({
      resources,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ error: '获取资源列表失败' });
  }
};

const getResourceById = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id)
      .populate('uploader', 'username');
    
    if (!resource) {
      return res.status(404).json({ error: '资源不存在' });
    }

    // Increment view count
    resource.viewCount += 1;
    await resource.save();

    res.json(resource);
  } catch (error) {
    res.status(500).json({ error: '获取资源详情失败' });
  }
};

const updateResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    
    if (!resource) {
      return res.status(404).json({ error: '资源不存在' });
    }

    // Check if user is the uploader or admin
    if (resource.uploader.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: '没有权限修改此资源' });
    }

    const updates = Object.keys(req.body);
    const allowedUpdates = ['title', 'description', 'type', 'category', 'concept', 'tags', 'isPremium'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
      return res.status(400).json({ error: '无效的更新操作' });
    }

    updates.forEach(update => resource[update] = req.body[update]);
    await resource.save();

    res.json(resource);
  } catch (error) {
    res.status(500).json({ error: '更新资源失败' });
  }
};

const deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    
    if (!resource) {
      return res.status(404).json({ error: '资源不存在' });
    }

    // Check if user is the uploader or admin
    if (resource.uploader.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: '没有权限删除此资源' });
    }

    await resource.remove();
    res.json({ message: '资源已删除' });
  } catch (error) {
    res.status(500).json({ error: '删除资源失败' });
  }
};

const incrementDownloadCount = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    
    if (!resource) {
      return res.status(404).json({ error: '资源不存在' });
    }

    resource.downloadCount += 1;
    await resource.save();

    res.json({ downloadCount: resource.downloadCount });
  } catch (error) {
    res.status(500).json({ error: '更新下载次数失败' });
  }
};

module.exports = {
  createResource,
  getResources,
  getResourceById,
  updateResource,
  deleteResource,
  incrementDownloadCount
}; 