@echo off

cd firefox

echo Firefox packaging
call cfx xpi

echo Moving .xpi file
move /y *.xpi ../

echo.
echo Done.