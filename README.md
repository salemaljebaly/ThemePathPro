# ThemePathPro

![ThemePathPro Logo](src/assets/logo.svg)

## What does this plugin do?

ThemePathPro automates style path transformation in your Figma designs. Instantly swap all references from one path to another (e.g., 'M3/sys/dark/' to 'M3/sys/light/'), saving hours of manual work.

## Features

- **Custom Style Paths**: Enter your own source and target paths
- **Modern UI**: Clean, user-friendly interface
- **Error Handling**: Clear feedback on errors and warnings
- **Path Validation**: Automatically corrects malformed paths (e.g., double slashes)
- **Selection Support**: Works on selected elements or the entire page
- **Real-time Feedback**: Shows success/error counts and messages
- **Free and Open Source**: Available for everyone to use and modify

## Problem & Solution

**Problem:** 
Material Design workflows in Figma require tedious manual reassignment when switching between theme variations. The Material Theme Builder creates styles but offers no easy way to switch elements between themes.

**Solution:**
ThemePathPro bridges this critical gap, helping designers quickly switch between theme variations without manual reassignment.

## How to use the plugin

1. **Select elements** (optional)  
   If you want to limit the scope, select the elements you want to process. Otherwise, the plugin will process the entire page.

2. **Run the plugin**
   - Enter the source path prefix (e.g., `M3/sys/dark/`)
   - Enter the target path prefix (e.g., `M3/sys/light/`)
   - Click "Swap Styles"

3. **View Results**
   - The plugin will show how many styles were swapped
   - Any errors or warnings will be displayed
   - Check the console for detailed logs

## Installation

1. **Build the plugin**  
   Make sure you have run the TypeScript build step (see Development section below).

2. **In Figma:**  
   - Go to the Figma desktop/web app
   - Open the file you want to use the plugin in
   - Go to `Menu > Plugins > Development > Import plugin from manifest...`
   - Select the `manifest.json` in this directory
   - Run the plugin from `Menu > Plugins > Development > ThemePathPro`

## Project Structure

The plugin follows a modular structure:

```
ThemePathPro/
├── dist/                      # Compiled JavaScript files (used by Figma)
├── src/                       # Source code
│   ├── assets/                # Assets like logo
│   ├── ui/                    # UI files
│   ├── utils/                 # Utility functions
│   └── code.ts                # Main plugin code
├── manifest.json              # Points to dist/code.js
├── package.json               # Dependency management
└── tsconfig.json              # TypeScript configuration
```

## Development

This plugin uses TypeScript, NPM, and follows a modular structure.

### Prerequisites

1. Install Node.js and NPM from https://nodejs.org/
2. Install dependencies:
   ```
   npm install
   ```

### Development Workflow

1. Make changes to the TypeScript files in the `src` directory
2. Build the plugin:
   ```
   npm run build
   ```
   Or to watch for changes:
   ```
   npm run dev
   ```
3. Test in Figma by importing the plugin from the manifest

### Building for Production

```
npm run build
```

This will create the compiled JavaScript files in the `dist` directory.

## Credits

- Developer: [Salem Aljebaly](https://github.com/salemaljebaly)
- Uses Figma Plugin API
