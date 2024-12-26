import { font } from './constants';

const CHAR_MAPPING = {
  a: 0, b: 3, c: 6, d: 9, e: 12, f: 15, g: 18, h: 21, i: 24, j: 27,
  k: 30, l: 33, m: 36, n: 39, o: 42, p: 45, q: 48, r: 51, s: 54, t: 57,
  u: 60, v: 63, w: 66, x: 69, y: 72, z: 75, 0: 78, 1: 81, 2: 84, 3: 87,
  4: 90, 5: 93, 6: 96, 7: 99, 8: 102, 9: 105, ' ': 108,
};

function appendSpans(arr, container, scale, margin) {
  const fragment = document.createDocumentFragment();
  arr.forEach((el) => {
    const span = document.createElement('div');
    span.style.cssText =
      `transform: scale(${scale}); margin-left: ${margin}px;` +
      `image-rendering: pixelated; image-rendering: optimizespeed;` +
      `image-rendering: crisp-edges; display: inline-block; height: 5px; width: 3px;` +
      `background: url(${font}) -${el}px 0;`;
    fragment.appendChild(span);
  });
  container.appendChild(fragment);
}

function createContainer(style, id) {
  const mainBlock = document.getElementById('renders');
  const div = document.createElement('div');
  div.setAttribute('style', style);
  div.id = id;
  mainBlock.appendChild(div);
  return div;
}

const TextGen = {
  mapping: CHAR_MAPPING,

  generateWord(text) {
    return [...text].map((char) => this.mapping[char] ?? this.mapping[' ']);
  },

  titleText(arr) {
    const div = createContainer(
      'position: absolute; top: 40px; right: 0; left: 0; margin: auto; width: 460px; height: 28px;',
      'titleText'
    );
    appendSpans(arr, div, 8, 30);
  },

  madeByText(arr) {
    const div = createContainer(
      'position: absolute; bottom: 30px; right: 0; left: 0; margin: auto; width: 130px; height: 28px;',
      'madeByText'
    );
    appendSpans(arr, div, 3, 10);
  },

  introText(arr, position, width, id) {
    let pos = '';
    switch (position) {
      case 'top': pos = 'top: 150px;'; break;
      case 'bottom': pos = 'bottom: 150px;'; break;
      case 'middle': pos = 'top: 0; bottom: 0;'; break;
    }
    const div = createContainer(
      `position: absolute; ${pos} right: 0; left: 0; margin: auto; width: ${width}px; height: 28px;`,
      id
    );
    appendSpans(arr, div, 3, 10);
  },

  button(arr, id) {
    const div = createContainer(
      'position: absolute; top: 0; right: 0; left: 0; bottom: 0; margin: auto; width: 355px; height: 28px; opacity: 1; animation: fadeinout 1s infinite;',
      id
    );
    appendSpans(arr, div, 4, 15);
  },

  text(arr, id, width, sizes) {
    const div = createContainer(
      `position: absolute; top: 0; right: 0; left: 0; bottom: 0; margin: auto; width: ${width}px; height: 28px;`,
      id
    );
    appendSpans(arr, div, sizes.scale, sizes.margin);
  },

  endGameTitle(arr) {
    const div = createContainer(
      'position: absolute; top: 100px; right: 0; left: 0; margin: auto; width: 450px; height: 28px;',
      'endGameTitle'
    );
    appendSpans(arr, div, 6, 25);
  },

  formInput(placeholder, id, top) {
    const mainBlock = document.getElementById('renders');
    const label = document.createElement('div');
    label.setAttribute(
      'style',
      `position: absolute; top: ${top}px; right: 0; left: 0; margin: auto; width: 200px;`
    );
    this.generateWord(placeholder).forEach((el) => {
      const span = document.createElement('div');
      span.style.cssText =
        `transform: scale(2); margin-left: 5px;` +
        `image-rendering: pixelated; image-rendering: optimizespeed;` +
        `image-rendering: crisp-edges; display: inline-block; height: 5px; width: 3px;` +
        `background: url(${font}) -${el}px 0;`;
      label.appendChild(span);
    });

    const input = document.createElement('input');
    input.setAttribute(
      'style',
      `position: absolute; top: ${top + 30}px; right: 0; left: 0; margin: auto; width: 200px; padding: 5px;`
    );
    input.id = id;
    input.type = placeholder.includes('password') ? 'password' : 'text';

    mainBlock.appendChild(label);
    mainBlock.appendChild(input);
  },

  formButton(text, id, top, onClick) {
    const mainBlock = document.getElementById('renders');
    const button = document.createElement('button');
    button.setAttribute(
      'style',
      `position: absolute; top: ${top}px; right: 0; left: 0; margin: auto; width: 200px; padding: 10px;`
    );
    button.id = id;
    button.onclick = onClick;

    this.generateWord(text).forEach((el) => {
      const span = document.createElement('div');
      span.style.cssText =
        `transform: scale(2); margin-left: 5px;` +
        `image-rendering: pixelated; image-rendering: optimizespeed;` +
        `image-rendering: crisp-edges; display: inline-block; height: 5px; width: 3px;` +
        `background: url(${font}) -${el}px 0;`;
      button.appendChild(span);
    });

    mainBlock.appendChild(button);
  },
};

export { TextGen };
