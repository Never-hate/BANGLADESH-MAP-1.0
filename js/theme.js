const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

themeToggle.addEventListener('click', () => {
    let theme = html.getAttribute('data-theme');
    let newTheme = theme === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', newTheme);
    themeToggle.innerText = newTheme === 'dark' ? '🌓' : '🌙';
});
