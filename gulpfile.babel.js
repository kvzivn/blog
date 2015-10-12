import gulp from 'gulp';
import stylus from 'gulp-stylus';
import nano from 'gulp-cssnano';
import browserSync from 'browser-sync';
import wait from 'gulp-wait';
import run from 'gulp-run';

const reload = browserSync.reload;



gulp.task('bs', ['styles'], () => {
    browserSync({
        server: {
            baseDir: 'dist'
        },
        browser: ['google chrome']
    });

    gulp.watch('src/**/*.md', ['metalsmith']);
    gulp.watch('layouts/**/*.hbt', ['metalsmith']);
    gulp.watch('src/stylesheets/*.styl', ['styles', reload]);
});



gulp.task('styles', () => {
    return gulp.src('src/stylesheets/styles.styl')
        .pipe(stylus())
        .pipe(nano())
        .pipe(gulp.dest('dist/css'))
});



gulp.task('metalsmith', () => {
    run('node --harmony index').exec()
});



gulp.task('default', ['bs']);