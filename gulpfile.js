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
var uni2019params = {
    out: 'public',
    cssOut: 'design.uni2019.css',
    jsOut: 'design.uni2019.js',
    htmlOut: 'index.html',
    htmlSrc: 'index.html',
    levels: ['design/uni2019/common.blocks', 'design/uni2019/mobile.blocks']
};
var darksightparams = {
    out: 'public',
    cssOut: 'design.darksight.css',
    jsOut: 'design.darksight.js',
    htmlOut: 'index.html',
    htmlSrc: 'index.html',
    levels: ['design/darksight/common.blocks', 'design/darksight/mobile.blocks']
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
    'public/third/filesize.js',
    'public/third/lightbox/lightbox.js',
    'public/third/particles/particles.min.js',
    'public/third/jquery.countdown.min.js'
    /*
    'public/third/slickgrid/slick.core.js',
    'public/third/slickgrid/slick.formatters.js',
    'public/third/slickgrid/slick.editors.js',
    'public/third/slickgrid/plugins/slick.cellrangeselector.js',
    'public/third/slickgrid/plugins/slick.cellselectionmodel.js',
    'public/third/slickgrid/plugins/slick.rowselectionmodel.js',
    'public/third/slickgrid/plugins/asyst.rowselectionmodel.js',
    'public/third/slickgrid/plugins/slick.checkboxselectcolumn.js',
    'public/third/slickgrid/slick.gridboard.js',
    'public/third/slickgrid/slick.groupitemmetadataprovider.js',
    'public/third/slickgrid/slick.dataview.js',
    'public/third/slickgrid/controls/slick.pager.js',
    'public/third/slickgrid/controls/slick.columnpicker.js'
    */
];
var third_css = [
    'public/third/air-datepicker/datepicker.min.css',
    'public/third/jquery.riskmatrix.css',
    'public/third/gridstack/gridstack.css',
    'public/third/lightbox/lightbox.css'
    /*
    'public/third/slickgrid/slick.grid.css',
    'public/third/slickgrid/controls/slick.pager.css',
    'public/third/slickgrid/controls/slick.columnpicker.css'
    */
];
var pages_js = [
    'public/pages/dashboard.js',
    'public/pages/dashboardgrid.js',
    'public/pages/docsearch.js',
    'public/pages/gridview.js',
    'public/pages/reports.js',
    'public/pages/gridboard.js'
];

var getFileNames = require('html2bl').getFileNames(params);
var uniGetFileNames = require('html2bl').getFileNames(uni2019params);
var darkGetFileNames = require('html2bl').getFileNames(darksightparams);

gulp.task('default', ['server', 'build', 'misc', 'design']);

/* server */
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
    gulp.watch(params.levels.map(function(level){
        var jsGlob = level + '/**/*.js';
        return jsGlob;
    }), ['js']);
    gulp.watch('public/pages/*.js', ['pages']);

    /* watch design - uni2019 */
    gulp.watch(uni2019params.levels.map(function(level){
        var cssGlob = level + '/**/*.css';
        return cssGlob;
    }), ['uni2019_css']);
    gulp.watch(uni2019params.levels.map(function(level){
        var jsGlob = level + '/**/*.js';
        return jsGlob;
    }), ['uni2019_js']);
});

/* components */
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

/* third & pages */
gulp.task('misc', [/*'third',*/ 'pages']);
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

/* design */
gulp.task('design', ['uni2019', 'darksight']);

/* uni2019 */
gulp.task('uni2019', ['uni2019_css', 'uni2019_images', 'uni2019_js']);
gulp.task('uni2019_css', function(){
    uniGetFileNames.then(function(files){
        gulp.src(files.css)
            .pipe(concat(uni2019params.cssOut))
            .pipe(url({ prepend: 'images/' }))
            .pipe(postcss([ autoprefixer() ]))
            .pipe(gulp.dest(uni2019params.out))
            .pipe(reload({ stream: true }));
    }).done();
    uniGetFileNames.then(function(files){
        gulp.src(files.css)
            .pipe(concat(uni2019params.cssOut))
            .pipe(url({ prepend: 'images/' }))
            .pipe(postcss([ autoprefixer() ]))
            .pipe(cleancss({ debug: true, compatibility: 'ie8' }, function(details) {
                console.log(details.name + ': ' + details.stats.originalSize);
                console.log(details.name + ': ' + details.stats.minifiedSize);
            }))
            .pipe(rename({suffix: '.min'}))
            .pipe(gulp.dest(uni2019params.out))
            .pipe(reload({ stream: true }));
    }).done();
});
gulp.task('uni2019_images', function(){
    uniGetFileNames.then(function(source){
        gulp.src(source.dirs.map(function(dir){
            var imgGlob = path.resolve(dir) + '/*.{jpg,png,svg}';
            return imgGlob;
        })).pipe(gulp.dest(path.join(uni2019params.out, 'images')));
    }).done();
});
gulp.task('uni2019_js', function() {
    uniGetFileNames.then(function(src){
        return src.dirs.map(function(dir){
            var jsGlob = path.resolve(dir) + '/*.js';
            return jsGlob;
        });
    }).then(function(jsGlobs){
        gulp.src(jsGlobs)
            .pipe(concat(uni2019params.jsOut))
            .pipe(minify({
                ext:{
                    src:'.debug.js',
                    min:'.min.js'
                }
            }))
            .pipe(gulp.dest(uni2019params.out))
            .pipe(reload({ stream: true }));
    }).done();
});

/* darksight */
gulp.task('darksight', ['darksight_css', 'darksight_images', 'darksight_js']);
gulp.task('darksight_css', function(){
    darkGetFileNames.then(function(files){
        gulp.src(files.css)
            .pipe(concat(darksightparams.cssOut))
            .pipe(url({ prepend: 'images/' }))
            .pipe(postcss([ autoprefixer() ]))
            .pipe(gulp.dest(darksightparams.out))
            .pipe(reload({ stream: true }));
    }).done();
    darkGetFileNames.then(function(files){
        gulp.src(files.css)
            .pipe(concat(darksightparams.cssOut))
            .pipe(url({ prepend: 'images/' }))
            .pipe(postcss([ autoprefixer() ]))
            .pipe(cleancss({ debug: true, compatibility: 'ie8' }, function(details) {
                console.log(details.name + ': ' + details.stats.originalSize);
                console.log(details.name + ': ' + details.stats.minifiedSize);
            }))
            .pipe(rename({suffix: '.min'}))
            .pipe(gulp.dest(darksightparams.out))
            .pipe(reload({ stream: true }));
    }).done();
});
gulp.task('darksight_images', function(){
    darkGetFileNames.then(function(source){
        gulp.src(source.dirs.map(function(dir){
            var imgGlob = path.resolve(dir) + '/*.{jpg,png,svg}';
            return imgGlob;
        })).pipe(gulp.dest(path.join(darksightparams.out, 'images')));
    }).done();
});
gulp.task('darksight_js', function() {
    darkGetFileNames.then(function(src){
        return src.dirs.map(function(dir){
            var jsGlob = path.resolve(dir) + '/*.js';
            return jsGlob;
        });
    }).then(function(jsGlobs){
        gulp.src(jsGlobs)
            .pipe(concat(darksightparams.jsOut))
            .pipe(minify({
                ext:{
                    src:'.debug.js',
                    min:'.min.js'
                }
            }))
            .pipe(gulp.dest(darksightparams.out))
            .pipe(reload({ stream: true }));
    }).done();
});