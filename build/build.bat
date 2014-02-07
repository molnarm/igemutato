@echo off

echo JS minify
java -jar ..\tools\yuicompressor-2.4.8.jar igemutato.js -o igemutato.min.js -v

echo.
echo CSS minify
java -jar ..\tools\yuicompressor-2.4.8.jar igemutato.css -o igemutato.min.css -v

echo.
echo Copying files
copy igemutato.min.js "chrome/igemutato.min.js" /y
copy igemutato.min.css "chrome/igemutato.min.css" /y

copy igemutato.min.js "firefox/data/igemutato.min.js" /y
copy igemutato.min.css "firefox/data/igemutato.min.css" /y

echo.
echo Done.