# Material Swap Style Figma Plugin

## What does this plugin do?

This plugin automatically swaps all paint style references in your Figma file from the `M3/sys/light/` style path to the corresponding `M3/sys/dark/` style path (or vice versa, depending on configuration). It works on your current selection or the entire page if nothing is selected. It uses the latest Figma async APIs for style access and assignment.

## How does it work?

- Loads all local paint styles.
- Determines the scope: selected nodes (and their descendants) or the whole page.
- For each node, checks if it uses a style with the `M3/sys/light/` prefix.
- If so, finds the corresponding `M3/sys/dark/` style and swaps the reference using async Figma APIs.
- Notifies you when the swap is complete.

## How to run the plugin

1. **Build the plugin**  
   Make sure you have run the TypeScript build step (see below).

2. **In Figma:**  
   - Go to the Figma desktop/web app.
   - Open the file you want to use the plugin in.
   - Go to `Menu > Plugins > Development > Import plugin from manifest...`
   - Select the `manifest.json` in this directory.
   - Run the plugin from `Menu > Plugins > Development > [Your Plugin Name]`.

3. **What happens:**  
   - If you have nodes selected, only those (and their descendants) will be processed.
   - If nothing is selected, the entire page will be processed.
   - The plugin will notify you when the swap is complete.

## Development

This plugin template uses Typescript and NPM, two standard tools in creating JavaScript applications.

First, download Node.js which comes with NPM. This will allow you to install TypeScript and other
libraries. You can find the download link here:

  https://nodejs.org/en/download/

Next, install TypeScript using the command:

  npm install -g typescript

Finally, in the directory of your plugin, get the latest type definitions for the plugin API by running:

  npm install --save-dev @figma/plugin-typings

If you are familiar with JavaScript, TypeScript will look very familiar. In fact, valid JavaScript code
is already valid Typescript code.

TypeScript adds type annotations to variables. This allows code editors such as Visual Studio Code
to provide information about the Figma API while you are writing code, as well as help catch bugs
you previously didn't notice.

For more information, visit https://www.typescriptlang.org/

Using TypeScript requires a compiler to convert TypeScript (code.ts) into JavaScript (code.js)
for the browser to run.

We recommend writing TypeScript code using Visual Studio code:

1. Download Visual Studio Code if you haven't already: https://code.visualstudio.com/.
2. Open this directory in Visual Studio Code.
3. Compile TypeScript to JavaScript: Run the "Terminal > Run Build Task..." menu item,
    then select "npm: watch". You will have to do this again every time
    you reopen Visual Studio Code.

That's it! Visual Studio Code will regenerate the JavaScript file every time you save.
