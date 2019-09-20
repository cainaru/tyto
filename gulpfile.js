'use strict';

// ################################
// Load Gulp and tools we will use.
// ################################

var importOnce    = require('node-sass-import-once'),
    gulp          = require('gulp'),
    $             = require('gulp-load-plugins')(),
    browserSync   = require('browser-sync').create(),
    del           = require('del'),
    // gulp-load-plugins will report "undefined" error unless you load gulp-sass manually.
    sass          = require('gulp-sass'),
    autoprefixer  = require('autoprefixer'),
    concat        = require('gulp-concat'),
    kss           = require('kss'),
    postcss       = require('gulp-postcss'),
    sourcemaps    = require('gulp-sourcemaps'),
    runSequence   = require('run-sequence');

var path = require('path');

var options = {};

// #############################
// Edit these paths and options.
// #############################

options.rootPath = {
  project     : __dirname + '/',
  styleGuide  : __dirname + '/styleguide/',
  theme       : __dirname + '/'
};

options.theme = {
  name           : 'Tyto',
  root           : options.rootPath.theme,
  sass           : options.rootPath.theme + 'sass/',
  css            : options.rootPath.theme + 'css/',
  styleGuideOnly : options.rootPath.theme + 'css/styleguide-only'
};

// Set the URL used to access the Drupal website under development. This will
// allow Browser Sync to serve the website and update CSS changes on the fly.
options.drupalURL = '';
// options.drupalURL = 'http://localhost';

// Define the node-sass configuration. The includePaths is critical!
options.sass = {
  importer: importOnce,
  includePaths: [
    options.theme.sass,
    options.rootPath.project + 'node_modules/breakpoint-sass/stylesheets',
    require('scss-resets').includePaths
  ],
  outputStyle: 'expanded'
};

var sassFiles = [
  options.theme.sass + '**/*.scss',
  // Do not open Sass partials as they will be included as needed.
  '!' + options.theme.sass + '**/_*.scss'
];

// Define the style guide paths and options.
options.styleGuide = {
  'source': [
    options.theme.sass,
  ],
  'mask': /\.less|\.sass|\.scss|\.styl|\.stylus/,
  destination: 'styleguide/',

  'builder': 'builder/twig',
  'namespace': options.theme.name + ':' + options.theme.sass,
  'extend-drupal8': true,

  // The css and js paths are URLs, like '/misc/jquery.js'.
  // The following paths are relative to the generated style guide.
  'css': [
    path.relative(options.rootPath.styleGuide, options.theme.css + 'base.css'),
    path.relative(options.rootPath.styleGuide, options.theme.css + 'kss-only.css')
  ],
  'js': [
  ],
  'homepage': 'homepage.md',
  'title': 'Living Style Guide'
};


// #################
// Compile Sass.
// #################

gulp.task('sass', function () {
  return gulp.src(sassFiles)
    .pipe(sourcemaps.init())
    .pipe(sass(options.sass).on('error', sass.logError))
    .pipe(postcss([ autoprefixer() ]))
    .pipe($.rename({dirname: ''}))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(options.theme.css));
});

// #########################
// Lint Sass.
// #########################

gulp.task('lint', ['lint:sass']);

// Lint Sass.
gulp.task('lint:sass', function () {
  return gulp.src(options.theme.sass + '**/*.scss')
    .pipe($.sassLint())
    .pipe($.sassLint.format());
});

// ##################
// Build style guide.
// ##################
gulp.task('styleguide', ['clean:styleguide'], function () {
  return kss(options.styleGuide);
});

// ##############################
// Watch for changes and rebuild.
// ##############################

gulp.task('watch', ['watch:css']);

gulp.task('watch:css', ['sass'], function () {
  return gulp.watch(options.theme.sass + '**/*.scss', ['sass']);
});

// ######################
// Clean all directories.
// ######################
gulp.task('clean', ['clean:styleguide']);

// Clean style guide files.
gulp.task('clean:styleguide', function () {
  // You can use multiple globbing patterns as you would with `gulp.src`
  return del([
    options.styleGuide.destination + '*.html',
    options.styleGuide.destination + 'public',
    options.theme.build + '**/*.twig'
  ], {force: true});
});

