// Animasi untuk ikon mata (untuk show/hide password)
const eyeIcon = document.querySelector('.eye-icon');
const passwordField = document.querySelector('input[type="password"]');

// Sembunyikan ikon mata secara default
eyeIcon.style.display = 'none'; 

// Event listener untuk menampilkan ikon mata saat ada input di password field
passwordField.addEventListener('input', () => {
    if (passwordField.value) {
        eyeIcon.style.display = 'block'; // Tampilkan ikon mata
    } else {
        eyeIcon.style.display = 'none'; // Sembunyikan ikon mata jika tidak ada input
    }
});

// Event listener untuk toggle password visibility
eyeIcon.addEventListener('click', () => {
    const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordField.setAttribute('type', type);
    eyeIcon.textContent = type === 'password' ? '🙈' : '👁️'; // Ganti ikon mata
});

// Fungsi login
const loginButton = document.getElementById('loginButton');
loginButton.addEventListener('click', function() {
    const usernameInput = document.getElementById('username').value;
    const passwordInput = document.getElementById('password').value;

    // Tentukan username dan password yang benar dalam array atau objek
    const validCredentials = [
        { username: 'admin', password: 'admin123' },
        { username: 'user1', password: 'user1234' },
        { username: 'tiara', password: 'mutiara' }
    ];

    // Cek apakah username dan password cocok dengan salah satu pasangan valid
    const isValid = validCredentials.some(credential => 
        credential.username === usernameInput && credential.password === passwordInput
    );

    // Jika valid, redirect ke halaman dashboard
    if (isValid) {
        window.location.href = 'dashboard.html';
    } else {
        // Jika salah, tampilkan pesan error
        document.getElementById('error-message').style.display = 'block';
    }
});
