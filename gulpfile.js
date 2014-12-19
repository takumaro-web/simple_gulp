/*
*
* 1.cmd:npm init
* 2.cmd:npm install --save-dev gulp gulp-ruby-sass gulp-autoprefixer gulp-webserver
* 3.cmd:gulp/gulp auto
*
*/

var gulp = require("gulp");
var sass = require('gulp-ruby-sass');
var autoprefixer = require("gulp-autoprefixer");
var server = require('gulp-webserver');

/* ----------------------------------------------------------------------------------
　config (project dir)
---------------------------------------------------------------------------------- */
var root = "htdocs",
    config = {
   "path" : {
      "htdocs"    : root,
      "sass"      : root+"/xxxx/xxxx/sass/",
      "css"       : root+"/xxxx/xxxx/css/"
   }
};

/* ----------------------------------------------------------------------------------
　Livereload
---------------------------------------------------------------------------------- */
gulp.task('server', function() {
  gulp.src('htdocs/')
    .pipe(server({
      livereload: true,
      host: 'xxxxxxxx', //Default:localhost
      port: '' //Default:8000
    }));
});

/* ----------------------------------------------------------------------------------
　Sass compile
---------------------------------------------------------------------------------- */
gulp.task("sass", function() { 
  gulp.src(config.path.sass+'/*')
  .pipe(sass({
    style: 'expanded', //Output style. Can be nested, compact, compressed, expanded.
    sourcemap: false,
    sourcemapPath: './',
    noCache: true
  }))
  .on('error', function (err) { console.log(err.message); })
  .pipe(gulp.dest(config.path.css));
});

/* ----------------------------------------------------------------------------------
　autoprefixer
---------------------------------------------------------------------------------- */
gulp.task('auto', function () {
    return gulp.src(config.path.css+'xxxxxxxx.css')
        .pipe(autoprefixer({
            browsers: ['last 2 versions','Android 2.2','IE 9'],
            cascade: false
        }))
        .pipe(gulp.dest(config.path.css));
});

gulp.task("default",['server'], function() {
    gulp.watch(config.path.sass+'/*',["sass"]);
    //随時実行させる場合は、コメントを外す.
    //gulp.watch(config.path.css+'xxxxxxxx.css',["auto"]);    
});
