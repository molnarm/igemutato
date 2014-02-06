@echo off

echo Copying files
copy igemutato.min.js "chrome/igemutato.min.js" /y
copy igemutato.min.css "chrome/igemutato.min.css" /y

echo Chrome packaging
%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe --pack-extension=%1\chrome --pack-extension-key=%1\igemutato.pem

echo.
echo Done.