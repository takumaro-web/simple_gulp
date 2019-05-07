/*
*
* CLI version 2.0.1
* Local version 4.0.2
*
* 1.cmd:npm init
* 2.npm install --save-dev gulp gulp-sass gulp-autoprefixer gulp-group-css-media-queries gulp-cssmin browser-sync browsersync-ssi gulp-jsmin
* 3.cmd:gulp/gulp auto/gulp cmq/gulp cssmin/gulp jsmin/
* ※ ひとつひとつインストールしないと時間がかかる可能性あり
*
*/

const gulp = require("gulp");
const sass = require('gulp-sass');
const autoprefixer = require("gulp-autoprefixer");
const cmq = require('gulp-group-css-media-queries');
const cssmin = require('gulp-cssmin');
const browserSync = require('browser-sync').create();
const ssi = require("browsersync-ssi");
const jsmin = require('gulp-jsmin');

sass.compiler = require('node-sass');

/* ----------------------------------------------------------------------------------
 config (project dir)
---------------------------------------------------------------------------------- */
const root = "htdocs-ssl",
    config = {
   "path" : {
      "htdocs"    : root,
      "sass"      : root+"/xxx/xxx/compile/",
      "css"       : root+"/xxx/xxx/css/",
      "js"        : root+"/xxx/xxx/js/"
   }
};
const styleName = 'style';


/* ----------------------------------------------------------------------------------
* Static server
* browser-sync
*-----------------------------------------------------------------------------------*/
gulp.task('build-server', function (done) {
    browserSync.init({
        server: {
            baseDir: "./htdocs-ssl/",
            middleware: [
              ssi({
                 baseDir: __dirname + "/htdocs-ssl",
                 ext: ".html"
              })
            ]
        }
    });
    done();
});

gulp.task('browser-reload', function (done){
    browserSync.reload();
    done();
});

/* ----------------------------------------------------------------------------------
 Sass compile ： Step1
---------------------------------------------------------------------------------- */
gulp.task('sass', function () {
  return gulp.src(config.path.sass+''+styleName+'.scss')
    .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
    .pipe(gulp.dest(config.path.css));
});

gulp.task('sass:watch', function () {
  gulp.watch(config.path.sass+''+styleName+'.scss', ['sass']);
});

/* ----------------------------------------------------------------------------------
 autoprefixer ： Step2
---------------------------------------------------------------------------------- */
gulp.task('auto', () =>
    gulp.src(config.path.css+'/'+styleName+'.css')
        .pipe(autoprefixer({
          browsers: ['last 2 versions','Android 4.3','IE 11'], // can i use は要確認 :http://caniuse.com/
          cascade: false,
          grid: true
        }))
        .pipe(gulp.dest(config.path.css))
        .pipe(gulp.dest(config.path.css+'/bk/'))
);


/* ----------------------------------------------------------------------------------
* Combine Media Queries ： Step3
* gcmq → cmqに変更
* 公開前（テストアップ時)にタスクを実行してからアップし、ブラウザチェックを行う.
---------------------------------------------------------------------------------- */
gulp.task('cmq', () =>
    gulp.src(config.path.css+'/'+styleName+'.css')
        .pipe(cmq())
        .pipe(gulp.dest(config.path.css))
        .pipe(gulp.dest(config.path.css+'/bk/')) //バックアップファイル生成
);

/* ----------------------------------------------------------------------------------
  cssmin ： Step4 gulp4.0系：returnなどで明示的にtaskを終了しなければならない.
---------------------------------------------------------------------------------- */
gulp.task('cssmin', function () {
    return gulp.src(config.path.css+'/'+styleName+'.css')
          .pipe(cssmin())
          .pipe(gulp.dest(config.path.css))
});

/* ----------------------------------------------------------------------------------
  jsmin ： Step5 gulp4.0系：returnなどで明示的にtaskを終了しなければならない.
---------------------------------------------------------------------------------- */
gulp.task('jsmin', function () {
  return gulp.src(config.path.js+'/*.js')
        .pipe(gulp.dest(config.path.js+'/bk/'))
        .pipe(jsmin())
        .pipe(gulp.dest(config.path.js))
});

/* ----------------------------------------------------------------------------------
 Default task
---------------------------------------------------------------------------------- */
gulp.task('watch-files', function(done) {
    gulp.watch(config.path.htdocs+'/**/*.html', gulp.task('browser-reload'));
    gulp.watch(config.path.css+''+styleName+'.css', gulp.task('browser-reload'));
    gulp.watch(config.path.sass+''+styleName+'.scss', gulp.series('sass')); //sassコンパイル後に実行
    //gulp.watch(config.path.js+'/*.js', gulp.task('browser-reload')); //JS
    done();
});

gulp.task('default', gulp.series('build-server', 'watch-files', function(done){
    done();
}));
