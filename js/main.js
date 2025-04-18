// 页面加载动画
document.addEventListener('DOMContentLoaded', function() {
    // 添加淡入动画类
    const animatedElements = document.querySelectorAll('.concept-card, .premium-card, .section-card, .related-card');
    animatedElements.forEach((element, index) => {
        element.classList.add('fade-in');
        element.classList.add(`delay-${(index % 5) + 1}`);
    });
    
    // 平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // 搜索功能
    const searchForm = document.querySelector('.search-box');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const searchInput = this.querySelector('input');
            const searchTerm = searchInput.value.trim();
            
            if (searchTerm) {
                // 这里可以添加实际的搜索逻辑
                alert(`搜索: ${searchTerm}`);
                // window.location.href = `/search?q=${encodeURIComponent(searchTerm)}`;
            }
        });
    }
    
    // 资源下载统计
    document.querySelectorAll('.resource-actions a, .premium-actions a').forEach(link => {
        if (link.textContent.includes('下载')) {
            link.addEventListener('click', function() {
                // 这里可以添加下载统计逻辑
                console.log(`资源下载: ${this.closest('.resource-card, .premium-card').querySelector('h4').textContent}`);
            });
        }
    });
    
    // 响应式导航菜单
    const mobileMenuToggle = document.createElement('div');
    mobileMenuToggle.className = 'mobile-menu-toggle';
    mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    document.body.appendChild(mobileMenuToggle);
    
    const mainNav = document.querySelector('.main-nav');
    mobileMenuToggle.addEventListener('click', function() {
        mainNav.classList.toggle('active');
        this.classList.toggle('active');
    });
    
    // 调整窗口大小时重新计算布局
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            mainNav.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
        }
    });
});
// 标签页切换功能
function openTab(evt, tabName) {
    const tabcontent = document.getElementsByClassName("tab-content");
    for (let i = 0; i < tabcontent.length; i++) {
        tabcontent[i].classList.remove("active");
    }
    
    const tabbuttons = document.getElementsByClassName("tab-btn");
    for (let i = 0; i < tabbuttons.length; i++) {
        tabbuttons[i].classList.remove("active");
    }
    
    document.getElementById(tabName).classList.add("active");
    evt.currentTarget.classList.add("active");
}
// 资源收藏功能
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.fa-star').forEach(star => {
        star.addEventListener('click', function(e) {
            e.preventDefault();
            this.classList.toggle('active');
            
            const resourceTitle = this.closest('.resource-card, .premium-card').querySelector('h4').textContent;
            if (this.classList.contains('active')) {
                console.log(`收藏资源: ${resourceTitle}`);
                // 这里可以添加实际的收藏逻辑
            } else {
                console.log(`取消收藏: ${resourceTitle}`);
                // 这里可以添加取消收藏的逻辑
            }
        });
    });
});
// 资源评分功能
function rateResource(rating, element) {
    const stars = element.parentElement.querySelectorAll('.fa-star');
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
    
    const resourceTitle = element.closest('.premium-card').querySelector('h3').textContent;
    console.log(`为资源 "${resourceTitle}" 评分: ${rating}星`);
    // 这里可以添加实际的评分提交逻辑
}