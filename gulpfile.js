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
    levels: ['common.blocks', 'mobile.blocks'],
    images: 'images/foresight/'
};
var uni2019params = {
    out: 'public',
    cssOut: 'design.uni2019.css',
    jsOut: 'design.uni2019.js',
    htmlOut: 'index.html',
    htmlSrc: 'index.html',
    levels: ['design/uni2019/common.blocks', 'design/uni2019/mobile.blocks'],
    images: 'images/uni2019/'
};
var krmsrvparams = {
    out: 'public',
    cssOut: 'design.krmsrv.css',
    jsOut: 'design.krmsrv.js',
    htmlOut: 'index.html',
    htmlSrc: 'index.html',
    levels: ['design/krmsrv/common.blocks', 'design/krmsrv/mobile.blocks'],
    images: 'images/krmsrv/'
};
var kzk2018params = {
    out: 'public',
    cssOut: 'design.kzk2018.css',
    jsOut: 'design.kzk2018.js',
    htmlOut: 'index.html',
    htmlSrc: 'index.html',
    levels: ['design/kzk2018/common.blocks', 'design/kzk2018/mobile.blocks'],
    images: 'images/kzk2018/'
};
var gazpromparams = {
    out: 'public',
    cssOut: 'design.gazprom.css',
    jsOut: 'design.gazprom.js',
    htmlOut: 'index.html',
    htmlSrc: 'index.html',
    levels: ['design/gazprom/common.blocks', 'design/gazprom/mobile.blocks'],
    images: 'images/gazprom/'
};
var mtk17params = {
    out: 'public',
    cssOut: 'design.mtk17.css',
    jsOut: 'design.mtk17.js',
    htmlOut: 'index.html',
    htmlSrc: 'index.html',
    levels: ['design/mtk17/common.blocks', 'design/mtk17/mobile.blocks'],
    images: 'images/mtk17/'
};
var akimov2018params = {
    out: 'public',
    cssOut: 'design.akimov2018.css',
    jsOut: 'design.akimov2018.js',
    htmlOut: 'index.html',
    htmlSrc: 'index.html',
    levels: ['design/akimov2018/common.blocks', 'design/akimov2018/mobile.blocks'],
    images: 'images/akimov2018/'
};
var golikova2018params = {
    out: 'public',
    cssOut: 'design.golikova2018.css',
    jsOut: 'design.golikova2018.js',
    htmlOut: 'index.html',
    htmlSrc: 'index.html',
    levels: ['design/golikova2018/common.blocks', 'design/golikova2018/mobile.blocks'],
    images: 'images/golikova2018/'
};
var robotomonoparams = {
    out: 'public',
    cssOut: 'design.robotomono.css',
    jsOut: 'design.robotomono.js',
    htmlOut: 'index.html',
    htmlSrc: 'index.html',
    levels: ['design/robotomono/common.blocks', 'design/robotomono/mobile.blocks'],
    images: 'images/robotomono/'
};
var shadowparams = {
    out: 'public',
    cssOut: 'design.shadow.css',
    jsOut: 'design.shadow.js',
    htmlOut: 'index.html',
    htmlSrc: 'index.html',
    levels: ['design/shadow/common.blocks', 'design/shadow/mobile.blocks'],
    images: 'images/shadow/'
};
var darksightparams = {
    out: 'public',
    cssOut: 'design.darksight.css',
    jsOut: 'design.darksight.js',
    htmlOut: 'index.html',
    htmlSrc: 'index.html',
    levels: ['design/darksight/common.blocks', 'design/darksight/mobile.blocks'],
    images: 'images/darksight/'
};
var playparams = {
    out: 'public',
    cssOut: 'design.play.css',
    jsOut: 'design.play.js',
    htmlOut: 'index.html',
    htmlSrc: 'index.html',
    levels: ['design/play/common.blocks', 'design/play/mobile.blocks'],
    images: 'images/play/'
};
var monFSOparams = {
	out: 'public',
	cssOut: 'design.monFSO.css',
	jsOut: 'design.monFSO.js',
	htmlOut: 'index.html',
	htmlSrc: 'index.html',
	levels: ['design/monFSO/common.blocks', 'design/monFSO/mobile.blocks'],
	images: 'images/monFSO/'
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
    'public/third/jquery.countdown.min.js',
    'public/third/fullcalendar-3.9.0/lib/moment.min.js',
    'public/third/fullcalendar-3.9.0/fullcalendar.min.js',
    'public/third/fullcalendar-3.9.0/locale-all.js'
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
    'public/third/lightbox/lightbox.css',
    'public/third/fullcalendar-3.9.0/fullcalendar.min.css'
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
    'public/pages/gridboard.js',
    'public/pages/calendarEvent.js'
];

