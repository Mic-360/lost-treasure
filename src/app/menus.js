import { TextGen } from './text_gen';

// Cache commonly accessed elements
const menusEl = document.getElementById('menus');
const gameEl = document.getElementById('game');

const Menus = {
  startScreen: () => {
    const play = TextGen.generateWord('press space to play');
    TextGen.button(play, 'playButton');

    const title = TextGen.generateWord('lost treasure');
    TextGen.titleText(title);

    const madeBy = TextGen.generateWord('by bhaumic');
    TextGen.madeByText(madeBy);
  },
  showIntroScreen: () => {
    const row1 = TextGen.generateWord('many years ago');
    TextGen.introText(row1, 'top', 190, 'row1');

    const row2 = TextGen.generateWord('flo lost his gems');
    TextGen.introText(row2, 'middle', 235, 'row2');

    const row3 = TextGen.generateWord('help him to get them back');
    TextGen.introText(row3, 'bottom', 335, 'row3');
  },
  showPreLevel: (lvl) => {
    const level = TextGen.generateWord(`level ${lvl}`);
    TextGen.text(level, 'levelNo', 100, { scale: 3, margin: 10 });
  },
  gameOver: () => {
    const over = TextGen.generateWord('game over');
    TextGen.text(over, 'gameOver', 280, { scale: 6, margin: 25 });
  },
  endGame: () => {
    const title = TextGen.generateWord('congratulations');
    TextGen.endGameTitle(title);

    const completed = TextGen.generateWord('gems are on safe');
    TextGen.text(completed, 'endGameSubtitle', 305, { scale: 4, margin: 15 });

    const madeBy = TextGen.generateWord('by origin games');
    TextGen.madeByText(madeBy);
  },
  addEndScreen: () => {
    if (menusEl) {
      menusEl.style.boxShadow = 'inset 0 0 0 220px #111';
    }
  },
  removeEndScreen: () => {
    if (menusEl) {
      menusEl.style.boxShadow = 'inset 0 0 0 0 #111';
    }
  },
  showCanvas: () => {
    if (gameEl) {
      gameEl.style.display = 'block';
    }
  },
  removeText: (id) => {
    const el = document.getElementById(id);
    if (el && el.parentNode) {
      el.parentNode.removeChild(el);
    }
  }
};

export { Menus };