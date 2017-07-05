<div align="center" markdown="1">
<img src="docs/logo.png" alt="Screeener! Screens to keynote magically" width="500"><br/>
Use this app to insert a bunch of images to a keynote file, using the mockup you choose.
</div>

## Get Screeener!

**[Download the latest release]()** (macOS only)

**Features**
- Move the image to show the entire screen along slides
- Support multiple images in the same slide
- Support custom mockups
- Resize images respecting the aspect ratio
- Support retina images
## How to add a mockup

1. Go to the folder `~/Library/Application Support/Screeener/templates`
2. Add a new json file with the template below using your mockup informations:
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
3. Add the mockup image to the folder `/mockups` and inform the file path in the JSON.
4. Restart the app. Done! 😎

## Contribute

- `yarn install` Install dependencies.
- `yarn watch` Compile development version and watch for changes. Bundled files will appear in `dist/`.
- `yarn start` Start the desktop app (while watcher is running in another terminal). Use Ctrl-R or Cmd-R to reload the app.
- `yarn run pack` Pack to app distribute version
