const gulp = require("gulp");

const uglify = require("gulp-uglify");
const cleanCss = require("gulp-clean-css");
const rename = require("gulp-rename");
var concat = require('gulp-concat');
const del = require("del");
const zip = require("gulp-zip");
var open = require('gulp-open');

const debug = require("gulp-debug");

// PATHS

const sources = "src/";
const output = "build/";
const packages = "packages/";
const tests = "test/";
const allFiles = "**/*";
const notJsFiles = "**/!(*.js)"

const mainJsFile = "igemutato.js";
const minMainJsFile = "igemutato.min.js";
const cssFile = "igemutato.css";
const minCssFile = "igemutato.min.css";
const startJsFile = "start.js";

const browserDir = "webextension/";
const browserZipFile = "extension.zip";

const webDir = "web/";

const wordPressDir = "wordpress/";

// COMMON TASKS

gulp.task("copy-css", function () {
    return gulp.src(sources + cssFile)
        .pipe(gulp.dest(output))
        .pipe(cleanCss({ compatibility: "ie8" }))
        .pipe(rename(minCssFile))
        .pipe(gulp.dest(output));
});

gulp.task("clean", ["clean-browser", "clean-web", "clean-wordpress"], function () {
    return del([output + allFiles, packages + allFiles]);
});
gulp.task("build", ["build-browser", "build-web", "build-wordpress"]);

// BROWSER

gulp.task("clean-browser", function () {
    return del(output + browserDir);
});

gulp.task("copy-src-browser", function () {
    return gulp.src([sources + browserDir + allFiles, sources + mainJsFile])
        .pipe(gulp.dest(output + browserDir));
});

gulp.task("prepare-browser", ["copy-css", "copy-src-browser"], function () {
    return gulp.src(output + cssFile)
        .pipe(gulp.dest(output + browserDir));
});
gulp.task("build-browser", ["prepare-browser"], function () {
    return gulp.src(output + browserDir + allFiles)
        .pipe(zip(browserZipFile))
        .pipe(gulp.dest(packages));
});

// WEB

gulp.task("clean-web", function () {
    return del(output + webDir);
});

gulp.task("transform-js-web", function () {
    return gulp.src([sources + mainJsFile, sources + webDir + startJsFile])
        .pipe(concat(mainJsFile))
        .pipe(gulp.dest(output + webDir));
});

gulp.task("minify-js-web", ["transform-js-web"], function () {
    return minifyJs(output + webDir);
});

gulp.task("build-web", ["copy-css", "minify-js-web"], function () {
    return gulp.src(output + minCssFile)
        .pipe(gulp.dest(output + webDir));
});

// WORDPRESS

gulp.task("clean-wordpress", function () {
    return del(output + wordPressDir);
});

gulp.task("copy-src-wordpress", function () {
    return gulp.src(sources + wordPressDir + notJsFiles)
        .pipe(gulp.dest(output + wordPressDir));
});

gulp.task("transform-js-wordpress", ["copy-src-wordpress"], function () {
    return gulp.src([sources + mainJsFile, sources + wordPressDir + startJsFile])
        .pipe(concat(mainJsFile))
        .pipe(gulp.dest(output + wordPressDir));
});

gulp.task("minify-js-wordpress", ["transform-js-wordpress"], function () {
    return minifyJs(output + wordPressDir);
});

gulp.task("prepare-wordpress", ["copy-css", "minify-js-wordpress"], function () {
    return gulp.src(output + minCssFile)
        .pipe(gulp.dest(output + wordPressDir));
});

gulp.task("build-wordpress", ["prepare-wordpress"], function () {
    return gulp.src(output + wordPressDir + allFiles)
        .pipe(zip('wordpress.zip'))
        .pipe(gulp.dest(packages));
});

// UTILITIES

function minifyJs(dir) {
    gulp.src(dir + mainJsFile)
        .pipe(uglify())
        .pipe(rename(minMainJsFile))
        .pipe(gulp.dest(dir));
    del(dir + mainJsFile);
}

// TESTING

gulp.task("open-chrome", function () {
    gulp.src(tests + 'test.html')
        .pipe(open({ app: 'chrome' }));
});

gulp.task("open-firefox", function () {
    gulp.src(tests + 'test.html')
        .pipe(open({ app: 'firefox' }));
});

gulp.task("open-opera", function () {
    gulp.src(tests + 'test.html')
        .pipe(open({ app: 'opera' }));
});

gulp.task("open-ie", function () {
    gulp.src(tests + 'test.html')
        .pipe(open({ app: 'iexplore' }));
});

//gulp.task("open-edge", function () {
//    gulp.src(tests + 'test.html')
//        .pipe(open({ app: 'microsoft-edge:' }));
//});