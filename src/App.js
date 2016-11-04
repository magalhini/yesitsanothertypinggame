import $ from 'jquery';
import {
  calculateWpm,
  calculateCharsTyped,
  calculateScore
} from './helpers';

const UIElements = {
  scoreValue: $('.score__value'),
  writeInput: $('#currentWord'),
  aboutButton: $('#about'),
  currentWordDisplay: $('#currentWordDisplay'),
  startButton: $('#start'),
  playAbout: $('#play-now'),
  timeLeft: $('.timeleft__value'),
  playAreaScore: $('.playarea__score'),
  playAreaTime: $('.playarea__timeleft'),
  playAgain: $('.play-again'),
  wpmScore: $('.game__wpm'),
  gameScore: $('.game__score'),
  shareScore: $('#twitter-share')
};

const COOL_OFF_PERIOD = 820;

const initialGameOpts = {
  right: 0,
  wrong: 0,
  position: 0,
  gameStarted: false,
  gameFinished: false,
  timer: null,
  secondsLeft: 50,
  coolOff: false,
  elapsedTime: 0
};

export default class Game {
  constructor(words) {

    this._areas = {
      welcome: $('.welcome-screen'),
      playArea: $('.playarea'),
      gameOver: $('.game-over'),
      about: $('.about-screen')
    };

    this.startGame = this.startGame.bind(this);
    this.restartGame = this.restartGame.bind(this);
    this.showAbout = this.showAbout.bind(this);
    this._onKeyPressed = this._onKeyPressed.bind(this);

    this._ui = UIElements;
    this._words = words;
    this.resetSettings();
  }

  addEvents() {
    this._ui.startButton.on('click', this.startGame);
    this._ui.playAbout.on('click', this.startGame);
    this._ui.playAgain.on('click', this.restartGame);
    this._ui.aboutButton.on('click', this.showAbout);
    this._areas.welcome.fadeIn();
  }

  showAbout() {
    this.showGameArea('about');
  }

  /**
   * Return the active word.
   * @string
   */
  getCurrentWord(position = 0) {
    return this._words[position];
  }

  showCurrentWord(position = 0) {
    this._ui.currentWordDisplay.text(
      this.getCurrentWord(position)
    );
  }

  startGame() {
    this._areas.about.slideUp();
    this._areas.welcome.fadeOut(() => this.showGameArea('playArea'));
    // Hilitor only accepts an ID value
    this._highlighter = new Hilitor2(this._ui.currentWordDisplay[0].id);
    this._highlighter.setMatchType('left');

    this._ui.writeInput.on('keyup', this._onKeyPressed);
    this.showCurrentWord();
  }

  restartGame() {
    this.showGameArea('welcome');
    this.resetSettings();
  }

  showGameArea(area) {
    switch (area) {
      case 'playArea':
      this._areas.playArea.fadeIn();
      this._ui.playAreaScore.addClass('a-fade-and-move');
      this._ui.playAreaTime.addClass('a-fade-and-move');
      this._ui.currentWordDisplay.addClass('a-fade-and-move-right a-delay-1-second');
      this._ui.writeInput.addClass('a-fade-and-move-up a-delay-1-second');
      this._ui.writeInput.focus();
      break;

      case 'gameOver':
      return this._areas.playArea.fadeOut('slow', () => this._areas.gameOver.fadeIn());

      case 'welcome':
      return this._areas.gameOver.fadeOut(() => this._areas.welcome.fadeIn());

      case 'about':
      return this._areas.welcome.fadeOut('slow', () => this._areas.about.fadeIn());
    }
  }

  /**
   * Mark a type mistake. Add a class to indicate an error,
   * and after a while jump to the next word.
   */
  markMistake() {
    // Cool off period to prevent several mistakes in a row.
    if (!this._game.coolOff) {
      this._game.coolOff = true;
      this._game.wrong += 1;
      this._game.secondsLeft -= 1;
      this._ui.currentWordDisplay.addClass('has-mistake a-shake');
      this._ui.timeLeft.addClass('has-mistake');

      // After a while, remove the mistake mark, disable cool off period.
      setTimeout(() => {
        this._ui.currentWordDisplay.removeClass('has-mistake a-shake');
        this._ui.timeLeft.removeClass('has-mistake');
        this.jumpToNextWord();
        this._game.coolOff = false;
      }, COOL_OFF_PERIOD);

    }
  }

