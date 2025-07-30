import axios from 'axios';

// Use your Laravel backend base URL
axios.defaults.baseURL = 'http://localhost:8000';
axios.defaults.withCredentials = true; // Required for Laravel session/cookie CSRF

// Get CSRF token from meta tag (Laravel Blade injects this)
const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

if (csrfToken) {
    axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;
} else {
    console.warn('⚠️ CSRF token not found in <meta> tag');
}

export default axios;
