// include gulp
var gulp = require('gulp'); 

// include plug-ins
var jshint = require('gulp-jshint');
var changed = require('gulp-changed');
var imagemin = require('gulp-imagemin');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var minifyCSS = require('gulp-minify-css');
var less = require('gulp-less');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var minifyHTML = require('gulp-minify-html');
var size = require('gulp-size');
var mainBowerFiles = require('gulp-main-bower-files');

var browserSync = require('browser-sync');
var reload = browserSync.reload;

var gulpLoadPlugins = require('gulp-load-plugins');
const $ = gulpLoadPlugins();

var del = require('del');
var merge = require('merge-stream');


var src = './src/';
var dest = './_build/';


/*
// clearing the build folder first
gulp.task('clean', function(cb) {
    del([dest], cb);
});
*/


gulp.task('clean', function() {
});


// minify new or changed HTML pages
gulp.task('html', function() {
  gulp.src(src + '/**/*.html')
    .pipe(changed(dest))
    .pipe(minifyHTML())
    .pipe(gulp.dest(dest))
    .pipe(reload({ stream:true }));;
});

gulp.task('php', function() {
  gulp.src(src + '/**/*.php')
    .pipe(changed(dest))
    .pipe(gulp.dest(dest))
    .pipe(reload({ stream:true }));
});

gulp.task('allOther', function() {
  gulp.src([
	src + '/**/*.*',
	'!**/*.html',
	'!**/*.php',
	'!**/*.less',
	'!**/*.css',
	'!**/*.js',
	'!**/*.jpg',
	'!**/*.jpeg',
	'!**/*.gif',
	'!**/*.png',
	'!**/*.svg',
	'!**/*.map'	
  ])
    .pipe(changed(dest))
    .pipe(gulp.dest(dest));
});

// JS hint task
gulp.task('jshint', function() {
  gulp.src(src + 'scripts/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

// JS concat and minify
gulp.task('scripts', ['clean'], function() {
  gulp.src(src + 'scripts/**/*.js')
		.pipe(sourcemaps.init())
    .pipe(concat('scripts.js'))
    .pipe(uglify())
    .pipe(size({title: 'Size of scripts'}))
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest(dest + 'scripts/'))
    .pipe(reload({ stream:true }));
});

// minify new images
gulp.task('images', ['clean'], function() {
  gulp.src(src + 'images/**/*')
    .pipe(changed(dest + 'images'))
    .pipe(imagemin({optimizationLevel: 5, progressive: true, interlaced: true}))
    .pipe(gulp.dest(dest + 'images'));
});


//convert less to css
gulp.task('less', ['clean'], function() {
  return gulp.src([src + 'styles/less/*.less'])
    .pipe($.ignore.exclude('_*.less'))
    .pipe(sourcemaps.init())
    .pipe(less())
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest(src + 'styles/less/dist/'))
    ;
});
//concatenate, sourcemap and minify all css
gulp.task('styles', ['clean', 'less'], function() {
  return gulp.src([ src + 'styles/**/site.css', src + 'styles/**/*.css'])
    .pipe(sourcemaps.init())
    .pipe(autoprefixer('last 3 versions'))
    .pipe(concat('styles.css'))
    .pipe(minifyCSS({processImport: false}))
    .pipe(size({title: 'Size of styles'}))
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest(dest + 'styles/'))
    .pipe(reload({ stream:true }));
});



// get bower libraries
gulp.task('bower', ['clean'], function(){
    var jsFilter = $.filter('**/*.js', {restore: true})
    var cssFilter = $.filter('**/*.css', {restore: true});
    
    var bowerFiles = gulp.src('./bower.json')
        .pipe(mainBowerFiles({
            overrides: {
                bootstrap: {
                    main: [
                        './dist/js/bootstrap.js',
                        './dist/css/bootstrap.css',
                        './dist/fonts/*.*'
                    ]
                }
            }
        }))
        //.pipe(changed(dest + 'libs'))
        .pipe(gulp.dest(dest + 'libs'))
        
        .pipe(jsFilter)
        .pipe(concat('mainLibs.js'))
				.pipe(uglify())
				.pipe(jsFilter.restore)
				
        .pipe(cssFilter)
				//.pipe(changed(dest + 'libs'))
        .pipe(concat('mainLibs.css'))
        .pipe(minifyCSS())
        .pipe(cssFilter.restore)

        .pipe(gulp.dest(dest + 'libs'));
        
	return bowerFiles;
});


// Watch for changes in files
gulp.task('watch', function() {
   // Watch .js files
  gulp.watch(src + 'scripts/**/*.js', ['scripts']);
   // Watch .scss files
  gulp.watch([src + 'styles/less/**/*.less', src + 'styles/**/*.css'], ['styles']);
   // Watch image files
  gulp.watch(src + 'images/**/*', ['images']);
 });


// Watch for changes in files
gulp.task('run', ['images', 'styles', 'scripts', 'bower', 'html', 'php', 'allOther'], function() {});


// default gulp task
gulp.task('default', ['run'], function() {

   // Watch .js files
  gulp.watch(src + 'scripts/*.js', ['scripts']);
   // Watch .less and .css files
  gulp.watch([src + 'styles/less/**/*.less', src + 'styles/**/*.css'], ['styles']);
   // Watch image files
  gulp.watch(src + 'images/**/*', ['images']);
   // Watch for bower changes
  gulp.watch('bower.json', ['bower']);
   // Watch for other files changes
  gulp.watch(src + '**/*.html', ['html']);
  gulp.watch(src + '**/*.php', ['php']);
});


// live reload
gulp.task('serve', ['default'], function() {
  browserSync({
    //server: {baseDir: dest} // for local files
    //files: ["*.php"],
    proxy: "127.0.0.1", // for local server
    startPath: "/server_adi_2/_tests/gulpProject/_build/test.php" // serve the file

  });
  //gulp.watch(['*.php'], {cwd: dest}, reload);
});
