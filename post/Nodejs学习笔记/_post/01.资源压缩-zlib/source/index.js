var fs = require('fs');
var zlib = require('zlib');

// var gzip = zlib.createGzip(); // 压缩

// var inFile = fs.createReadStream('./fileForCompress.txt');
// var out = fs.createWriteStream('./fileForCompress.txt.gz');

// inFile.pipe(gzip).pipe(out);

var gunzip = zlib.createGunzip(); // 解压

var inFile = fs.createReadStream('./fileForCompress.txt.gz');
var outFile = fs.createWriteStream('./fileForCompress1.txt');

inFile.pipe(gunzip).pipe(outFile);