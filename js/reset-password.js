function simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i);
        hash |= 0;
    }
    return hash;
}

function resetPassword() {
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    let isValid = true;

    document.getElementById('password-error').style.display = 'none';
    document.getElementById('confirm-password-error').style.display = 'none';
    document.getElementById('reset-error').style.display = 'none';
    document.getElementById('reset-success').style.display = 'none';

    if (!password || password.length < 6) {
        document.getElementById('password-error').style.display = 'block';
        isValid = false;
    }
    if (password !== confirmPassword) {
        document.getElementById('confirm-password-error').style.display = 'block';
        isValid = false;
    }

    if (isValid) {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        const resetData = JSON.parse(localStorage.getItem('resetTokens')) || {};

        if (!token || resetData.token !== token || Date.now() > resetData.expires) {
            document.getElementById('reset-error').textContent = 'Invalid or expired reset token.';
            document.getElementById('reset-error').style.display = 'block';
        } else {
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const user = users.find(u => u.email === resetData.email);
            if (user) {
                user.password = simpleHash(password);
                localStorage.setItem('users', JSON.stringify(users));
                localStorage.removeItem('resetTokens');
                document.getElementById('reset-success').style.display = 'block';
                setTimeout(() => window.location.href = 'login.html', 1000);
            }
        }
    }
}