document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const submitButton = document.getElementById('submitBtn');

    // 密码显示/隐藏切换
    const togglePassword = document.querySelector('.toggle-password');
    if (togglePassword) {
        togglePassword.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    }

    // 表单验证函数
    function validateForm() {
        let isValid = true;
        const errors = [];

        // 邮箱验证
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value)) {
            errors.push('请输入有效的邮箱地址');
            isValid = false;
        }

        // 密码验证
        if (passwordInput.value.length < 8) {
            errors.push('密码至少需要8个字符');
            isValid = false;
        }

        return { isValid, errors };
    }

    // 显示错误信息
    function showErrors(errors) {
        const errorContainer = document.createElement('div');
        errorContainer.className = 'error-message';
        errorContainer.style.color = 'var(--error-color)';
        errorContainer.style.marginBottom = '15px';
        errorContainer.style.padding = '10px';
        errorContainer.style.backgroundColor = '#ffebee';
        errorContainer.style.borderRadius = '4px';

        errors.forEach(error => {
            const errorElement = document.createElement('p');
            errorElement.textContent = error;
            errorContainer.appendChild(errorElement);
        });

        // 移除旧的错误信息
        const oldError = document.querySelector('.error-message');
        if (oldError) {
            oldError.remove();
        }

        form.insertBefore(errorContainer, form.firstChild);
    }

    // 表单提交处理
    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        const { isValid, errors } = validateForm();

        if (!isValid) {
            showErrors(errors);
            return;
        }

        // 禁用提交按钮
        submitButton.disabled = true;
        submitButton.textContent = '登录中...';

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: emailInput.value,
                    password: passwordInput.value
                })
            });

            const data = await response.json();

            if (response.ok) {
                // 登录成功，保存token并跳转
                localStorage.setItem('token', data.token);
                window.location.href = '/index.html';
            } else {
                // 显示服务器返回的错误信息
                showErrors([data.message || '登录失败，请检查邮箱和密码']);
            }
        } catch (error) {
            showErrors(['网络错误，请稍后重试']);
        } finally {
            // 恢复提交按钮
            submitButton.disabled = false;
            submitButton.textContent = '登录';
        }
    });

    // 实时验证
    [emailInput, passwordInput].forEach(input => {
        input.addEventListener('input', function() {
            const { isValid, errors } = validateForm();
            if (!isValid) {
                showErrors(errors);
            } else {
                const errorMessage = document.querySelector('.error-message');
                if (errorMessage) {
                    errorMessage.remove();
                }
            }
        });
    });

    // 检查URL参数，显示注册成功的消息
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('registered') === 'true') {
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.style.color = 'var(--success-color)';
        successMessage.style.marginBottom = '15px';
        successMessage.style.padding = '10px';
        successMessage.style.backgroundColor = '#e8f5e9';
        successMessage.style.borderRadius = '4px';
        successMessage.textContent = '注册成功！请使用您的邮箱和密码登录。';
        form.insertBefore(successMessage, form.firstChild);
    }
}); 