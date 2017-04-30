const gulp = require("gulp");

const uglify = require("gulp-uglify");
const cleanCss = require("gulp-clean-css");
const rename = require("gulp-rename");
const del = require("del");
const exec = require('sync-exec');
const fs = require("fs");
const crx = require("gulp-crx-pack");

const debug = require("gulp-debug");

// PATHS

const mainJsFile = "igemutato.js";
const minMainJsFile = "igemutato.min.js";
const cssFile = "igemutato.css";
const minCssFile = "igemutato.min.css";

const chromeDir = "chrome/";
const chromeCrxFile = "chrome.crx";

const firefoxDir = "firefox/";
const firefoxXpiFile = "firefox.xpi";
const firefoxWebExtensionDir = firefoxDir + "webextension/";

const webDir = "web/";

const wordPressDir = "wordpress/igemutato/";

// COMMON TASKS

const extensionsDir = "extensions/";

gulp.task("minify-css", function () {
    return gulp.src(cssFile)
        .pipe(cleanCss({ compatibility: "ie8" }))
        .pipe(rename(minCssFile))
        .pipe(gulp.dest(extensionsDir));
});

gulp.task("clean", ["clean-chrome", "clean-firefox", "clean-web", "clean-wordpress"]);
gulp.task("build", ["build-chrome", "build-firefox", "build-web", "build-wordpress"]);

// CHROME

gulp.task("clean-chrome", function () {
    return del([
        chromeCrxFile
        , chromeDir + mainJsFile
        , chromeDir + minMainJsFile
        , chromeDir + minCssFile
        , extensionsDir + chromeCrxFile
    ]);
});

gulp.task("transform-js-chrome", function () {
    return transformJs(chromeDir + mainJsFile, "CHROME");
});

gulp.task("minify-js-chrome", ["transform-js-chrome"], function () {
    return minifyJs(chromeDir, chromeDir);
});

gulp.task("prepare-chrome", ["minify-css", "minify-js-chrome"], function () {
    del.sync([chromeDir + mainJsFile]);
    return gulp.src(extensionsDir + minCssFile)
        .pipe(gulp.dest(chromeDir));
});

gulp.task("package-chrome", ["prepare-chrome"], function () {
    return gulp.src(chromeDir)
        .pipe(crx({
            privateKey: fs.readFileSync(extensionsDir + "igemutato.pem", "utf8"),
            filename: chromeCrxFile
        }))
        .pipe(gulp.dest(extensionsDir));
});

gulp.task("build-chrome", ["package-chrome"]);

// FIREFOX

gulp.task("clean-firefox", function () {
    return del([
        , firefoxWebExtensionDir + minMainJsFile
        , firefoxWebExtensionDir + minCssFile
        , extensionsDir + firefoxXpiFile
    ]);
});

gulp.task("transform-js-firefox", function () {
    // Firefox JS file is not minified (because of reviewing process)
    return transformJs(firefoxWebExtensionDir + minMainJsFile, "FIREFOX");
});

gulp.task("prepare-firefox", ["minify-css", "transform-js-firefox"], function () {
    return gulp.src(extensionsDir + minCssFile)
        .pipe(gulp.dest(firefoxWebExtensionDir));
});

gulp.task("package-firefox", ["prepare-firefox"], function () {
    del.sync(firefoxDir + "*.xpi");
    process.chdir(firefoxDir);
    exec("jpm xpi");
    process.chdir("..");
    gulp.src(firefoxDir + "*.xpi")
        .pipe(rename(firefoxXpiFile))
        .pipe(gulp.dest(extensionsDir));
    del(firefoxDir + "*.xpi");
});

gulp.task("build-firefox", ["package-firefox"]);

// WEB

gulp.task("clean-web", function () {
    return del([
        , webDir + mainJsFile
        , webDir + minMainJsFile
        , webDir + minCssFile
    ]);
});

gulp.task("transform-js-web", function () {
    return transformJs(webDir + mainJsFile, "EMBEDDED");
});

gulp.task("minify-js-web", ["transform-js-web"], function () {
    return minifyJs(webDir, webDir);
});

gulp.task("build-web", ["minify-css", "minify-js-web"], function () {
    del.sync([webDir + mainJsFile]);
    return gulp.src(extensionsDir + minCssFile)
        .pipe(gulp.dest(webDir));
});

// WORDPRESS

gulp.task("clean-wordpress", function () {
    return del([
        , wordPressDir + mainJsFile
        , wordPressDir + minMainJsFile
        , wordPressDir + minCssFile
    ]);
});

gulp.task("transform-js-wordpress", function () {
    return transformJs(wordPressDir + mainJsFile, "WORDPRESS");
});

gulp.task("minify-js-wordpress", ["transform-js-wordpress"], function () {
    return minifyJs(wordPressDir, wordPressDir);
});

gulp.task("build-wordpress", ["minify-css", "minify-js-wordpress"], function () {
    del.sync([wordPressDir + mainJsFile]);
    return gulp.src(extensionsDir + minCssFile)
        .pipe(gulp.dest(wordPressDir));
});

// UTILITIES

function transformJs(destFile, variant) {
    return exec("powershell -ExecutionPolicy Bypass -File tools/stripregions.ps1 " + mainJsFile + " " + destFile + " " + variant);
}

function minifyJs(srcDir, destDir) {
    return gulp.src(srcDir + mainJsFile)
        .pipe(uglify())
        .pipe(rename(minMainJsFile))
        .pipe(gulp.dest(destDir));
}