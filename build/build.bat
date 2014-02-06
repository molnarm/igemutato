@echo off

echo JS minify
java -jar ..\tools\yuicompressor-2.4.8.jar igemutato.js -o igemutato.min.js -v

echo.
echo CSS minify
java -jar ..\tools\yuicompressor-2.4.8.jar igemutato.css -o igemutato.min.css -v

echo.
echo Done.