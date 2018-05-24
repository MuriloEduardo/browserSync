import gulp from 'gulp';
import browserSync from 'browser-sync';
import gnodemon from 'gulp-nodemon';
import concat from 'gulp-concat';
import uglify from 'gulp-uglify';
import babel from 'gulp-babel';
import rename from 'gulp-rename';
import cleanCSS from 'gulp-clean-css';
import del from 'del';
import sass from 'gulp-sass';

const server = browserSync.create();

const paths = {
  views: {
    src: 'src/**/*.liquid',
    dest: 'dist/'
  },
  styles: {
    src: 'src/scss/**/*.scss',
    dest: 'dist/public/styles/'
  },
  scripts: {
    src: 'src/scripts/**/*.js',
    dest: 'dist/public/scripts/'
  }
};

const clean = () => del(paths.views.dest);

function nodemon(done) {
  var called = false;
  gnodemon({
    script: 'app.js',
    ignore: ['node_modules/']
  })
  .on('start', function() {
    if (!called) {
      called = true;
      done();
    }
  })
};

function serve(done) {
  server.init({
    proxy: 'localhost:3000',
    port: 5000,
    notify: true
  });
  done();
};

function reload(done) {
  server.reload();
  done();
};

function scripts() {
  return gulp.src(paths.scripts.src, { sourcemaps: true })
    .pipe(babel())
    .pipe(uglify())
    .pipe(concat('main.min.js'))
    .pipe(gulp.dest(paths.scripts.dest));
};

function styles() {
  return gulp.src(paths.styles.src)
    .pipe(sass())
    .pipe(cleanCSS())
    .pipe(rename({
      basename: 'main',
      suffix: '.min'
    }))
    .pipe(gulp.dest(paths.styles.dest));
};

function views() {
  return gulp.src(paths.views.src)
    .pipe(gulp.dest(paths.views.dest));
};

const watch = () => {
  gulp.watch(paths.scripts.src, gulp.series(scripts, reload));
  gulp.watch(paths.styles.src, gulp.series(styles, reload));
  gulp.watch(paths.views.src, gulp.series(views, reload));
};

const dev = gulp.series(serve, nodemon, watch, gulp.parallel(scripts, styles, views));

export default dev;