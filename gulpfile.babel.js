import gulp from 'gulp';
import stylus from 'gulp-stylus';
import nano from 'gulp-cssnano';
import browserSync from 'browser-sync';
import run from 'gulp-run';

const reload = browserSync.reload;

gulp.task('bs', ['styles'], () => {
    browserSync({
        server: {
            baseDir: 'dist'
        },
        browser: ['google chrome']
    });

    gulp.watch(['src/**/*.md'], ['metalsmith', reload]);
    gulp.watch(['layouts/**/*.hbt'], ['metalsmith', reload]);
    gulp.watch(['src/styles/*.styl'], ['styles', reload]);
});

gulp.task('styles', () => {
    return gulp.src('src/styles/styles.styl')
        .pipe(stylus())
        .pipe(nano())
        .pipe(gulp.dest('dist/css'))
});

gulp.task('metalsmith', () => {
    run('node --harmony index').exec()
});

gulp.task('default', ['bs']);