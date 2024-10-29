@echo off
SET DB_USER=connect
SET DB_PASSWORD=?5Q7_53RV3R?
SET DB_SERVER=163.5.143.146
SET DB_DATABASE=AdminPanel
SET CRYPTO_KEY=5L38Ny4Qeank2DQ8GbhgHX0vt1RcBob9tY1CaScZAy01CDZ1pO6hziKXIM5St9st


REM Démarrer le serveur Node.js
start "Node Server" "C:\Program Files\nodejs\node.exe" C:\Users\Administrateur\Documents\Monitoring\index.js

REM Démarrer l'API Python
start "Python API" python "C:\Users\Administrateur\Documents\Monitoring\api\app.py"

REM Optionnel : Attendre que les deux serveurs démarrent (si nécessaire)