var getFileNames = require('html2bl').getFileNames(params);
var uniGetFileNames = require('html2bl').getFileNames(uni2019params);
var krmGetFileNames = require('html2bl').getFileNames(krmsrvparams);
var kzkGetFileNames = require('html2bl').getFileNames(kzk2018params);
var gazpromGetFileNames = require('html2bl').getFileNames(gazpromparams);
var mtkGetFileNames = require('html2bl').getFileNames(mtk17params);
var akimovGetFileNames = require('html2bl').getFileNames(akimov2018params);
var golikovaGetFileNames = require('html2bl').getFileNames(golikova2018params);
var robotomonoGetFileNames = require('html2bl').getFileNames(robotomonoparams);
var shadowGetFileNames = require('html2bl').getFileNames(shadowparams);
var darksightGetFileNames = require('html2bl').getFileNames(darksightparams);
var playGetFileNames = require('html2bl').getFileNames(playparams);
var monFSOGetFileNames = require('html2bl').getFileNames(monFSOparams);

gulp.task('default', ['server', 'build', 'misc', 'design']);

/* server */
gulp.task('server', function(){
    browserSync.init({
        server: params.out,
        open: 'local',
        browser: ['google chrome', 'chrome']
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

    /* watch design - krmsrv */
    gulp.watch(krmsrvparams.levels.map(function(level){
        var cssGlob = level + '/**/*.css';
        return cssGlob;
    }), ['krmsrv_css']);
    gulp.watch(krmsrvparams.levels.map(function(level){
        var jsGlob = level + '/**/*.js';
        return jsGlob;
    }), ['krmsrv_js']);

    /* watch design - kzk2018 */
    gulp.watch(kzk2018params.levels.map(function(level){
        var cssGlob = level + '/**/*.css';
        return cssGlob;
    }), ['kzk2018_css']);
    gulp.watch(kzk2018params.levels.map(function(level){
        var jsGlob = level + '/**/*.js';
        return jsGlob;
    }), ['kzk2018_js']);

    /* watch design - gazprom */
    gulp.watch(gazpromparams.levels.map(function(level){
        var cssGlob = level + '/**/*.css';
        return cssGlob;
    }), ['gazprom_css']);
    gulp.watch(gazpromparams.levels.map(function(level){
        var jsGlob = level + '/**/*.js';
        return jsGlob;
    }), ['gazprom_js']);

    /* watch design - mtk17 */
    gulp.watch(mtk17params.levels.map(function(level){
        var cssGlob = level + '/**/*.css';
        return cssGlob;
    }), ['mtk17_css']);
    gulp.watch(mtk17params.levels.map(function(level){
        var jsGlob = level + '/**/*.js';
        return jsGlob;
    }), ['mtk17_js']);

    /* watch design - akimov2018 */
    gulp.watch(akimov2018params.levels.map(function(level){
        var cssGlob = level + '/**/*.css';
        return cssGlob;
    }), ['akimov2018_css']);
    gulp.watch(akimov2018params.levels.map(function(level){
        var jsGlob = level + '/**/*.js';
        return jsGlob;
    }), ['akimov2018_js']);

    /* watch design - golikova2018 */
    gulp.watch(golikova2018params.levels.map(function(level){
        var cssGlob = level + '/**/*.css';
        return cssGlob;
    }), ['golikova2018_css']);
    gulp.watch(golikova2018params.levels.map(function(level){
        var jsGlob = level + '/**/*.js';
        return jsGlob;
    }), ['golikova2018_js']);

    /* watch design - robotomono */
    gulp.watch(robotomonoparams.levels.map(function(level){
        var cssGlob = level + '/**/*.css';
        return cssGlob;
    }), ['robotomono_css']);
    gulp.watch(robotomonoparams.levels.map(function(level){
        var jsGlob = level + '/**/*.js';
        return jsGlob;
    }), ['robotomono_js']);

    /* watch design - shadow */
    gulp.watch(shadowparams.levels.map(function(level){
        var cssGlob = level + '/**/*.css';
        return cssGlob;
    }), ['shadow_css']);
    gulp.watch(shadowparams.levels.map(function(level){
        var jsGlob = level + '/**/*.js';
        return jsGlob;
    }), ['shadow_js']);

    /* watch design - darksight */
    gulp.watch(darksightparams.levels.map(function(level){
        var cssGlob = level + '/**/*.css';
        return cssGlob;
    }), ['darksight_css']);
    gulp.watch(darksightparams.levels.map(function(level){
        var jsGlob = level + '/**/*.js';
        return jsGlob;
    }), ['darksight_js']);

    /* watch design - monFSO */
    gulp.watch(monFSOparams.levels.map(function(level){
        var cssGlob = level + '/**/*.css';
        return cssGlob;
    }), ['monFSO_css']);
    gulp.watch(monFSOparams.levels.map(function(level){
        var jsGlob = level + '/**/*.js';
        return jsGlob;
    }), ['monFSO_js']);
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
            .pipe(url({ prepend: params.images }))
            .pipe(postcss([ autoprefixer() ]))
            .pipe(gulp.dest(params.out))
            .pipe(reload({ stream: true }));
    }).done();

    getFileNames.then(function(files){
        gulp.src(files.css)
            .pipe(concat(params.cssOut))
            .pipe(url({ prepend: params.images }))
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
            var imgGlob = path.resolve(dir) + '/*.{jpg,png,svg,ico}';
            return imgGlob;
        })).pipe(gulp.dest(path.join(params.out, params.images)));
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
gulp.task('design', ['uni2019', 'krmsrv', 'kzk2018', 'gazprom', 'mtk17', 'akimov2018', 'golikova2018',
    'robotomono', 'shadow', 'darksight', 'play', 'monFSO']);

/* uni2019 */
gulp.task('uni2019', ['uni2019_css', 'uni2019_images', 'uni2019_js']);
gulp.task('uni2019_css', function(){
    uniGetFileNames.then(function(files){
        gulp.src(files.css)
            .pipe(concat(uni2019params.cssOut))
            .pipe(url({ prepend: uni2019params.images }))
            .pipe(postcss([ autoprefixer() ]))
            .pipe(gulp.dest(uni2019params.out))
            .pipe(reload({ stream: true }));
    }).done();
    uniGetFileNames.then(function(files){
        gulp.src(files.css)
            .pipe(concat(uni2019params.cssOut))
            .pipe(url({ prepend: uni2019params.images }))
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
            var imgGlob = path.resolve(dir) + '/*.{jpg,png,svg,ico}';
            return imgGlob;
        })).pipe(gulp.dest(path.join(uni2019params.out, uni2019params.images)));
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

/* krm2018 */
gulp.task('krmsrv', ['krmsrv_css', 'krmsrv_images', 'krmsrv_js']);
gulp.task('krmsrv_css', function(){
    krmGetFileNames.then(function(files){
        gulp.src(files.css)
            .pipe(concat(krmsrvparams.cssOut))
            .pipe(url({ prepend: krmsrvparams.images }))
            .pipe(postcss([ autoprefixer() ]))
            .pipe(gulp.dest(krmsrvparams.out))
            .pipe(reload({ stream: true }));
    }).done();
    krmGetFileNames.then(function(files){
        gulp.src(files.css)
            .pipe(concat(krmsrvparams.cssOut))
            .pipe(url({ prepend: krmsrvparams.images }))
            .pipe(postcss([ autoprefixer() ]))
            .pipe(cleancss({ debug: true, compatibility: 'ie8' }, function(details) {
                console.log(details.name + ': ' + details.stats.originalSize);
                console.log(details.name + ': ' + details.stats.minifiedSize);
            }))
            .pipe(rename({suffix: '.min'}))
            .pipe(gulp.dest(krmsrvparams.out))
            .pipe(reload({ stream: true }));
    }).done();
});
gulp.task('krmsrv_images', function(){
    krmGetFileNames.then(function(source){
        gulp.src(source.dirs.map(function(dir){
            var imgGlob = path.resolve(dir) + '/*.{jpg,png,svg,ico}';
            return imgGlob;
        })).pipe(gulp.dest(path.join(krmsrvparams.out, krmsrvparams.images)));
    }).done();
});
gulp.task('krmsrv_js', function() {
    krmGetFileNames.then(function(src){
        return src.dirs.map(function(dir){
            var jsGlob = path.resolve(dir) + '/*.js';
            return jsGlob;
        });
    }).then(function(jsGlobs){
        gulp.src(jsGlobs)
            .pipe(concat(krmsrvparams.jsOut))
            .pipe(minify({
                ext:{
                    src:'.debug.js',
                    min:'.min.js'
                }
            }))
            .pipe(gulp.dest(krmsrvparams.out))
            .pipe(reload({ stream: true }));
    }).done();
});

/* kzk2018 */
gulp.task('kzk2018', ['kzk2018_css', 'kzk2018_images', 'kzk2018_js']);
gulp.task('kzk2018_css', function(){
    kzkGetFileNames.then(function(files){
        gulp.src(files.css)
            .pipe(concat(kzk2018params.cssOut))
            .pipe(url({ prepend: kzk2018params.images }))
            .pipe(postcss([ autoprefixer() ]))
            .pipe(gulp.dest(kzk2018params.out))
            .pipe(reload({ stream: true }));
    }).done();
    kzkGetFileNames.then(function(files){
        gulp.src(files.css)
            .pipe(concat(kzk2018params.cssOut))
            .pipe(url({ prepend: kzk2018params.images }))
            .pipe(postcss([ autoprefixer() ]))
            .pipe(cleancss({ debug: true, compatibility: 'ie8' }, function(details) {
                console.log(details.name + ': ' + details.stats.originalSize);
                console.log(details.name + ': ' + details.stats.minifiedSize);
            }))
            .pipe(rename({suffix: '.min'}))
            .pipe(gulp.dest(kzk2018params.out))
            .pipe(reload({ stream: true }));
    }).done();
});
gulp.task('kzk2018_images', function(){
    kzkGetFileNames.then(function(source){
        gulp.src(source.dirs.map(function(dir){
            var imgGlob = path.resolve(dir) + '/*.{jpg,png,svg,ico}';
            return imgGlob;
        })).pipe(gulp.dest(path.join(kzk2018params.out, kzk2018params.images)));
    }).done();
});
gulp.task('kzk2018_js', function() {
    kzkGetFileNames.then(function(src){
        return src.dirs.map(function(dir){
            var jsGlob = path.resolve(dir) + '/*.js';
            return jsGlob;
        });
    }).then(function(jsGlobs){
        gulp.src(jsGlobs)
            .pipe(concat(kzk2018params.jsOut))
            .pipe(minify({
                ext:{
                    src:'.debug.js',
                    min:'.min.js'
                }
            }))
            .pipe(gulp.dest(kzk2018params.out))
            .pipe(reload({ stream: true }));
    }).done();
});

/* gazprom */
gulp.task('gazprom', ['gazprom_css', 'gazprom_images', 'gazprom_js']);
gulp.task('gazprom_css', function(){
    gazpromGetFileNames.then(function(files){
        gulp.src(files.css)
            .pipe(concat(gazpromparams.cssOut))
            .pipe(url({ prepend: gazpromparams.images }))
            .pipe(postcss([ autoprefixer() ]))
            .pipe(gulp.dest(gazpromparams.out))
            .pipe(reload({ stream: true }));
    }).done();
    gazpromGetFileNames.then(function(files){
        gulp.src(files.css)
            .pipe(concat(gazpromparams.cssOut))
            .pipe(url({ prepend: gazpromparams.images }))
            .pipe(postcss([ autoprefixer() ]))
            .pipe(cleancss({ debug: true, compatibility: 'ie8' }, function(details) {
                console.log(details.name + ': ' + details.stats.originalSize);
                console.log(details.name + ': ' + details.stats.minifiedSize);
            }))
            .pipe(rename({suffix: '.min'}))
            .pipe(gulp.dest(gazpromparams.out))
            .pipe(reload({ stream: true }));
    }).done();
});
gulp.task('gazprom_images', function(){
    gazpromGetFileNames.then(function(source){
        gulp.src(source.dirs.map(function(dir){
            var imgGlob = path.resolve(dir) + '/*.{jpg,png,svg,ico}';
            return imgGlob;
        })).pipe(gulp.dest(path.join(gazpromparams.out, gazpromparams.images)));
    }).done();
});
gulp.task('gazprom_js', function() {
    gazpromGetFileNames.then(function(src){
        return src.dirs.map(function(dir){
            var jsGlob = path.resolve(dir) + '/*.js';
            return jsGlob;
        });
    }).then(function(jsGlobs){
        gulp.src(jsGlobs)
            .pipe(concat(gazpromparams.jsOut))
            .pipe(minify({
                ext:{
                    src:'.debug.js',
                    min:'.min.js'
                }
            }))
            .pipe(gulp.dest(gazpromparams.out))
            .pipe(reload({ stream: true }));
    }).done();
});

/* mtk17 */
gulp.task('mtk17', ['mtk17_css', 'mtk17_images', 'mtk17_js']);
gulp.task('mtk17_css', function(){
    mtkGetFileNames.then(function(files){
        gulp.src(files.css)
            .pipe(concat(mtk17params.cssOut))
            .pipe(url({ prepend: mtk17params.images }))
            .pipe(postcss([ autoprefixer() ]))
            .pipe(gulp.dest(mtk17params.out))
            .pipe(reload({ stream: true }));
    }).done();
    mtkGetFileNames.then(function(files){
        gulp.src(files.css)
            .pipe(concat(mtk17params.cssOut))
            .pipe(url({ prepend: mtk17params.images }))
            .pipe(postcss([ autoprefixer() ]))
            .pipe(cleancss({ debug: true, compatibility: 'ie8' }, function(details) {
                console.log(details.name + ': ' + details.stats.originalSize);
                console.log(details.name + ': ' + details.stats.minifiedSize);
            }))
            .pipe(rename({suffix: '.min'}))
            .pipe(gulp.dest(mtk17params.out))
            .pipe(reload({ stream: true }));
    }).done();
});
gulp.task('mtk17_images', function(){
    mtkGetFileNames.then(function(source){
        gulp.src(source.dirs.map(function(dir){
            var imgGlob = path.resolve(dir) + '/*.{jpg,png,svg,ico}';
            return imgGlob;
        })).pipe(gulp.dest(path.join(mtk17params.out, mtk17params.images)));
    }).done();
});
gulp.task('mtk17_js', function() {
    mtkGetFileNames.then(function(src){
        return src.dirs.map(function(dir){
            var jsGlob = path.resolve(dir) + '/*.js';
            return jsGlob;
        });
    }).then(function(jsGlobs){
        gulp.src(jsGlobs)
            .pipe(concat(mtk17params.jsOut))
            .pipe(minify({
                ext:{
                    src:'.debug.js',
                    min:'.min.js'
                }
            }))
            .pipe(gulp.dest(mtk17params.out))
            .pipe(reload({ stream: true }));
    }).done();
});

/* akimov2018 */
gulp.task('akimov2018', ['akimov2018_css', 'akimov2018_images', 'akimov2018_js']);
gulp.task('akimov2018_css', function(){
    akimovGetFileNames.then(function(files){
        gulp.src(files.css)
            .pipe(concat(akimov2018params.cssOut))
            .pipe(url({ prepend: akimov2018params.images }))
            .pipe(postcss([ autoprefixer() ]))
            .pipe(gulp.dest(akimov2018params.out))
            .pipe(reload({ stream: true }));
    }).done();
    akimovGetFileNames.then(function(files){
        gulp.src(files.css)
            .pipe(concat(akimov2018params.cssOut))
            .pipe(url({ prepend: akimov2018params.images }))
            .pipe(postcss([ autoprefixer() ]))
            .pipe(cleancss({ debug: true, compatibility: 'ie8' }, function(details) {
                console.log(details.name + ': ' + details.stats.originalSize);
                console.log(details.name + ': ' + details.stats.minifiedSize);
            }))
            .pipe(rename({suffix: '.min'}))
            .pipe(gulp.dest(akimov2018params.out))
            .pipe(reload({ stream: true }));
    }).done();
});
gulp.task('akimov2018_images', function(){
    akimovGetFileNames.then(function(source){
        gulp.src(source.dirs.map(function(dir){
            var imgGlob = path.resolve(dir) + '/*.{jpg,png,svg,ico}';
            return imgGlob;
        })).pipe(gulp.dest(path.join(akimov2018params.out, akimov2018params.images)));
    }).done();
});
gulp.task('akimov2018_js', function() {
    akimovGetFileNames.then(function(src){
        return src.dirs.map(function(dir){
            var jsGlob = path.resolve(dir) + '/*.js';
            return jsGlob;
        });
    }).then(function(jsGlobs){
        gulp.src(jsGlobs)
            .pipe(concat(akimov2018params.jsOut))
            .pipe(minify({
                ext:{
                    src:'.debug.js',
                    min:'.min.js'
                }
            }))
            .pipe(gulp.dest(akimov2018params.out))
            .pipe(reload({ stream: true }));
    }).done();
});

/* golikova2018 */
gulp.task('golikova2018', ['golikova2018_css', 'golikova2018_images', 'golikova2018_js']);
gulp.task('golikova2018_css', function(){
    golikovaGetFileNames.then(function(files){
        gulp.src(files.css)
            .pipe(concat(golikova2018params.cssOut))
            .pipe(url({ prepend: golikova2018params.images }))
            .pipe(postcss([ autoprefixer() ]))
            .pipe(gulp.dest(golikova2018params.out))
            .pipe(reload({ stream: true }));
    }).done();
    golikovaGetFileNames.then(function(files){
        gulp.src(files.css)
            .pipe(concat(golikova2018params.cssOut))
            .pipe(url({ prepend: golikova2018params.images }))
            .pipe(postcss([ autoprefixer() ]))
            .pipe(cleancss({ debug: true, compatibility: 'ie8' }, function(details) {
                console.log(details.name + ': ' + details.stats.originalSize);
                console.log(details.name + ': ' + details.stats.minifiedSize);
            }))
            .pipe(rename({suffix: '.min'}))
            .pipe(gulp.dest(golikova2018params.out))
            .pipe(reload({ stream: true }));
    }).done();
});
gulp.task('golikova2018_images', function(){
    golikovaGetFileNames.then(function(source){
        gulp.src(source.dirs.map(function(dir){
            var imgGlob = path.resolve(dir) + '/*.{jpg,png,svg,ico}';
            return imgGlob;
        })).pipe(gulp.dest(path.join(golikova2018params.out, golikova2018params.images)));
    }).done();
});
gulp.task('golikova2018_js', function() {
    golikovaGetFileNames.then(function(src){
        return src.dirs.map(function(dir){
            var jsGlob = path.resolve(dir) + '/*.js';
            return jsGlob;
        });
    }).then(function(jsGlobs){
        gulp.src(jsGlobs)
            .pipe(concat(golikova2018params.jsOut))
            .pipe(minify({
                ext:{
                    src:'.debug.js',
                    min:'.min.js'
                }
            }))
            .pipe(gulp.dest(golikova2018params.out))
            .pipe(reload({ stream: true }));
    }).done();
});

/* robotomono */
gulp.task('robotomono', ['robotomono_css']);
gulp.task('robotomono_css', function(){
    robotomonoGetFileNames.then(function(files){
        gulp.src(files.css)
            .pipe(concat(robotomonoparams.cssOut))
            .pipe(url({ prepend: robotomonoparams.images }))
            .pipe(postcss([ autoprefixer() ]))
            .pipe(gulp.dest(robotomonoparams.out))
            .pipe(reload({ stream: true }));
    }).done();
    robotomonoGetFileNames.then(function(files){
        gulp.src(files.css)
            .pipe(concat(robotomonoparams.cssOut))
            .pipe(url({ prepend: robotomonoparams.images }))
            .pipe(postcss([ autoprefixer() ]))
            .pipe(cleancss({ debug: true, compatibility: 'ie8' }, function(details) {
                console.log(details.name + ': ' + details.stats.originalSize);
                console.log(details.name + ': ' + details.stats.minifiedSize);
            }))
            .pipe(rename({suffix: '.min'}))
            .pipe(gulp.dest(robotomonoparams.out))
            .pipe(reload({ stream: true }));
    }).done();
});

/* shadow */
gulp.task('shadow', ['shadow_css', 'shadow_images', 'shadow_js']);
gulp.task('shadow_css', function(){
    shadowGetFileNames.then(function(files){
        gulp.src(files.css)
            .pipe(concat(shadowparams.cssOut))
            .pipe(url({ prepend: shadowparams.images }))
            .pipe(postcss([ autoprefixer() ]))
            .pipe(gulp.dest(shadowparams.out))
            .pipe(reload({ stream: true }));
    }).done();
    shadowGetFileNames.then(function(files){
        gulp.src(files.css)
            .pipe(concat(shadowparams.cssOut))
            .pipe(url({ prepend: shadowparams.images }))
            .pipe(postcss([ autoprefixer() ]))
            .pipe(cleancss({ debug: true, compatibility: 'ie8' }, function(details) {
                console.log(details.name + ': ' + details.stats.originalSize);
                console.log(details.name + ': ' + details.stats.minifiedSize);
            }))
            .pipe(rename({suffix: '.min'}))
            .pipe(gulp.dest(shadowparams.out))
            .pipe(reload({ stream: true }));
    }).done();
});
gulp.task('shadow_images', function(){
    shadowGetFileNames.then(function(source){
        gulp.src(source.dirs.map(function(dir){
            var imgGlob = path.resolve(dir) + '/*.{jpg,png,svg,ico}';
            return imgGlob;
        })).pipe(gulp.dest(path.join(shadowparams.out, shadowparams.images)));
    }).done();
});
gulp.task('shadow_js', function() {
    shadowGetFileNames.then(function(src){
        return src.dirs.map(function(dir){
            var jsGlob = path.resolve(dir) + '/*.js';
            return jsGlob;
        });
    }).then(function(jsGlobs){
        gulp.src(jsGlobs)
            .pipe(concat(shadowparams.jsOut))
            .pipe(minify({
                ext:{
                    src:'.debug.js',
                    min:'.min.js'
                }
            }))
            .pipe(gulp.dest(shadowparams.out))
            .pipe(reload({ stream: true }));
    }).done();
});

/* darksight */
gulp.task('darksight', ['darksight_css', 'darksight_images', 'darksight_js']);
gulp.task('darksight_css', function(){
    darksightGetFileNames.then(function(files){
        gulp.src(files.css)
            .pipe(concat(darksightparams.cssOut))
            .pipe(url({ prepend: darksightparams.images }))
            .pipe(postcss([ autoprefixer() ]))
            .pipe(gulp.dest(darksightparams.out))
            .pipe(reload({ stream: true }));
    }).done();
    darksightGetFileNames.then(function(files){
        gulp.src(files.css)
            .pipe(concat(darksightparams.cssOut))
            .pipe(url({ prepend: darksightparams.images }))
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
    darksightGetFileNames.then(function(source){
        gulp.src(source.dirs.map(function(dir){
            var imgGlob = path.resolve(dir) + '/*.{jpg,png,svg,ico}';
            return imgGlob;
        })).pipe(gulp.dest(path.join(darksightparams.out, darksightparams.images)));
    }).done();
});
gulp.task('darksight_js', function() {
    darksightGetFileNames.then(function(src){
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

/* play */
gulp.task('play', ['play_css']);
gulp.task('play_css', function(){
    playGetFileNames.then(function(files){
        gulp.src(files.css)
            .pipe(concat(playparams.cssOut))
            .pipe(url({ prepend: playparams.images }))
            .pipe(postcss([ autoprefixer() ]))
            .pipe(gulp.dest(playparams.out))
            .pipe(reload({ stream: true }));
    }).done();
    playGetFileNames.then(function(files){
        gulp.src(files.css)
            .pipe(concat(playparams.cssOut))
            .pipe(url({ prepend: playparams.images }))
            .pipe(postcss([ autoprefixer() ]))
            .pipe(cleancss({ debug: true, compatibility: 'ie8' }, function(details) {
                console.log(details.name + ': ' + details.stats.originalSize);
                console.log(details.name + ': ' + details.stats.minifiedSize);
            }))
            .pipe(rename({suffix: '.min'}))
            .pipe(gulp.dest(playparams.out))
            .pipe(reload({ stream: true }));
    }).done();
});

/* monFSO */
gulp.task('monFSO', ['monFSO_css', 'monFSO_images', 'monFSO_js']);
gulp.task('monFSO_css', function(){
	monFSOGetFileNames.then(function(files){
		gulp.src(files.css)
			.pipe(concat(monFSOparams.cssOut))
			.pipe(url({ prepend: monFSOparams.images }))
			.pipe(postcss([ autoprefixer() ]))
			.pipe(gulp.dest(monFSOparams.out))
			.pipe(reload({ stream: true }));
	}).done();
	monFSOGetFileNames.then(function(files){
		gulp.src(files.css)
			.pipe(concat(monFSOparams.cssOut))
			.pipe(url({ prepend: monFSOparams.images }))
			.pipe(postcss([ autoprefixer() ]))
			.pipe(cleancss({ debug: true, compatibility: 'ie8' }, function(details) {
				console.log(details.name + ': ' + details.stats.originalSize);
				console.log(details.name + ': ' + details.stats.minifiedSize);
			}))
			.pipe(rename({suffix: '.min'}))
			.pipe(gulp.dest(monFSOparams.out))
			.pipe(reload({ stream: true }));
	}).done();
});
gulp.task('monFSO_images', function(){
	monFSOGetFileNames.then(function(source){
		gulp.src(source.dirs.map(function(dir){
			var imgGlob = path.resolve(dir) + '/*.{jpg,png,svg,ico}';
			return imgGlob;
		})).pipe(gulp.dest(path.join(monFSOparams.out, monFSOparams.images)));
	}).done();
});
gulp.task('monFSO_js', function() {
	monFSOGetFileNames.then(function(src){
		return src.dirs.map(function(dir){
			var jsGlob = path.resolve(dir) + '/*.js';
			return jsGlob;
		});
	}).then(function(jsGlobs){
		gulp.src(jsGlobs)
			.pipe(concat(monFSOparams.jsOut))
			.pipe(minify({
				ext:{
					src:'.debug.js',
					min:'.min.js'
				}
			}))
			.pipe(gulp.dest(monFSOparams.out))
			.pipe(reload({ stream: true }));
	}).done();
});
