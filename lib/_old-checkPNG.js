const _ = require('lodash')
const Jimp = require('jimp')

let areaAlpha = []
let countRow = 0
let countCol = 0
let lastY, lastIndex, lastX
let imageIndex = 0

Jimp.read("./app/assets/mockups/mockup-side-by-side.png", function (err, image) {

  image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {

    // var red = this.bitmap.data[idx + 0];
    // var green = this.bitmap.data[idx + 1];
    // var blue = this.bitmap.data[idx + 2];
    // this.bitmap.data[idx + 3] = 1
    // this.bitmap.data[idx + 2] = 0
    // this.bitmap.data[idx + 1] = 255
    // this.bitmap.data[idx + 0] = 0

    var alpha = this.bitmap.data[idx + 3]

    if (alpha === 0) {

      //console.log('-------------------------')
      //console.log(`${x} - ${y}`)
      // console.log(distanceTo({ x: x, y: y }, { x: lastX, y: lastY }))
      if (distanceTo({ x: x, y: y }, { x: lastX, y: lastY }) > 2) {
        //console.log(lastY)
        //console.log(y)
        //console.log('Find Index')
        //if ((y - lastY > 1) && (x - lastX > 1)) {
        //console.log('FindIndex')
        // imageIndex = imageIndex + 1
        imageIndex = findIndexArray(x, y)

        //if (x === 18) console.log(areaAlpha[imageIndex])
        //console.log(imageIndex)
        //}
      }

      if ((lastIndex !== imageIndex)) {
        //console.log("Change index")
        if (typeof areaAlpha[imageIndex] === 'undefined') {
          lastY = undefined
          countCol = 0
          countRow = 0
          areaAlpha[imageIndex] = new Array()
          areaAlpha[imageIndex][countRow] = new Array()
        } else {
          countRow = areaAlpha[imageIndex].length - 1
          countCol = areaAlpha[imageIndex][countRow].length - 1

          lastY = areaAlpha[imageIndex][countRow][countCol].y
        }
      }

      //if (x === 18) console.log(lastY)
      //if (x === 18) console.log(y)
      if ((lastY !== y) && (lastY !== undefined)) {
        //console.log("Create new row")
        //console.log("Change row")
        countRow = countRow + 1
        countCol = 0
        areaAlpha[imageIndex][countRow] = new Array()
      }

      //console.log(`>>Cor: ${imageIndex}--${countRow}--${countCol}`)
      areaAlpha[imageIndex][countRow][countCol] = { x: x, y: y }
      countCol = countCol + 1

      lastY = y
      lastX = x
      lastIndex = imageIndex
    }

  })

  // Dimensions
  //console.log(areaAlpha[1])
  var dimensions = [areaAlpha[0][0].length, areaAlpha[0].length]
  console.log(dimensions)
  console.log('------------------')
  //dimensions = [areaAlpha[1][1].length, areaAlpha[1].length]
  //console.log(dimensions)
  /*console.log('------------------')
  dimensions = [areaAlpha[2].length, areaAlpha[2][1].length]
  console.log(dimensions)
  console.log('------------------')
  dimensions = [areaAlpha[3].length, areaAlpha[3][1].length]
  console.log(dimensions)*/

})

function generatePreviewImages() {

}

function cleanTempFiles() {

}

function getImageData() { }

function distanceTo(from, to) {
  var distance = Math.sqrt((Math.pow(from.x - to.x, 2)) + (Math.pow(from.y - to.y, 2)))
  return distance
}

// Store alpha array
// Check if x or y has in this array
// datastructure



function findIndexArray(x, y) {
  let imageIndex = areaAlpha.length

  areaAlpha.forEach((obj, i) => {
    let arrCheck = _.flatten(obj)
    /*const arrDist = arrCheck.map((point) => {
      return distanceTo(point, { x: x, y: y })
    })

    //Math.min(...arrCheck)

    //if (Math.min(...arrDist) < 2) {
    //  imageIndex = i
    //}*/

    let maxY = _.maxBy(arrCheck, function (o) { return o.y })
    let maxX = _.maxBy(arrCheck, function (o) { return o.x })

    let arrDist = [
      distanceTo(maxY, { x: x, y: y }),
      distanceTo(maxX, { x: x, y: y }),
    ]

    if (Math.min(...arrDist) < 2) {
      imageIndex = i
    }
  })

  return imageIndex
}

/*
const alphaImage = [
  // IMAGE 1:
  [ // y
    [{ x: 1, y: 5 }, { x: 1, y: 6 }, { x: 1, y: 7 }, { x: 1, y: 8 }],
    [{ x: 2, y: 5 }, { x: 2, y: 6 }, { x: 2, y: 7 }, { x: 2, y: 8 }],
    [{ x: 3, y: 5 }, { x: 3, y: 6 }, { x: 3, y: 7 }, { x: 3, y: 8 }],
  ],

  // IMAGE 2:
  [ // y
    [{ x: 3, y: 10 }, { x: 3, y: 11 }],
    [{ x: 4, y: 10 }, { x: 4, y: 11 }],
  ],
]

console.log(findIndexArray(3, 9))
*/
