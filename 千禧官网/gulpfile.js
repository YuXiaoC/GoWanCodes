var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var open = require('open');
var gulpImport = require('gulp-html-import');
var sass = require('gulp-sass');

var app = {
    srcPath:'src/',
    devPath:'build/',
    prdPath:'dist/',
};

gulp.task('lib',function(){
    gulp.src('bower_components/**/*.js')
        .pipe(gulp.dest(app.devPath + 'asset/vendor'))
        .pipe(gulp.dest(app.prdPath + 'asset/vendor'))
        .pipe($.connect.reload());
});

gulp.task('import', function () {
    gulp.src(app.srcPath + '**/*.html')
        .pipe(gulpImport(app.srcPath+'components/'))
        .pipe(gulp.dest(app.devPath))
        .pipe(gulp.dest(app.prdPath))
        .pipe($.connect.reload());
});

gulp.task('sass',function(){
    gulp.src(app.srcPath + 'asset/style/**/*.scss')
        .pipe($.sass())
        .pipe(gulp.dest(app.devPath + 'asset/css'))
        .pipe($.cssmin())
        .pipe(gulp.dest(app.prdPath + 'asset/css'))
        .pipe($.connect.reload());
});

gulp.task('css',function(){
    gulp.src(app.srcPath + 'asset/style/**/*.css')
        .pipe(gulp.dest(app.devPath + 'asset/css'))
        .pipe($.cssmin())
        .pipe(gulp.dest(app.prdPath + 'asset/css'))
        .pipe($.connect.reload());
});

gulp.task('js',function(){
    gulp.src(app.srcPath + 'asset/js/**/*.js')
        .pipe(gulp.dest(app.devPath + 'asset/js'))
        .pipe($.uglify())
        .pipe(gulp.dest(app.prdPath + 'asset/js'))
        .pipe($.connect.reload());
});

gulp.task('script', function() {
    gulp.src('src/asset/js/test.js')
        .pipe($.uglify())
        .pipe(gulp.dest('dist/asset/js'))
})
gulp.task('es6Toes5',function(){
    gulp.src(app.srcPath + 'asset/js/')
               .pipe($.babel({
                presets: ['es2015'] // es5检查机制
               }))
               .pipe(gulp.dest(app.prdPath + 'asset/js/'))
})

gulp.task('image',function(){
    gulp.src(app.srcPath + 'asset/image/**/*')
        .pipe(gulp.dest(app.devPath + 'asset/image'))
        .pipe($.imagemin())
        .pipe(gulp.dest(app.prdPath + 'asset/image'))
        .pipe($.connect.reload());
});

gulp.task('clean',function(){
    gulp.src([app.devPath,app.prdPath])
        .pipe($.clean())
});

gulp.task('build',['image','js','sass','css','lib','import']);


gulp.task('serve',['build'],function(){
    $.connect.server({
        root:[app.prdPath],
        livereload: true,
        host:'192.168.0.13'
    });

// open('http://192.168.1.102:80');


gulp.watch(app.srcPath + 'asset/js/**/*.js',['js']);
gulp.watch('bower_components/**/*',['lib']);
gulp.watch(app.srcPath + 'asset/image/**/*',['image']);
gulp.watch(app.srcPath + 'asset/style/**/*.scss',['sass']);
gulp.watch(app.srcPath + 'asset/style/**/*.css'['css']);
gulp.watch(app.srcPath + '**/*.html',['import']);

});

gulp.task('default',['serve']);


