  _startTimer() {
    this._game.timer = setInterval(() => {
      this._game.secondsLeft -= 1;
      this._game.elapsedTime += 1;

      const { secondsLeft } = this._game;

      this.updateScores('time');

      if (secondsLeft <= 0) this.endGame();
    }, 1000);
  }

  endGame() {
    clearInterval(this._game.timer);
    this._ui.writeInput.off('keyup', this._onKeyPressed);
    this._game.gameStarted = false;
    this._highlighter = null;
    this.showGameOver();
  }

  /**
   * Display game over screen and update the scores.
   */
  showGameOver() {
    this.showGameArea('gameOver');
    this._clearInput();

    const charsTyped = calculateCharsTyped(this._words, this._game.position);
    const WPM = calculateWpm(charsTyped, this._game.elapsedTime);
    const score = calculateScore(WPM, this._game.right, this._game.wrong);
    const tweetURL = `I scored ${score} points on Yes Another Typing Game. Here: `;

    this._ui.wpmScore[0].innerHTML = WPM;
    this._ui.gameScore[0].innerHTML = score;

    // Remove previous instances buttons, if any
    $('#twitter-share').children().remove();

    twttr.widgets.createShareButton(
      'http://ricardofilipe.com/yesanothertypinggame', document.getElementById('twitter-share'), { text: tweetURL }
    );

  }

  // Reset scores, mistakes, time, etc
  resetSettings() {
    this._game = Object.assign({}, initialGameOpts);
  }

  _onKeyPressed(e) {
    const { value } = e.target;
    const { position } = this._game;
    const currentWord = this.getCurrentWord(position);

    // Only start the game when the user types
    if (!this._game.gameStarted) {

      this._areas.playArea.addClass('has-started');
      this._ui.currentWordDisplay
        .removeClass('a-fade-and-move-right a-delay-1-second')
        .css('opacity', 1);

      this._startTimer();
      this._game.gameStarted = true;
      this._ui.writeInput.attr('placeholder', 'Type the word above');
    }

    // Apply highlighter class as we type
    this._highlighter.apply(value);
    // Check for typing mistakes
    this.validateNextChar(value, currentWord);
    // Get current word, send it to be compared with what is typed
    this.confirmWord(currentWord, value);
  }

  // Next word: gain a second, level up the word
  increaseLevel() {
    this._game.secondsLeft += 1;
    return this._game.position += 1;
  }

  /**
   * Show the next word on the list.
   */
  jumpToNextWord() {
    const nextPosition = this.increaseLevel();

    this._clearInput();
    this.showCurrentWord(nextPosition);
  }

  /**
   * Confirm the typed word equals the current one
   */
  confirmWord(currentWord, typedWord) {
    if (currentWord === typedWord) {
      this._game.right += 1;
      this.updateScores('score');
      this.jumpToNextWord();
    }
  }

  /**
   * Validate the next character of the word.
   * Mark as an error if it doesn't match
   */
  validateNextChar(currentValue, currentWord) {
    const typedTotal = currentValue.length;

    // Is there a next word?
    if (this._game.position === this._words.length) {
      return this.endGame();
    } else {
      // Check for typos by comparing with next char
      if (currentValue[typedTotal - 1] !== currentWord[typedTotal - 1]) {
        this.markMistake();
      }
    }
  }

  /**
   * Update the UI values
   */
  updateScores(section) {
    if (section === 'score') {
      this._ui.scoreValue.text(this._game.right);
    } else if (section === 'time') {
      let time = this._game.secondsLeft >= 0 ? this._game.secondsLeft : 0;
      this._ui.timeLeft.text(time);
    }
  }

  /**
   * Clear the type input
   */
  _clearInput() {
    this._ui.writeInput.val('');
  }
}
