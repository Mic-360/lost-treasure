# Lost Treasure

Lost Treasure is a JavaScript-based game where players navigate through various levels to collect treasures while avoiding enemies and obstacles. The game is built using HTML5, CSS, and JavaScript, and it leverages the Canvas API for rendering the game graphics.

## Table of Contents
- [Lost Treasure](#lost-treasure)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Game Mechanics](#game-mechanics)
    - [Controls](#controls)
    - [Objectives](#objectives)
    - [Levels](#levels)
  - [Development](#development)
    - [Project Structure](#project-structure)
      - [Key Files](#key-files)
    - [Building and Running](#building-and-running)
  - [Contributing](#contributing)

## Installation

To get started with Lost Treasure, clone the repository and install the necessary dependencies:

```bash
git clone https://github.com/mic-360/lost-treasure.git
cd lost-treasure
npm install
```

## Usage

To run the game locally, use the following command:

```bash
npm start
```

This will start a development server and open the game in your default web browser. You can also build the project for production using:

```bash
npm run build
```

## Game Mechanics

### Controls
- **Arrow Keys**: Move the player left or right.
- **Spacebar**: Jump.

### Objectives
- Collect all the treasures (coins) in each level.
- Avoid enemies and obstacles (spikes).
- Reach the chest to complete the level.

### Levels
The game consists of multiple levels, each defined in the `maps` directory. Levels are loaded sequentially, and the game progresses as the player completes each level.

## Development

### Project Structure
#### Key Files
- `game.js`: Main game logic, including rendering and updating game entities.
- `levels.js`: Defines the levels of the game.
- `constants.js`: Contains game constants and configurations.
- `menus.js`: Manages game menus and UI elements.
- `utils.js`: Utility functions used throughout the game.

### Building and Running
To build the project, run:

```bash
npm run build
```

This will create a production-ready build in the `dist` directory. To start the development server, run:

```bash
npm start
```

## Contributing

Contributions are welcome! Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes and commit them (`git commit -m 'Add new feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Open a pull request.
