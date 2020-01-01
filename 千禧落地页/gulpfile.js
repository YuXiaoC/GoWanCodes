var gulp = require('gulp'),connect = require('gulp-connect');
gulp.task('watch',function(){
  gulp.watch('./src/**/*.html',['html']);
}) 
gulp.task('connect',function(){
  connect.server({
      root:'./src',  
      port:80,
      host:'192.168.0.125',
      livereload: true
  })
})
gulp.task('html', function(){
  gulp.src('./src/**/*.html')
      .pipe(connect.reload());
});
gulp.task('default',['connect','watch'])