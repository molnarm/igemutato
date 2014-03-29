@echo off

rem a minify-t kivettem, hogy a bővítmény-ellenőrzés egyszerűbb legyen

rem echo JS minify
rem java -jar ..\tools\yuicompressor-2.4.8.jar igemutato.js -o extensions\igemutato.min.js -v

rem echo.
rem echo CSS minify
rem java -jar ..\tools\yuicompressor-2.4.8.jar igemutato.css -o extensions\igemutato.min.css -v

echo.
echo Copying files
copy igemutato.js "chrome\igemutato.min.js" /y
copy igemutato.css "chrome\igemutato.min.css" /y

copy igemutato.js "firefox\data\igemutato.min.js" /y
copy igemutato.css "firefox\data\igemutato.min.css" /y

echo.
echo Done.