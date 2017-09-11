/* global Application, $, ObjC, Path */

const Keynote = Application('Keynote')
const Finder = Application('Finder')
const appSys = Application('System Events')
const fm = $.NSFileManager.defaultManager
const app = Application.currentApplication()
app.includeStandardAdditions = true

/* ----------------
  Get Arguments from osascript
  --------------------  */

var args = $.NSProcessInfo.processInfo.arguments
var argv = []
var argc = args.count

for (var i = 0; i < argc; i++) {
  argv.push(ObjC.unwrap(args.objectAtIndex(i)))
}
delete args

template = JSON.parse(argv[4])
files = JSON.parse(argv[5])
start(template, files)

/* ----------------
 Main Function
 --------------------  */

function start(template, files) {

  /* ----------------
  Recive Files
  --------------------  */

  let filesPath = flatten(files)
  filesPath = concatSlideImages(filesPath, template.images.length)
  const slideTree = createSlideTree(filesPath, template)

  log('------SlideTree')
  log(slideTree)

  /* ----------------
    Create Keynote - Parsing Slide tree
  -------------------- */

  Keynote.activate()

  //let theme = Keynote.themes.whose({ name: 'White' }).first
  let theme = Keynote.themes[1] // white template ID

  let doc = Keynote.Document({
    documentTheme: theme,
    width: 1920,
    height: 1080,
  })

  Keynote.documents.push(doc)

  slideTree.forEach(function (slideElements) {
    // Calculate images slides
    let slide = Keynote.Slide({
      baseSlide: doc.masterSlides[0],
    })
    doc.slides.push(slide)

    // Insert Images
    slideElements.forEach(function (infos) {
      createImage({
        path: Path(infos.path),
        width: infos.width,
        x: infos.x,
        y: infos.y,
      }, doc)
    })

    // Insert Mockup
    let mockConfig = template.mockup
    createImage({
      path: Path(mockConfig.path),
      width: mockConfig.width,
      height: mockConfig.height,
      x: mockConfig.x,
      y: mockConfig.y,
    }, doc)
  })

  doc.slides[0].delete()

}

function createImage(props, doc) {
  let image = Keynote.Image({
    file: Path(props.path),
    width: props.width,
    position: { x: props.x, y: props.y },
  })

  let lastindex = doc.slides.length - 1
  doc.slides[lastindex].images.push(image)
}

/* ----------------
  Generate Slide Tree
--------------------  */

function createSlideTree(slidePath, template) {
  let slideTree = []
  let count = 0

  slidePath.forEach(function (filesPath) {
    let indice = 0

    filesPath.forEach(function (imagePath, index) {
      let placeImage = template.images[index]
      let imgSize = getImageSize(imagePath)
      let result = calcSlideNumber(imgSize, placeImage)

      for (var i = 0; i < result.length; i++) {
        if (typeof slideTree[i + count] === 'undefined') {
          slideTree[i + count] = []
        }
        slideTree[i + count].push({
          path: imagePath,
          x: placeImage.x,
          y: result[i].y,
          width: placeImage.width,
        })
      }

      indice = i
    })

    count = count + indice
  })
  log("---------------BeforeNormalize")
  log(slideTree)
  slideTree = normalizeEmptySlides(slideTree, template)
  return slideTree
}

/* ----------------
  Calc Slide Numbers
--------------------  */

function calcSlideNumber(img, template) {
  const slide = []
  // Resize aspect ratio
  if (img.width !== template.width) {
    let ratio = template.width / img.width
    let newHeight = img.height * ratio
    img.height = parseInt(newHeight)
  }

  let fit = decimalAdjust('round', img.height / template.height, -1) // 1798 / 640 = 2,8
  let fitInteger = parseInt(fit)

  for (var i = 0; i < fitInteger; i++) {
    slide.push({
      y: template.y - template.height * i, // 220 | -420
    })
  }

  // 0.1: cutline
  let subprodcut = decimalAdjust('round', fit - i, -1)
  if (subprodcut > 0.1 && typeof slide[slide.length - 1] !== 'undefined') {
    slide.push({
      y: slide[slide.length - 1].y - (subprodcut * template.height)
    })
  }

  // Accept small images
  if (fit < 1) {
    slide.push({
      y: template.y,
    })
  }

  return slide
}

/* ----------------
  Help Functions
--------------------  */

function normalizeEmptySlides(slideTree, template) {
  const templateLenght = template.images.length // global scope shame :)
  const lastFullObject = slideTree
    .reverse()
    .filter(function (obj) {
      return obj.length >= templateLenght
    })
    .slice(0, 1)

  log("---------------LastFullObject")
  log(lastFullObject)

  slideTree = slideTree.map(function (obj) {
    if (obj.length < templateLenght) {
      let missingImages = flatten(obj.concat(lastFullObject))
      log('------------Matchequalsandremove')
      obj = missingImages
        .filter((obj, pos, arr) => {
          return arr.map(mapObj => mapObj.path).indexOf(obj.path) === pos
        })
        .reverse()
      log(obj)
    }
    return obj
  })

  return slideTree.reverse()
}

// List Directory
function listDirectory(strPath) {
  return ObjC.unwrap(
    fm.contentsOfDirectoryAtPathError(
      $(strPath).stringByExpandingTildeInPath,
      null
    )
  ).map(ObjC.unwrap)
}

// Get Image Size
function getImageSize(pathFile) {
  let height = app.doShellScript(
    `sips -g pixelHeight "${pathFile}" | tail -n1 | cut -d' ' -f4`
  )

  let width = app.doShellScript(
    `sips -g pixelWidth "${pathFile}" | tail -n1 | cut -d' ' -f4`
  )

  return { width: width, height: height }
}

// Console Log
function log(log) {
  console.log(JSON.stringify(log))
}

// Reduce Array
function concatSlideImages(arr, width) {
  return arr.reduce(
    (rows, key, index) =>
      (index % width === 0
        ? rows.push([key])
        : rows[rows.length - 1].push(key)) && rows,
    []
  )
}

// Flatten Array
function flatten(ary) {
  return ary.reduce((a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), [])
}

//Decimal Ajustment
function decimalAdjust(type, value, exp) {
  // If the exp is undefined or zero...
  if (typeof exp === 'undefined' || +exp === 0) {
    return Math[type](value);
  }
  value = +value;
  exp = +exp;
  // If the value is not a number or the exp is not an integer...
  if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
    return NaN;
  }
  // If the value is negative...
  if (value < 0) {
    return -decimalAdjust(type, -value, exp);
  }
  // Shift
  value = value.toString().split('e');
  value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
  // Shift back
  value = value.toString().split('e');
  return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
}
