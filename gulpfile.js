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
    cssOut: 'foresight.components.css',
    jsOut: 'foresight.components.js',
    htmlOut: 'index.html',
    htmlSrc: 'index.html',
    levels: ['common.blocks', 'mobile.blocks']
};

var third_js = [
    'public/third/lodash.min.js',
    'public/third/d3.v4.min.js',
    'public/third/air-datepicker/datepicker.min.js',
    'public/third/bubble/bubble_chart.js',
    'public/third/cloud/d3.v4.layout.cloud.js',
    'public/third/cloud/cloud.js',
    'public/third/gridstack/gridstack.js',
    'public/third/gridstack/gridstack.jQueryUI.js',
    'public/third/riskmatrix/jquery.riskmatrix.js',
    'public/third/jquery.dotdotdot.js',
    'public/slickgrid/slick.core.js',
    'public/slickgrid/slick.formatters.js',
    'public/slickgrid/slick.editors.js',
    'public/slickgrid/plugins/slick.cellrangeselector.js',
    'public/slickgrid/plugins/slick.cellselectionmodel.js',
    'public/slickgrid/plugins/slick.rowselectionmodel.js',
    'public/slickgrid/plugins/asyst.rowselectionmodel.js',
    'public/slickgrid/plugins/slick.checkboxselectcolumn.js',
    'public/slickgrid/slick.grid.js',
    'public/slickgrid/slick.groupitemmetadataprovider.js',
    'public/slickgrid/slick.dataview.js',
    'public/slickgrid/controls/slick.pager.js',
    'public/slickgrid/controls/slick.columnpicker.js'
];
var third_css = [
    'public/third/air-datepicker/datepicker.min.css',
    'public/third/jquery.riskmatrix.css',
    'public/third/gridstack/gridstack.css',
    'public/slickgrid/slick.grid.css',
    'public/slickgrid/controls/slick.pager.css',
    'public/slickgrid/controls/slick.columnpicker.css'
];
var pages_js = [
    'public/pages/dashboard.js',
    'public/pages/reports.js',
    'public/pages/settings.js'
];

var getFileNames = require('html2bl').getFileNames(params);

gulp.task('default', ['server', 'build', 'misc']);

gulp.task('server', function(){
    browserSync.init({
        server: params.out,
        open: 'local',
        browser: 'google chrome'
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
    gulp.watch('public/pages/*.js', ['pages']);
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


gulp.task('misc', ['third', 'pages']);

gulp.task('third', function(){
    gulp.src(third_css)
        .pipe(concat('foresight.third.css'))
        .pipe(postcss([ autoprefixer() ]))
        .pipe(gulp.dest(params.out))
        .pipe(reload({ stream: true }));

    gulp.src(third_css)
        .pipe(concat('foresight.third.css'))
        .pipe(postcss([ autoprefixer() ]))
        .pipe(cleancss({ debug: true, compatibility: 'ie8' }, function(details) {
            console.log(details.name + ': ' + details.stats.originalSize);
            console.log(details.name + ': ' + details.stats.minifiedSize);
        }))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(params.out))
        .pipe(reload({ stream: true }));

    gulp.src(third_js)
        .pipe(concat('foresight.third.js'))
        .pipe(minify({
            ext:{
                src:'.debug.js',
                min:'.min.js'
            }
        }))
        .pipe(gulp.dest(params.out))
        .pipe(reload({ stream: true }));
});

gulp.task('pages', function(){
    gulp.src(pages_js)
        .pipe(concat('foresight.pages.js'))
        .pipe(minify({
            ext:{
                src:'.debug.js',
                min:'.min.js'
            }
        }))
        .pipe(gulp.dest(params.out))
        .pipe(reload({ stream: true }));
});
