function toggleTheme() {
    console.log('Toggle theme called');
    document.body.classList.toggle('light');
    localStorage.setItem('theme', document.body.classList.contains('light') ? 'light' : 'dark');
}

// On page load, set theme from localStorage
window.onload = function() {
    console.log('Page loaded, checking theme');
    if (localStorage.getItem('theme') === 'light') {
        document.body.classList.add('light');
    }
};
