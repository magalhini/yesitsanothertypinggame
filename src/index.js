require('../styles/styles.css');

import Game from './App';
import words from './text';

document.querySelector('main').style.opacity = 1;

console.log('Hello! Type away ♥️ ✏️, friend.');

const game = new Game(words);
game.addEvents();

if (module.hot) {
  module.hot.accept();
}
