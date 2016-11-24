var gulp = require("gulp");
var path = require('path');
var fs = require('fs');
var del = require('del');
var rename = require("gulp-rename");
var recursiveFolder = require('gulp-recursive-folder');
var slugify = require('slugify');
var chalk = require('chalk');
var gm = require('gulp-gm');
var imagemin = require('gulp-imagemin');
var imageminMozjpeg = require('imagemin-mozjpeg');

var options = {
  from: 'public/src',
  resize: 'public/resized',
  rename: 'public/dist'
};

gulp.task('clean:resize', function () {
  return del([ options.resize ]);
});

gulp.task('resize', ['clean:resize'], recursiveFolder({
  base: options.from
}, function (folder) {
  //This will loop over all folders inside pathToFolder main and recursively on the children folders, secondary
  //With folderFound.name gets the folderName
  //With folderFound.path gets all folder path found
  //With folderFound.pathTarget gets the relative path beginning from options.pathFolder

  var folderName = slugify(folder.name.toLowerCase());
  var folderPath = slugify(folder.pathTarget.toLowerCase());
  var iteration = 0;

  return gulp.src(folder.path + "/*.{png,gif,jpg,jpeg,tif,bmp,PNG,GIF,JPG,JPEG,TIF,BMP}")
    // .pipe(rename(function (path) {
    //   iteration++;
    //   var suffix = iteration < 10 ? '0' + iteration : iteration;
    //   console.log(chalk.green(JSON.stringify(path)));
    //   path.basename = '-' + folderName + '-' + suffix;
    // }))
    .pipe(gm(function (gmfile) {
      return gmfile
        .resize(1300, 1080)
        .setFormat('jpg')
      ;
    }))
    .pipe(imagemin([
      imageminMozjpeg({
        quality: 75
      })
    ]))
    .pipe(gulp.dest(options.resize + "/" + folderPath));
}));

gulp.task('clean:rename', ['resize'], function () {
  return del([ options.rename ]);
});

gulp.task('rename', ['clean:rename'], recursiveFolder({
  base: options.resize
}, function (folder) {
  var folderName = slugify(folder.name.toLowerCase());
  var folderPath = slugify(folder.pathTarget.toLowerCase());
  var iteration = 0;

  return gulp.src(folder.path + "/*.{png,gif,jpg,jpeg,tif,bmp}")
    .pipe(rename(function (path) {
      iteration++;
      var suffix = iteration < 10 ? '0' + iteration : iteration;
      path.basename = folderPath + '-' + suffix;
    }))
    .pipe(gulp.dest(options.rename + "/" + folderPath));
}));

gulp.task('build', ['rename'], function () {
  return del([ options.resize ]);
});

gulp.task('default', ['build']);

