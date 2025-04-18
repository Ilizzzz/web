document.addEventListener('DOMContentLoaded', function() {
    const uploadForm = document.getElementById('upload-form');
    const fileInput = document.getElementById('resource-file');
    const previewContainer = document.getElementById('file-preview');
    const progressBar = document.querySelector('.progress-bar');
    
    // 文件类型和大小验证
    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        // 清除先前预览
        previewContainer.innerHTML = '';
        
        // 检查文件大小（限制为50MB）
        const maxSize = 50 * 1024 * 1024; // 50MB
        if (file.size > maxSize) {
            showError('文件大小不能超过50MB');
            fileInput.value = '';
            return;
        }
        
        // 根据文件类型显示预览
        const resourceType = document.getElementById('resource-type').value;
        
        if (resourceType === 'image' && file.type.startsWith('image/')) {
            // 图片预览
            const img = document.createElement('img');
            img.src = URL.createObjectURL(file);
            img.className = 'file-preview-image';
            previewContainer.appendChild(img);
        } else {
            // 其他文件类型显示文件名和大小
            const fileInfo = document.createElement('div');
            fileInfo.className = 'file-info';
            fileInfo.innerHTML = `
                <i class="fas fa-file"></i>
                <span>${file.name}</span>
                <span class="file-size">${formatFileSize(file.size)}</span>
            `;
            previewContainer.appendChild(fileInfo);
        }
        
        // 显示预览容器
        previewContainer.style.display = 'block';
    });
    
    // 表单提交处理
    uploadForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // 基本表单验证
        const title = document.getElementById('resource-title').value;
        const type = document.getElementById('resource-type').value;
        const file = fileInput.files[0];
        
        if (!title || !type || !file) {
            showError('请填写所有必填字段并上传文件');
            return;
        }
        
        // 模拟上传进度
        let progress = 0;
        const interval = setInterval(() => {
            progress += 5;
            progressBar.style.width = `${progress}%`;
            
            if (progress >= 100) {
                clearInterval(interval);
                // 模拟服务器响应延迟
                setTimeout(() => {
                    showSuccess('资源上传成功！');
                    resetForm();
                }, 500);
            }
        }, 200);
    });
    
    // 辅助函数
    function formatFileSize(bytes) {
        if (bytes < 1024) return bytes + ' B';
        else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
        else return (bytes / 1048576).toFixed(1) + ' MB';
    }
    
    function showError(message) {
        const alertBox = document.createElement('div');
        alertBox.className = 'alert alert-error';
        alertBox.textContent = message;
        
        const container = document.querySelector('.container');
        container.insertBefore(alertBox, uploadForm);
        
        setTimeout(() => {
            alertBox.remove();
        }, 5000);
    }
    
    function showSuccess(message) {
        const alertBox = document.createElement('div');
        alertBox.className = 'alert alert-success';
        alertBox.textContent = message;
        
        const container = document.querySelector('.container');
        container.insertBefore(alertBox, uploadForm);
        
        setTimeout(() => {
            alertBox.remove();
        }, 5000);
    }
    
    function resetForm() {
        uploadForm.reset();
        previewContainer.innerHTML = '';
        previewContainer.style.display = 'none';
        progressBar.style.width = '0%';
    }
}); 