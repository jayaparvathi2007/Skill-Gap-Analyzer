@echo off
REM ===============================================================
REM SKILL GAP ANALYZER - BUILD SCRIPT (WINDOWS)
REM ===============================================================

echo ===============================================================
echo            BUILDING SKILL GAP ANALYZER PROJECT
echo ===============================================================

if not exist "bin" mkdir "bin"

echo [*] Compiling Java source files...
dir /s /b src\*.java > sources.txt

javac -encoding UTF-8 -cp "lib/*" -d bin @sources.txt
del sources.txt

if %ERRORLEVEL% NEQ 0 (
    echo [-] Compilation failed! Please check Java errors above.
    pause
    exit /b %ERRORLEVEL%
)

echo [+] Compilation completed successfully into 'bin/'!

REM Prepare WAR package for optional Tomcat deployment
echo [*] Generating skillgaper.war package for Tomcat deployment...
if not exist "build\war\WEB-INF\classes" mkdir "build\war\WEB-INF\classes"
if not exist "build\war\WEB-INF\lib" mkdir "build\war\WEB-INF\lib"

xcopy /E /I /Y "webapp\*" "build\war\" >nul
xcopy /E /I /Y "bin\*" "build\war\WEB-INF\classes\" >nul
xcopy /E /I /Y "lib\*" "build\war\WEB-INF\lib\" >nul
if exist "config\db.properties" (
    copy /Y "config\db.properties" "build\war\WEB-INF\classes\" >nul
)

cd build\war
jar -cf ..\..\skillgaper.war *
cd ..\..
rmdir /S /Q build

echo [+] Created 'skillgaper.war' successfully!
echo ===============================================================
echo [*] You can now run the application with: run.bat
echo ===============================================================
