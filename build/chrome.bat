@echo off

echo Chrome packaging
call %LOCALAPPDATA%\Google\Chrome\Application\chrome.exe --pack-extension=%1\chrome --pack-extension-key=%1\igemutato.pem

echo.
echo Done.