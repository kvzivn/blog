import gulp from 'gulp';
import stylus from 'gulp-stylus';
import nano from 'gulp-cssnano';
import browserSync from 'browser-sync';

const reload = browserSync.reload;

gulp.task('bs', ['styles'], () => {
    browserSync({
        server: {
            baseDir: 'dist'
        },
        browser: ['google chrome canary']
    });

    gulp.watch(['dist/index.html'], reload);
    gulp.watch(['src/styles/*.styl'], ['styles', reload]);
});

gulp.task('styles', () => {
    return gulp.src('src/styles/*.styl')
        .pipe(stylus())
        .pipe(nano())
        .pipe(gulp.dest('dist/css'));
});

gulp.task('default', ['bs']);