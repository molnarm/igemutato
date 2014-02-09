@echo off

echo JS minify
java -jar ..\tools\yuicompressor-2.4.8.jar igemutato.js -o extensions\igemutato.min.js -v

echo.
echo CSS minify
java -jar ..\tools\yuicompressor-2.4.8.jar igemutato.css -o extensions\igemutato.min.css -v

echo.
echo Copying files
copy extensions\igemutato.min.js "chrome\igemutato.min.js" /y
copy extensions\igemutato.min.css "chrome\igemutato.min.css" /y

copy extensions\igemutato.min.js "firefox\data\igemutato.min.js" /y
copy extensions\igemutato.min.css "firefox\data\igemutato.min.css" /y

echo.
echo Done.