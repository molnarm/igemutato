@echo off

rem echo.
echo CSS minify
java -jar ..\tools\yuicompressor-2.4.8.jar igemutato.css -o extensions\igemutato.min.css -v

echo.
echo Chrome

powershell -ExecutionPolicy Bypass -File "build\stripregions.ps1" igemutato.js chrome\igemutato.js CHROME
java -jar ..\tools\yuicompressor-2.4.8.jar chrome\igemutato.js -o chrome\igemutato.min.js -v
copy extensions\igemutato.min.css "chrome\igemutato.min.css" /y
call %LOCALAPPDATA%\Google\Chrome\Application\chrome.exe --pack-extension=%1\chrome --pack-extension-key=%1\extensions\igemutato.pem
move /y *.crx extensions\chrome.crx

echo.
echo Firefox

powershell -ExecutionPolicy Bypass -File "build\stripregions.ps1" igemutato.js firefox\data\igemutato.min.js FIREFOX
copy extensions\igemutato.min.css "firefox\data\igemutato.min.css" /y
cd firefox
call cfx xpi
move /y *.xpi ..\extensions\firefox.xpi
cd..

echo.
echo WordPress
powershell -ExecutionPolicy Bypass -File "build\stripregions.ps1" igemutato.js wordpress\igemutato\igemutato.js WORDPRESS
copy igemutato.css "wordpress\igemutato\igemutato.css" /y

echo.
echo Beágyazható
powershell -ExecutionPolicy Bypass -File "build\stripregions.ps1" igemutato.js web\igemutato.js EMBEDDED
java -jar ..\tools\yuicompressor-2.4.8.jar web\igemutato.js -o web\igemutato.min.js -v
copy extensions\igemutato.min.css "web\igemutato.min.css" /y

echo.
echo Done.