/// <binding AfterBuild="build" Clean="clean" />

const gulp = require("gulp");

const uglify = require("gulp-uglify");
const cleanCss = require("gulp-clean-css");
const rename = require("gulp-rename");
const del = require("del");
const run = require("gulp-run");
var fs = require("fs");
const crx = require("gulp-crx-pack");

const debug = require("gulp-debug");

const mainFile = "igemutato.js";

// COMMON TASKS

const extensionsDir = "extensions/";

gulp.task("minify-css", function () {
    return gulp.src("igemutato.css")
        .pipe(cleanCss({ compatibility: "ie8" }))
        .pipe(rename("igemutato.min.css"))
        .pipe(gulp.dest(extensionsDir));
});

gulp.task("clean", ["clean-chrome"]);
gulp.task("build", ["build-chrome"/*, "firefox", "web", "wordpress"*/]);

// CHROME

const chromeDir = "chrome/";

gulp.task("clean-chrome", function () {
    return del([
        "chrome.crx"
        , chromeDir + mainFile
        , chromeDir + "igemutato.min.js"
        , chromeDir + "igemutato.min.css"
        , extensionsDir + "chrome.crx"
    ]);
});

gulp.task("transform-js-chrome", function (callback) {
    return run("powershell -ExecutionPolicy Bypass -File build/stripregions.ps1 " + mainFile + " " + chromeDir + mainFile + " CHROME").exec();
});

gulp.task("minify-js-chrome", ["transform-js-chrome"], function () {
    return gulp.src(chromeDir + mainFile)
        .pipe(uglify())
        .pipe(rename("igemutato.min.js"))
        .pipe(gulp.dest(chromeDir));
});

gulp.task("prepare-chrome", ["minify-css", "minify-js-chrome"], function () {
    del.sync([chromeDir + mainFile]);
    return gulp.src(extensionsDir + "igemutato.min.css")
        .pipe(gulp.dest(chromeDir));
});

gulp.task("package-chrome", ["prepare-chrome"], function () {
    return gulp.src(chromeDir)
        .pipe(crx({
            privateKey: fs.readFileSync(extensionsDir + "igemutato.pem", "utf8"),
            filename: "chrome.crx"
        }))
        .pipe(gulp.dest(extensionsDir));
});

gulp.task("build-chrome", ["package-chrome"]);