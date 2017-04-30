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

// COMMON TASKS

const extensionsDir = "extensions/";

gulp.task("minify-css", function () {
    return gulp.src(cssFile)
        .pipe(cleanCss({ compatibility: "ie8" }))
        .pipe(rename(minCssFile))
        .pipe(gulp.dest(extensionsDir));
});

gulp.task("clean", ["clean-chrome", "clean-firefox"]);
gulp.task("build", ["build-chrome", "build-firefox" /**, "web", "wordpress"*/]);

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
    return exec("powershell -ExecutionPolicy Bypass -File build/stripregions.ps1 " + mainJsFile + " " + chromeDir + mainJsFile + " CHROME");
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
    return exec("powershell -ExecutionPolicy Bypass -File build/stripregions.ps1 " + mainJsFile + " " + firefoxWebExtensionDir + minMainJsFile + " FIREFOX");
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

// UTILITIES

function minifyJs(srcDir, destDir) {
    return gulp.src(srcDir + mainJsFile)
        .pipe(uglify())
        .pipe(rename(minMainJsFile))
        .pipe(gulp.dest(destDir));
}