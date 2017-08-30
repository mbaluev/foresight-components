var fs = require("fs");
var gulp = require("gulp");
var concat = require("gulp-concat");
var sourcemaps = require("gulp-sourcemaps");
var del = require("del");
var csso = require("gulp-csso");
var uglify = require("gulp-uglify");
var jshint = require("gulp-jshint");

var cssFiles = [
    "../css/animate.css",
    "../css/bootstrap.css",
    "../css/bootstrap-modal.css",
    /*"css/bootstrap-responsive.css",*/
    "../gritter/css/jquery.gritter.css",
    "../css/datepicker.css",
    "../chosen/chosen.css",
    "../slickgrid/slick.grid.css",
    "../slickgrid/controls/slick.pager.css",
    "../slickgrid/controls/slick.columnpicker.css",
    "../timeline/jquery.timeline.widget.css",
    "../jsControls/zTree/css/metroStyle.css",
    "../jsControls/jsTreeCombobox/treeComboBox.css"
];
/*
 gritter,
 chosen
 slick
 timeline
 jsControls
 либо залить картинки в общее место, либо перебить ссылки в cssках
 */

var jsFiles = [
    "../js/jquery-1.11.1.js",
    "../js/jquery-migrate-1.2.1.js",
    "../js/jquery-ui.1.11.1.min.js",
    "../js/jquery.event.drag-2.2.js",
    "../gritter/js/jquery.gritter.js",
    "../js/bootstrap.min.js",
    "../js/bootstrap-datepicker.js",
    "../js/bootstrap-modal.js",
    "../js/bootstrap-modalmanager.js",
    "../chosen/chosen.jquery.js",
    "../slickgrid/slick.core.js",
    "../slickgrid/slick.formatters.js",
    "../slickgrid/slick.editors.js",
    "../slickgrid/plugins/slick.cellrangeselector.js",
    "../slickgrid/plugins/slick.cellselectionmodel.js",
    "../slickgrid/plugins/slick.rowselectionmodel.js",
    "../slickgrid/plugins/asyst.rowselectionmodel.js",
    "../slickgrid/plugins/slick.checkboxselectcolumn.js",
    "../slickgrid/slick.grid.js",
    "../slickgrid/slick.groupitemmetadataprovider.js",
    "../slickgrid/slick.dataview.js",
    "../slickgrid/controls/slick.pager.js",
    "../slickgrid/controls/slick.columnpicker.js",
    "../js/fileuploader.js",
    "../js/highcharts.js",
    "../js/modules/exporting.js",
    "../timeline/jquery.timeline.widget.js",
    "../comments/jquery.comments.widget.js",
    "../js/linq.min.js",
    "../js/jquery.sparkline.min.js",
    "../js/numeral.min.js",
    "../js/jszip.min.js",
    "../js/xlsx.js",
    "../js/FileSaver.js",
    "../jsControls/zTree/js/jquery.ztree.all-3.5.min.js",
    "../jsControls/zTree/js/jquery.ztree.exhide-3.5.custom.js",
    "../jsControls/jsTreeCombobox/tree.class.js",
    "../jsControls/jsTreeCombobox/dataRows.class.js",
    "../jsControls/jsTreeCombobox/treeComboBox.js"
];

gulp.task("build:css", function(callback){
    gulp.src(cssFiles)
        .pipe(sourcemaps.init())
        .pipe(concat("asyst.third.css"))
        //.pipe(csso())
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest("../css/"));
    return gulp.src(cssFiles)
        .pipe(sourcemaps.init())
        .pipe(concat("asyst.third.min.css"))
        .pipe(csso())
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest("../css/"));

});

gulp.task("build_full:js", function(callback){
    /* собираем полную версию */
    return gulp.src(jsFiles)
        .pipe(sourcemaps.init())
        .pipe(concat("asyst.third.js"))
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest("../js/"));
});

gulp.task("build_without_modal:js", function(callback){
    /* собираем версию-2 без модал-модалменеджера */
    for (var i = 0; i < jsFiles.length; i++) {
        if (jsFiles[i].indexOf("bootstrap-modal") >= 0) {
            jsFiles.splice(i, 1);
            i--;
        }
    }
    return gulp.src(jsFiles)
        .pipe(sourcemaps.init())
        //.pipe(jshint())
        //.pipe(jshint.reporter("fail"))
        .pipe(uglify())
        .pipe(concat("asyst.third_2.js"))
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest("../js/"));
    // //надо делать два набора - с модал-модал-менеджером и без них. (кстати второй еще и ужать получиться)
});

gulp.task("clean", function () {
    return del(["../js/asyst.third.*", "../css/asyst.third.*"], {
        force: true
    }).then(function(paths){
        console.log('Deleted files and folders:\n', paths.join('\n'));
    });
});

//region application.js

var applicationComponents = [
    "util.js",
    "dynamic.js",
    "cookie.js",
    "dialog.js",
    "notify.js",
    "loader.js",
    "dependentCombobox.js",
    "chat.js",
    "grid.js",
    "gantt.js",
    "timeline.js",
    "exportToWord.js",
    "callService.js",
    "view.js"
];

gulp.task("applicationJs",function(){
    var basePath = "../js/application/";

    fs.readdir(basePath,function(err,fileNames){
       if(fileNames.length !== applicationComponents.length){
           console.warn("Количество компонентов включаемых в сборку не совпадает с количеством файлов компонентов");
           console.warn("Не включены следующие файлы");
           fileNames.forEach(function(name){
              if(applicationComponents.indexOf(name) === -1){
                  console.warn("- "+name);
              }
           });
       }
    });

    var componentsPath = applicationComponents.map(function(name){
       return basePath + name;
    });

    var applicationJsPath = "../js/application.js";
    if(fs.existsSync(applicationJsPath)){
        fs.unlinkSync(applicationJsPath);
    }

    gulp.src(componentsPath)
        .pipe(concat("application.js"))
        .pipe(gulp.dest("../js/"));
});
//endregion

gulp.task("default", ["clean", "build_full:js", "build_without_modal:js", "build:css"]);