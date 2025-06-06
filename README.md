# Erste Schritte: installieren von Packages konfigurieren der package.json und Ports

## Nodemon
- Automatischer Server-Neustart bei Code-Änderungen
- Beschleunigt die Entwicklung, da man nicht manuell neu starten muss.
## "type": "module"
- Aktiviert ES6-Module (import/export)
- Modernere Syntax als CommonJS (require), bessere Browser-Kompatibilität.
## Express
- Web-Framework für Routing und Middleware
- Vereinfacht die Erstellung von REST-APIs und HTTP-Endpunkten.
## mariadb
- Datenbanktreiber für MariaDB/MySQL
- Ermöglicht direkte Kommunikation mit deiner SQL-Datenbank.
## bcryptjs
- Passwort-Hashing
## jsonwebtoken
- Erstellung/Verifizierung von JWTs
- Sichere Authentifizierung durch zustandslose Tokens (für Login-Systeme).
## cookie-parser
- Verarbeitung von Cookies
- Liest JWTs aus Cookies (sicherer als Local Storage im Frontend).
## dotenv
- Umgebungsvariablen aus .env-Datei
- Trennt sensibles (API-Keys, DB-Passwörter) vom Code.
## cors Cross-Origin Resource Sharing
- Erlaubt sicherere Cross-Domain-Kommunikation (z. B. wenn Frontend/Backend auf verschiedenen Ports laufen).
## React & react-router-dom
- React für UI-Komponenten, react-router-dom für Client-seitiges Routing.
## Bootstrap/react-bootstrap
- Vorgefertigte UI-Komponenten
- Beschleunigt das Design mit responsiven Layouts.
## Vite Modernes Frontend-Build-Tool
- Schnellere Entwicklung mit Hot-Reload und optimierten Builds.


# Datenbankerstellung
```bash
CREATE DATABASE fi37_bayramov_fpadw;
//jetzt will ich eine Tabelle user erstellen worin username, name, email, password_hash gespeichert werden, wobei passwort gehasht ist

CREATE TABLE `user` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL
);
```

## JWT docodieren

[JWT DEKODIEREN](https://www.npmjs.com/package/jwt-decode)
```bash
npm install jwt-decode
```
# multer 
```bash
npm install multer
```
# jest und supertest
```bash
npm install jest@latest supertest@latest --save-dev

//Konfigurieren in package.json
"test": "node --experimental-vm-modules node_modules/jest/bin/jest --runInBand --detectOpenHandles --forceExit",
"cov": "npm run test -- --coverage"

npm run test auth.test.js
npm run cov 
```



# recipe Datenbank
```bash
CREATE TABLE recipe (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titel VARCHAR(255) NOT NULL,
  zutaten JSON NOT NULL,  
  zubereitung JSON NOT NULL,
  bild_url VARCHAR(255),
  user_id INT NOT NULL,
  public BOOLEAN NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
);
```

# Datenbank DUMP
```bash
mysqldump -u aydin -p -B fi37_bayramov_fpadw > sql/fi37_bayramov_fpadw.sql
```