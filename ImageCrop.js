var fs = require('fs')
var path = require('path')
var PNGDecoder = require('png-stream/decoder')
var PNGEncoder = require('png-stream/encoder')

var Crop = require('crop-image-stream')

var inputFilename = path.join(__dirname, 'dramatic_chipmunk.png')
var outputFilename = path.join(__dirname, 'dramatic_chipmunk_crop.png')

var cropOpts = {
  x: 44,
  y: 12,
  width: 8,
  height: 8
}

fs.createReadStream(inputFilename)
  .pipe(new PNGDecoder())
  .pipe(Crop(cropOpts))
  .pipe(new PNGEncoder())
  .pipe(fs.createWriteStream(outputFilename))