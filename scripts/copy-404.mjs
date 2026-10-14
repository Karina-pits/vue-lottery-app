// GitHub Pages не вміє віддавати index.html для "глибоких" адрес (/vue-lottery-app/users/5).
// Копія index.html як 404.html вирішує це: Pages віддає її, а vue-router сам відкриває потрібну сторінку.
import { copyFileSync } from 'node:fs';

copyFileSync('dist/index.html', 'dist/404.html');
console.log('dist/404.html created (SPA fallback for GitHub Pages)');
