const gulp = require("gulp");

const uglify = require("gulp-uglify");
const cleanCss = require("gulp-clean-css");
const rename = require("gulp-rename");
var concat = require('gulp-concat');
const del = require("del");
const zip = require("gulp-zip");

// PATHS

const sources = "src/";
const output = "build/";
const packages = "packages/";
const allFiles = "**/*";
const notJsFiles = "**/!(*.js)"

const apiJsFile = sources + "api.js";
const mainJsFile = "igemutato.js";
const minMainJsFile = "igemutato.min.js";
const cssFile = "igemutato.css";
const minCssFile = "igemutato.min.css";
const startJsFile = "start.js";

const browserDir = "webextension/";
const browserZipFile = "extension.zip";
const backgroundJs = 'background.js';

const webDir = "web/";

const wordPressDir = "wordpress/";

gulp.task("copy-css", function () {
    return gulp.src(sources + cssFile)
        .pipe(gulp.dest(output))
        .pipe(cleanCss({ compatibility: "ie8" }))
        .pipe(rename(minCssFile))
        .pipe(gulp.dest(output));
});

// BROWSER

gulp.task("clean-browser", function () {
    return del.deleteAsync(output + browserDir);
});

gulp.task("transform-js-browser", function (){
    return gulp.src([apiJsFile, sources + browserDir + backgroundJs])
    .pipe(concat(backgroundJs))
    .pipe(gulp.dest(output + browserDir))
});

gulp.task("copy-src-browser", gulp.series("transform-js-browser", function () {
    return gulp.src([sources + browserDir + '**/!(' + backgroundJs + ')', sources + mainJsFile])
        .pipe(gulp.dest(output + browserDir));
}));

gulp.task("prepare-browser", gulp.series(gulp.parallel("copy-css", "copy-src-browser"), function () {
    return gulp.src(output + cssFile)
        .pipe(gulp.dest(output + browserDir));
}));
gulp.task("build-browser", gulp.series("prepare-browser", function () {
    return gulp.src(output + browserDir + allFiles)
        .pipe(zip(browserZipFile))
        .pipe(gulp.dest(packages));
}));

// WEB

gulp.task("clean-web", function () {
    return del.deleteAsync(output + webDir);
});

gulp.task("transform-js-web", function () {
    return gulp.src([ apiJsFile, sources + mainJsFile, sources + webDir + startJsFile])
        .pipe(concat(mainJsFile))
        .pipe(gulp.dest(output + webDir));
});

gulp.task("minify-js-web", gulp.series("transform-js-web", function () {
    return minifyJs(output + webDir);
}));

gulp.task("build-web", gulp.series(gulp.parallel("copy-css", "minify-js-web"), function () {
    return gulp.src(output + minCssFile)
        .pipe(gulp.dest(output + webDir));
}));

// WORDPRESS

gulp.task("clean-wordpress", function () {
    return del.deleteAsync(output + wordPressDir);
});

gulp.task("copy-src-wordpress", function () {
    return gulp.src(sources + wordPressDir + notJsFiles)
        .pipe(gulp.dest(output + wordPressDir));
});

gulp.task("transform-js-wordpress", gulp.series("copy-src-wordpress", function () {
    return gulp.src([apiJsFile, sources + mainJsFile, sources + wordPressDir + startJsFile])
        .pipe(concat(mainJsFile))
        .pipe(gulp.dest(output + wordPressDir));
}));

gulp.task("minify-js-wordpress", gulp.series("transform-js-wordpress", function () {
    return minifyJs(output + wordPressDir);
}));

gulp.task("prepare-wordpress", gulp.series(gulp.parallel("copy-css", "minify-js-wordpress"), function () {
    return gulp.src(output + minCssFile)
        .pipe(gulp.dest(output + wordPressDir));
}));

gulp.task("build-wordpress", gulp.series("prepare-wordpress", function () {
    return gulp.src(output + wordPressDir + allFiles)
        .pipe(zip('wordpress.zip'))
        .pipe(gulp.dest(packages));
}));

// COMMON TASKS

gulp.task("clean", gulp.series(gulp.parallel("clean-browser", "clean-web", "clean-wordpress"), function () {
    return del.deleteAsync([output + allFiles, packages + allFiles]);
}));
gulp.task("build", gulp.parallel("build-browser", "build-web", "build-wordpress"));

// UTILITIES

function minifyJs(dir) {
    gulp.src(dir + mainJsFile)
        .pipe(uglify())
        .pipe(rename(minMainJsFile))
        .pipe(gulp.dest(dir));
    return del.deleteAsync(dir + mainJsFile);
}