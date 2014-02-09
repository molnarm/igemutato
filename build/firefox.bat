@echo off

cd firefox

echo Firefox packaging
call cfx xpi

echo Moving .xpi file
move /y *.xpi ../extensions/firefox.xpi

echo.
echo Done.