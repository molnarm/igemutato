const gulp = require("gulp");

const uglify = require("gulp-uglify");
const cleanCss = require("gulp-clean-css");
const rename = require("gulp-rename");
const del = require("del");
const exec = require('sync-exec');
const fs = require("fs");
const crx = require("gulp-crx-pack");
const zip = require("gulp-zip");

const debug = require("gulp-debug");

// PATHS

const sources = "src/";
const output = "build/";
const packages = "packages/";
const allFiles = "**/*"

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

const wordPressDir = "wordpress/";

// COMMON TASKS

gulp.task("minify-css", function () {
    return gulp.src(sources + cssFile)
        .pipe(cleanCss({ compatibility: "ie8" }))
        .pipe(rename(minCssFile))
        .pipe(gulp.dest(output));
});

gulp.task("clean", ["clean-chrome", "clean-firefox", "clean-web", "clean-wordpress"], function () {
    del(output + allFiles);
    del(packages + allFiles);
});
gulp.task("build", ["build-chrome", "build-firefox", "build-web", "build-wordpress"]);

gulp.task("release", ["release-chrome", "release-firefox", "release-web", "release-wordpress"]);

// CHROME

gulp.task("clean-chrome", function () {
    return del(output + chromeDir);
});

gulp.task("copy-src-chrome", function () {
    return gulp.src(sources + chromeDir + "**/!(*.pem)")
        .pipe(gulp.dest(output + chromeDir));
});

gulp.task("transform-js-chrome", ["copy-src-chrome"], function () {
    return transformJs(output + chromeDir + mainJsFile, "CHROME");
});

gulp.task("minify-js-chrome", ["transform-js-chrome"], function () {
    return minifyJs(output + chromeDir);
});

gulp.task("prepare-chrome", ["minify-css", "minify-js-chrome"], function () {
    return gulp.src(output + minCssFile)
        .pipe(gulp.dest(output + chromeDir));
});

gulp.task("build-chrome", ["prepare-chrome"], function () {
    return gulp.src(output + chromeDir)
        .pipe(crx({
            privateKey: fs.readFileSync(sources + chromeDir + "igemutato.pem", "utf8"),
            filename: chromeCrxFile
        }))
        .pipe(gulp.dest(packages));
});

gulp.task("release-chrome", ["prepare-chrome"], function () {
    return gulp.src(output + chromeDir + allFiles)
        .pipe(zip('chrome.zip'))
        .pipe(gulp.dest(packages));
});

// FIREFOX

gulp.task("clean-firefox", function () {
    return del(output + firefoxDir);
});

gulp.task("copy-src-firefox", function () {
    return gulp.src(sources + firefoxDir + allFiles)
        .pipe(gulp.dest(output + firefoxDir));
});

gulp.task("transform-js-firefox", ["copy-src-firefox"], function () {
    // Firefox JS file is not minified (because of reviewing process)
    return transformJs(output + firefoxWebExtensionDir + minMainJsFile, "FIREFOX");
});

gulp.task("prepare-firefox", ["minify-css", "transform-js-firefox"], function () {
    return gulp.src(output + minCssFile)
        .pipe(gulp.dest(output + firefoxWebExtensionDir));
});

gulp.task("build-firefox", ["prepare-firefox"], function () {
    process.chdir(output + firefoxDir);
    exec("jpm xpi");
    process.chdir(__dirname);
    gulp.src(output + firefoxDir + "*.xpi")
        .pipe(rename(firefoxXpiFile))
        .pipe(gulp.dest(packages));
    del(output + firefoxDir + "*.xpi");
});

gulp.task("release-firefox", ["build-firefox"]);

// WEB

gulp.task("clean-web", function () {
    return del(output + webDir);
});

gulp.task("copy-src-web", function () {
    return gulp.src(sources + webDir + allFiles)
        .pipe(gulp.dest(output + webDir));
});

gulp.task("transform-js-web", ["copy-src-web"], function () {
    return transformJs(output + webDir + mainJsFile, "EMBEDDED");
});

gulp.task("minify-js-web", ["transform-js-web"], function () {
    return minifyJs(output + webDir);
});

gulp.task("build-web", ["minify-css", "minify-js-web"], function () {
    return gulp.src(output + minCssFile)
        .pipe(gulp.dest(output + webDir));
});

gulp.task("release-web", ["build-web"]);

// WORDPRESS

gulp.task("clean-wordpress", function () {
    return del(output + wordPressDir);
});

gulp.task("copy-src-wordpress", function () {
    return gulp.src(sources + wordPressDir + allFiles)
        .pipe(gulp.dest(output + wordPressDir));
});

gulp.task("transform-js-wordpress", ["copy-src-wordpress"], function () {
    return transformJs(output + wordPressDir + mainJsFile, "WORDPRESS");
});

gulp.task("minify-js-wordpress", ["transform-js-wordpress"], function () {
    return minifyJs(output + wordPressDir);
});

gulp.task("prepare-wordpress", ["minify-css", "minify-js-wordpress"], function () {
    return gulp.src(output + minCssFile)
        .pipe(gulp.dest(output + wordPressDir));
});

gulp.task("build-wordpress", ["prepare-wordpress"], function () {
    return gulp.src(output + wordPressDir + allFiles)
        .pipe(zip('wordpress.zip'))
        .pipe(gulp.dest(packages));
});

gulp.task("release-wordpress", ["build-wordpress"]);

// UTILITIES

function transformJs(destFile, variant) {
    return exec("powershell -ExecutionPolicy Bypass -File tools/stripregions.ps1 " + sources + mainJsFile + " " + destFile + " " + variant);
}

function minifyJs(dir) {
    gulp.src(dir + mainJsFile)
        .pipe(uglify())
        .pipe(rename(minMainJsFile))
        .pipe(gulp.dest(dir));
    del(dir + mainJsFile);
}