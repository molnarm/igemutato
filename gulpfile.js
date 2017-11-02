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
    del(output + allFiles);
    del(packages + allFiles);
});
gulp.task("build", ["build-browser", "build-web", "build-wordpress"]);

gulp.task("release", ["release-browser", "release-web", "release-wordpress"]);

// BROWSER

gulp.task("clean-browser", function () {
    return del(output + browserDir);
});

gulp.task("copy-src-browser", function () {
    return gulp.src(sources + browserDir + allFiles)
        .pipe(gulp.dest(output + browserDir));
});

gulp.task("transform-js-browser", ["copy-src-browser"], function () {
    return transformJs(output + browserDir + mainJsFile, "BROWSER");
});

gulp.task("prepare-browser", ["copy-css", "transform-js-browser"], function () {
    return gulp.src(output + cssFile)
        .pipe(gulp.dest(output + browserDir));
});
gulp.task("build-browser", ["prepare-browser"], function () {
    return gulp.src(output + browserDir + allFiles)
        .pipe(zip(browserZipFile))
        .pipe(gulp.dest(packages));
});
gulp.task("release-browser", ["build-browser"]);

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

gulp.task("build-web", ["copy-css", "minify-js-web"], function () {
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

gulp.task("prepare-wordpress", ["copy-css", "minify-js-wordpress"], function () {
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