<h1 align="center">💻 Exif Data Displayer</h1>

## Overview

Welcome to the Exif Data Displayer. This JavaScript data displayer works with a few js libraries and gives the user the possibility to check all the fungible data of multiple images. The main differences between this program and the other ones online are simple. This program lets you upload multiple images inside your images directory and checks the data of all of them and it is also safer because there is no need to upload your images in an external server. Please **DO NOT** use this program on other people's images. 

## Features

- **Safety:** Keep your images for yourself. No need to upload them online.
- **Multiple Images:** Check the exif data of multiple images in one single click with this program.

### Dependencies
You will need to install the following dependencies in order to run this code.

```sh
npm install exiftool-vendored
```

```sh
npm install chalk
```

## How To Set It Up
In order to set this program up it is important to create a directory called "images" inside the main directory which contains the program. You will then be able to move or copy your jpg images inside the directory.

```sh
mkdir images
```

### ESLint Configuration
In order to set the program you will need to set the configuration of ESLint. This passage will be completely automatic

```sh
npm install eslint --save-dev
```

Now run the following line and answer the questions.
```sh
npx eslint --init

You can also run this command directly using 'npm init @eslint/config@latest'.

✔ How would you like to use ESLint? · problems

✔ What type of modules does your project use? · esm

✔ Which framework does your project use? · none

✔ Does your project use TypeScript? · javascript

✔ Where does your code run? · browser

The config that you've selected requires the following dependencies:

eslint@9.x, globals, @eslint/js

✔ Would you like to install them now? · No / Yes (Yes)

✔ Which package manager do you want to use? · npm
```

After doing that you can run the script and choose the output format.

### Output Format
The program will ask you if you want the output written inside the terminal or inside a txt file. If you choose the txt file, the program will automatically create a txt file called **exif_output.txt** inside the same directory.

```sh
Select output mode: 1 for file, 2 for terminal: 1
```

If the user selects option number 2 the program will write the exif data directly on the terminal and will complete the program

```sh
Select output mode: 1 for file, 2 for terminal: 2
...
All images processed.
```

<h2 align="center">Enjoy using your Exif data Displayer</h2>

