@echo off

echo JS minify
java -jar ..\tools\yuicompressor-2.4.8.jar igemutato.js -o chrome\igemutato.min.js -v

echo.
echo CSS minify
java -jar ..\tools\yuicompressor-2.4.8.jar igemutato.css -o chrome\igemutato.min.css -v

echo.
echo Chrome packaging
%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe --pack-extension=%1\chrome --pack-extension-key=%1\igemutato.pem

echo.
echo Done.