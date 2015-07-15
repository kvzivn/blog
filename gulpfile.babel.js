import gulp from 'gulp';
import stylus from 'gulp-stylus';
import nano from 'gulp-cssnano';
import browserSync from 'browser-sync';

const reload = browserSync.reload;

gulp.task('bs', ['styles'], () => {
    browserSync({
        server: {
            baseDir: './'
        },
        browser: ['google chrome canary']
    });

    gulp.watch(['index.html'], reload);
    gulp.watch(['css/*.styl'], ['styles', reload]);
});

gulp.task('styles', () => {
    return gulp.src('css/*.styl')
        .pipe(stylus())
        .pipe(nano())
        .pipe(gulp.dest('css'));
});

gulp.task('default', ['bs']);