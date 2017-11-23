/**
 * Created by ido on 10/3/2017.
 */
/**
 * based on https://www.sitepoint.com/wordpress-theme-automation-with-gulp/...
 * */
require('es6-promise').polyfill();
var gulp            =   require('gulp');

//scss vars
var sass            =   require('gulp-sass');
var autoprefixer    =   require('gulp-autoprefixer');
var rtlcss          =   require('gulp-rtlcss');
var rename          =   require('gulp-rename');
var plumber         =   require('gulp-plumber');
var gutil           =   require('gulp-util');
//js vars
var concat          =   require('gulp-concat');
var jshint          =   require('gulp-jshint');
var uglify          =   require('gulp-uglify');

//img
var imagemin        =   require('gulp-imagemin');

// browserSync
var browserSync     =   require('browser-sync').create();
var reload          =   browserSync.reload;


// CSS tasks
gulp.task('sass', function() {
    return gulp.src('assets/dev/scss/**/*.scss')
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(gulp.dest('./assets/dist/css'))
        .pipe(plumber({ errorHandler: onError }))

        .pipe(rtlcss())                     // Convert to RTL
        .pipe(rename({ basename: 'rtl' }))  // Rename to rtl.css
        .pipe(gulp.dest('./assets/dist/css'));             // Output RTL stylesheets (rtl.css)
});

// JS tasks
var bsJS = 'assets/dev/bower_components/dist/js/bootstrap.bundle.min.js',
    slickJS = 'assets/dev/bower_components/slick-carousel/slick/slick.min.js';
gulp.task('js', function() {
    return gulp.src([bsJS,slickJS,'assets/dev/js/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(concat('app.js'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest('assets/dist/js'))
});

//images
gulp.task('images', function() {
    return gulp.src('assets/dev/img/*')
        .pipe(plumber({errorHandler: onError}))
        .pipe(imagemin({optimizationLevel: 7, progressive: true}))
        .pipe(gulp.dest('assets/dist/img'));
});

// Util Tasks
gulp.task('timestamp', function () {
    var date = new Date();
    console.log('last task was at: ' + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds());
});

gulp.task('watch', function() {
    browserSync.init({
        files: ['./**/*.html'],
        proxy: 'http://localhost/wireframes/'
    });
    gulp.watch('assets/dev/scss/**/*.scss', ['sass',reload]);
    gulp.watch('assets/dev/img/*', ['images']);
    gulp.watch('assets/dev/js/*.js', ['js', reload]);
});

var onError = function (err) {
    console.log('An error occurred:', gutil.colors.magenta(err.message));
    gutil.beep();
    this.emit('end');
};
gulp.task('default', [
    'sass',
    'js',
    'images',
    'watch',
    'timestamp'
]);
