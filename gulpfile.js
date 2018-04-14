/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require("gulp-autoprefixer");
var cssBase64 = require('gulp-css-base64');
var browserSync = require('browser-sync');


gulp.task('browserSync', function() {
  browserSync({
    server: {
      baseDir: './'
    }
  })
});


gulp.task('css', function () {
    return gulp.src('assets/scss/**/*.scss')
            .pipe(sass({
                includePaths: require('node-normalize-scss').includePaths
            })
            .on('error', function (error) {
                console.log(error);
            })
            )
            .pipe(cssBase64({
                baseDir: "../images",//путь до папки с изображениями которые следует обрабатывать  , относительно директории sass/css
                maxWeightResource: 4000,// Размер в байтах , а не ширина 
                extensionsAllowed: ['.gif', '.jpg', '.png','.svg']
            }))
            .pipe(autoprefixer(['last 2 versions', '> 1%', 'ie 8', 'ie 7', 'iOS >= 8', 'Safari >= 8']))
            .pipe(gulp.dest('assets/css'))
            .pipe(browserSync.reload({
                stream: true
            }))
            ;
});

gulp.task('default', function () {
    // place code for your default task here
});


gulp.task('watch',["browserSync"], function () {
    gulp.watch('assets/scss/**/*.scss', ['css']);
});