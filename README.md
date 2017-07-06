<div align="center" markdown="1">
<img src="docs/logo.png" alt="Screeener! Screens to keynote magically" width="500">
</div>

## Get Screeener!

**[Download the latest release](https://github.com/zehfernandes/screeener/releases)** (macOS only)

Use this app to insert a bunch of images to a keynote file, using the mockup you choose.

## How to install a new mockup

1. Go to the folder `~/Library/Application Support/Screeener/templates`
2. Add the JSON file and the mockup image in the folder
3. Restart the app. And Done! 😎

## How to create a mockup

1. Write a JSON file with the template below using your mockup informations:
```json
{
  "name": "Side by side",
  "category": "default",
  "images": [
    { "x": 273, "y": 137, "width": 1204, "height": 753 },
    { "x": 1483, "y": 428, "width": 297, "height": 640 }
  ],
  "mockup": {
    "x": 0,
    "y": 0,
    "width": 1920,
    "height": 1080,
    "path": "mockups/mockup-side-by-side.png"
  }
}
```
2. Go to the folder `~/Library/Application Support/Screeener/templates`
3. Add your mockup JSON file in the folder
4. Don't forget to paste the mockup image too, with the correct file path in JSON `path` node.
5. Restart the app. And Done! 😎

## Contribute

- `yarn install` Install dependencies.
- `yarn watch` Compile development version and watch for changes. Bundled files will appear in `dist/`.
- `yarn start` Start the desktop app (while watcher is running in another terminal). Use Ctrl-R or Cmd-R to reload the app.
- `yarn run pack` Pack to app distribute version
