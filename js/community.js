document.addEventListener('DOMContentLoaded', function() {
    const postForm = document.querySelector('.post-form');
    const postTextarea = postForm.querySelector('textarea');
    const postButton = postForm.querySelector('.btn-primary');
    const postsList = document.querySelector('.posts-list');

    // 检查用户登录状态
    function checkLoginStatus() {
        const token = localStorage.getItem('token');
        if (!token) {
            postForm.style.display = 'none';
            return false;
        }
        return true;
    }

    // 初始化页面
    function initPage() {
        if (!checkLoginStatus()) {
            return;
        }

        // 加载帖子列表
        loadPosts();
    }

    // 加载帖子列表
    async function loadPosts() {
        try {
            const response = await fetch('/api/community/posts', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.ok) {
                const posts = await response.json();
                renderPosts(posts);
            } else {
                throw new Error('加载帖子失败');
            }
        } catch (error) {
            console.error('Error loading posts:', error);
        }
    }

    // 渲染帖子列表
    function renderPosts(posts) {
        postsList.innerHTML = '';
        posts.forEach(post => {
            const postElement = createPostElement(post);
            postsList.appendChild(postElement);
        });
    }

    // 创建帖子元素
    function createPostElement(post) {
        const postCard = document.createElement('div');
        postCard.className = 'post-card';
        postCard.innerHTML = `
            <div class="post-header">
                <img src="${post.author.avatar}" alt="教师头像" class="post-avatar">
                <div class="post-info">
                    <span class="post-author">${post.author.name}</span>
                    <span class="post-time">${formatTime(post.createdAt)}</span>
                </div>
            </div>
            <div class="post-content">
                <h3>${post.title}</h3>
                <p>${post.content}</p>
            </div>
            <div class="post-actions">
                <button class="btn btn-outline like-btn" data-post-id="${post.id}">
                    <i class="far fa-thumbs-up"></i> 点赞 (${post.likes})
                </button>
                <button class="btn btn-outline comment-btn" data-post-id="${post.id}">
                    <i class="far fa-comment"></i> 评论 (${post.comments})
                </button>
                <button class="btn btn-outline share-btn" data-post-id="${post.id}">
                    <i class="fas fa-share"></i> 分享
                </button>
            </div>
        `;

        // 添加事件监听器
        const likeBtn = postCard.querySelector('.like-btn');
        const commentBtn = postCard.querySelector('.comment-btn');
        const shareBtn = postCard.querySelector('.share-btn');

        likeBtn.addEventListener('click', () => handleLike(post.id));
        commentBtn.addEventListener('click', () => handleComment(post.id));
        shareBtn.addEventListener('click', () => handleShare(post.id));

        return postCard;
    }

    // 处理点赞
    async function handleLike(postId) {
        try {
            const response = await fetch(`/api/community/posts/${postId}/like`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                updateLikeCount(postId, data.likes);
            }
        } catch (error) {
            console.error('Error liking post:', error);
        }
    }

    // 处理评论
    async function handleComment(postId) {
        const comment = prompt('请输入您的评论：');
        if (!comment) return;

        try {
            const response = await fetch(`/api/community/posts/${postId}/comments`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ content: comment })
            });

            if (response.ok) {
                const data = await response.json();
                updateCommentCount(postId, data.comments);
            }
        } catch (error) {
            console.error('Error commenting post:', error);
        }
    }

    // 处理分享
    function handleShare(postId) {
        const shareUrl = `${window.location.origin}/community/post/${postId}`;
        navigator.clipboard.writeText(shareUrl)
            .then(() => alert('链接已复制到剪贴板'))
            .catch(err => console.error('Error copying to clipboard:', err));
    }

    // 更新点赞数
    function updateLikeCount(postId, count) {
        const likeBtn = document.querySelector(`.like-btn[data-post-id="${postId}"]`);
        if (likeBtn) {
            likeBtn.innerHTML = `<i class="far fa-thumbs-up"></i> 点赞 (${count})`;
        }
    }

    // 更新评论数
    function updateCommentCount(postId, count) {
        const commentBtn = document.querySelector(`.comment-btn[data-post-id="${postId}"]`);
        if (commentBtn) {
            commentBtn.innerHTML = `<i class="far fa-comment"></i> 评论 (${count})`;
        }
    }

    // 格式化时间
    function formatTime(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;

        if (diff < 60000) { // 1分钟内
            return '刚刚';
        } else if (diff < 3600000) { // 1小时内
            return `${Math.floor(diff / 60000)}分钟前`;
        } else if (diff < 86400000) { // 1天内
            return `${Math.floor(diff / 3600000)}小时前`;
        } else {
            return date.toLocaleDateString();
        }
    }

    // 发布新帖子
    postButton.addEventListener('click', async function() {
        const content = postTextarea.value.trim();
        if (!content) {
            alert('请输入帖子内容');
            return;
        }

        try {
            const response = await fetch('/api/community/posts', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: content.substring(0, 30) + (content.length > 30 ? '...' : ''),
                    content: content
                })
            });

            if (response.ok) {
                postTextarea.value = '';
                loadPosts(); // 重新加载帖子列表
            } else {
                throw new Error('发布失败');
            }
        } catch (error) {
            console.error('Error creating post:', error);
            alert('发布失败，请重试');
        }
    });

    // 初始化页面
    initPage();
}); 