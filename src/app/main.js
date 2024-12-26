import { setup, frame, win, onkey } from './game';
import { levels } from './maps/levels';
import { Utils } from './utils';
import { Menus } from './menus';
import { AuthForms } from './auth_forms';
import { AuthService } from './auth';

// Provide a fallback for older browsers that don't support requestAnimationFrame
if (!window.requestAnimationFrame) {
  window.requestAnimationFrame =
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    ((callback) => setTimeout(callback, 1000 / 60));
}

const INTRO_DELAY = 4000;
const PRELEVEL_DELAY = 3900;
const END_SCREEN_DELAY = 700;
const GAME_OVER_DELAY = 700;
const END_GAME_DELAY = 7000;

let life = 3;
let currentLvl = 0;
let inProgress = false;

/**
 * Initializes the game by checking authentication and showing the start screen.
 */
export function init() {
  const user = localStorage.getItem('user');
  if (!user) {
    AuthForms.showLogin();
    return;
  }
  Menus.addEndScreen();
  Menus.startScreen();
}

/**
 * Handles the initial play interaction.
 */
function playActive() {
  Menus.removeText('playButton');
  Menus.removeText('titleText');
  Menus.removeText('madeByText');
  showIntro();
}

/**
 * Shows the initial intro, then transitions to the pre-level screen.
 */
function showIntro() {
  inProgress = true;
  Menus.showIntroScreen();
  setTimeout(() => {
    Menus.removeText('row1');
    Menus.removeText('row2');
    Menus.removeText('row3');
    showPreLevelScreen();
  }, INTRO_DELAY);
}

/**
 * Starts the game from the first level.
 */
function startGame() {
  Menus.showCanvas();
  life = 3;
  setup(levels[currentLvl]);
  Menus.removeEndScreen();
}

/**
 * Shows the "Level X" screen, then starts the level.
 */
function showPreLevelScreen() {
  Menus.showPreLevel(currentLvl + 1);
  setTimeout(() => {
    Menus.removeText('levelNo');
    if (currentLvl === 0) {
      startGame();
    } else {
      startNextLvl();
    }
  }, PRELEVEL_DELAY);
}

/**
 * Starts the current level.
 */
function startNextLvl() {
  setup(levels[currentLvl]);
}

/**
 * Handles finishing the current level.
 */
function finishCurrentLvl() {
  Menus.addEndScreen();
  if (currentLvl === levels.length - 1) {
    finishedLastLevel();
    return;
  }
  currentLvl++;
  setTimeout(() => {
    showPreLevelScreen();
    setTimeout(() => {
      Menus.removeEndScreen();
    }, INTRO_DELAY);
  }, END_SCREEN_DELAY);
}

/**
 * Handles game over logic, resetting to level 0.
 */
function finishGameOver() {
  currentLvl = 0;
  Menus.addEndScreen();
  setTimeout(() => {
    Menus.gameOver();
    setTimeout(() => {
      Menus.removeText('gameOver');
      inProgress = false;
      init();
    }, INTRO_DELAY);
  }, GAME_OVER_DELAY);
}

/**
 * Handles finishing the last level.
 */
function finishedLastLevel() {
  currentLvl = 0;
  setTimeout(() => {
    Menus.endGame();
    setTimeout(() => {
      Menus.removeText('endGameTitle');
      Menus.removeText('endGameSubtitle');
      Menus.removeText('madeByText');
      inProgress = false;
      init();
    }, END_GAME_DELAY);
  }, END_SCREEN_DELAY);
}

/**
 * Resets the current map, decrementing life.
 */
function resetCurrentMap() {
  life--;
  setup(levels[currentLvl]);
}

// Initialize and run the main loop
init();
frame();

// Input listeners
document.addEventListener('keydown', (ev) => {
  if (ev.code === 'Space' && !inProgress) {
    playActive();
    return;
  }
  onkey(ev, ev.keyCode, true);
});

document.addEventListener('keyup', (ev) => {
  if (ev.code === 'Space' && !inProgress) return;
  onkey(ev, ev.keyCode, false);
});

export { resetCurrentMap, finishCurrentLvl, finishGameOver, life };