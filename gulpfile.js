/**
 * Created by mbaluev on 01.06.2017.
 */

var gulp = require('gulp'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    browserSync = require('browser-sync').create(),
    reload = browserSync.reload,
    path = require('path'),
    url = require('gulp-css-url-adjuster'),
    autoprefixer = require('autoprefixer-core'),
    postcss = require('gulp-postcss'),
    cleancss = require('gulp-clean-css'),
    minify = require('gulp-minify');

var params = {
    out: 'public',
    cssOut: 'foresight-components.css',
    jsOut: 'foresight-components.js',
    htmlOut: 'index.html',
    htmlSrc: 'index.html',
    levels: ['common.blocks']
};

var getFileNames = require('html2bl').getFileNames(params);

gulp.task('default', ['server', 'build']);

gulp.task('server', function(){
    browserSync.init({
        server: params.out
    });
    gulp.watch('*.html', ['html']);
    gulp.watch(params.levels.map(function(level){
        var cssGlob = level + '/**/*.css';
        return cssGlob;
    }), ['css']);
    gulp.watch(params.levels.map(function(level) {
        var jsGlob = level + '/**/*.js';
        return jsGlob;
    }), ['js']);
});

gulp.task('build', ['html', 'css', 'images', 'js']);

gulp.task('html', function(){
    gulp.src(params.htmlSrc)
        .pipe(rename(params.htmlOut))
        .pipe(gulp.dest(params.out))
        .pipe(reload({ stream: true }));
});

gulp.task('css', function(){
    getFileNames.then(function(files){
        //gulp.src(['common.blocks/**/*.css', 'pink.blocks/**/*.css'])
        gulp.src(files.css)
            .pipe(concat(params.cssOut))
            .pipe(url({ prepend: 'images/' }))
            .pipe(postcss([ autoprefixer() ]))
            .pipe(gulp.dest(params.out))
            .pipe(reload({ stream: true }));
    }).done();

    getFileNames.then(function(files){
        gulp.src(files.css)
            .pipe(concat(params.cssOut))
            .pipe(url({ prepend: 'images/' }))
            .pipe(postcss([ autoprefixer() ]))
            .pipe(cleancss({ debug: true, compatibility: 'ie8' }, function(details) {
                console.log(details.name + ': ' + details.stats.originalSize);
                console.log(details.name + ': ' + details.stats.minifiedSize);
            }))
            .pipe(rename({suffix: '.min'}))
            .pipe(gulp.dest(params.out))
            .pipe(reload({ stream: true }));
    }).done();
});

gulp.task('images', function(){
    getFileNames.then(function(source){
        gulp.src(source.dirs.map(function(dir){
            var imgGlob = path.resolve(dir) + '/*.{jpg,png,svg}';
            return imgGlob;
        })).pipe(gulp.dest(path.join(params.out, 'images')));
    }).done();
});

gulp.task('js', function() {
    getFileNames.then(function(src){
        return src.dirs.map(function(dir){
            var jsGlob = path.resolve(dir) + '/*.js';
            return jsGlob;
        });
    }).then(function(jsGlobs){
        gulp.src(jsGlobs)
            .pipe(concat(params.jsOut))
            .pipe(minify({
                ext:{
                    src:'.debug.js',
                    min:'.min.js'
                }
            }))
            .pipe(gulp.dest(params.out))
            .pipe(reload({ stream: true }));
    })
    .done();
});
