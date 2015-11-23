var fs = require('fs'),
    SmartCrop = require('smartcrop'),
    Canvas = require('canvas'),
    _ = require('underscore');

exports.defaults = {
    quality: 90,
    width: 500,
    height: 500,
    canvasFactory: function(w, h){ return new Canvas(w, h); },
    input: null,
    output: null,
}

exports.crop = function(opts){

    var opts = _.extend({}, this.defaults, opts);
    var img = new Canvas.Image();

    img.src = fs.readFileSync(opts.input);

    SmartCrop.crop(img, opts, function(result){

        var canvas = new Canvas(opts.width, opts.height),
            ctx = canvas.getContext('2d'),
            crop = result.topCrop,
            f = fs.createWriteStream(opts.output);

        ctx.patternQuality = 'best';
        ctx.filter = 'best';
        ctx.drawImage(img, crop.x, crop.y, crop.width, crop.height, 0, 0, canvas.width, canvas.height);
        canvas.syncJPEGStream({quality: opts.quality}).pipe(f);

    });

}