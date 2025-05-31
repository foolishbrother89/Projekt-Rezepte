import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import getDatabaseConnection from './db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import authMiddleware from './middleware/auth.js';
// LOG
import  {write_log}  from './utils/logger.js'; 

// Multer speichert alle hochgeladenen Dateien automatisch im angegebenen Ordner
const upload = multer({dest:'public/uploads/'})

const app = express();

// expresss JSON beibringen 
app.use(express.json());

//CORS
//########################################################################################################
app.use(cors({
    origin: [
            'http://aiserver.mshome.net:3000', 
           
        ], // React-URL
    credentials: true // Erlaubt das Senden von Cookies, falls benötigt
    
}));
//CORS END
//########################################################################################################


//POST '/api/register'
//########################################################################################################
//hier sollten die regestrierungsdaten ankommen
app.post('/api/register', async (req, res) => {
    try {
        //jetzt aber ernst - die werte aus req.body rausholen
        const { username, name, email, password } = req.body

        //ich muss das Passwort noch hashen
        const password_hash = await bcrypt.hash(password, 10);

        //Datenbankverbindung aufbauen:
        const conn = await getDatabaseConnection();
        //So jetzt inserte ich die werte aus req.body in die user Tabelle in der Datenbank
        
        await conn.query(
            'INSERT INTO user (username, name, email, password_hash) VALUES (?, ?, ?, ?)',
            [username, name, email, password_hash]  
        );
        //Erfolgsmeldung
        res.status(201).json({message: 'Regestrierdaten in die Datenbank gespeichert'});
        
    } catch (error) {
        console.error(error);
        res.status(409).json({ message: 'Server error' });
    } finally {
        if (conn) conn.release();
    }
})
//POST '/api/register' END
//########################################################################################################


//POST '/api/login' 
//########################################################################################################
//HIER sollten die login anmeldedaten ankommen
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
 
    const conn = await getDatabaseConnection();
    let user;
    try {
        [user] = await conn.query(
        'SELECT * FROM user WHERE username = ? OR email = ?',
        [username, username]);
    } catch (error) {
        console.log(error);
    } finally {
        if (conn) conn.release();
    }
    if (!user) return res.status(400).json(
        { message: 'Benutzer nicht gefunden' }
    );
    // wenn der Benutzer gefunden wird müsste user so aussehen:
    // user = {id: 2, username: Adenus, name: Aydin, email: hanma89@gmail.com, pasword_hash: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx}
    // bcrypt.compare vergleicht die paswörter und gibt ein boolean zurück
    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) return res.status(400).json(
        { message: 'Falsches Passwort' });
    
    //wenn das password passt erstelle ich einen token
    //erst aber ein neues JWT_SECRET_KEY erstellen - eine möglichkeit:
    // node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
    
    /*
    const token = jwt.sign(
        {'id': 2, 'user': 'aydin'},    // Payload (Nutzdaten)
        'my-secret',          // Secret (Signaturschlüssel)
        {expiresIn: '1h'}     // Header-Optionen
    );
    */
    const token = jwt.sign(
        { id: user.id, username: user.username },
        process.env.JWT_SECRET_KEY,
        { expiresIn: '1h' });
    
    //Ich schicke den erstelten token und die user id zurück 
    //und speichere diese später im localStorage
    res.status(200).json({ token });
});
//POST '/api/login' END
//########################################################################################################

//POST '/api/RezeptErstellen'
//########################################################################################################
//hier sollten die eigen erstellten Rezepte ankommen
app.post('/api/RezeptErstellen', authMiddleware , upload.single('bild'), async (req, res) => {
    
    
    //Datenbankverbindung aufbauen: 
    const conn = await getDatabaseConnection();

    try {
        //veröfentlicht? später
        const pub = 0;
        //userId aus authMiddleware 
        const userId = req.user.id;
        
        // Daten aus Formular extrahieren
        const { titel, zutaten, zubereitung } = req.body;


        const bildUrl = req.file ? req.file.filename : null;; 

        

        // Rezept in Datenbank speichern
        await conn.query(
            `INSERT INTO recipe
            (titel, zutaten, zubereitung, bild_url, user_id, public) 
            VALUES (?, ?, ?, ?, ?, ?)`,
            [
              titel,
              zutaten,  
              zubereitung,  
              bildUrl,
              userId,
              pub
            ]
        );
        

        //Erfolgsmeldung
        res.status(201).json({message: 'RezeptDaten in die Datenbank gespeichert'});
        
    } catch (error) {
      console.error('Fehlerdetails:', {
          message: error.message,
          stack: error.stack,
          body: req.body,
          file: req.file
        });

      // Spezifische Fehlermeldungen
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: 'Ungültiger Token' });
      }
      if (error instanceof multer.MulterError) {
        return res.status(400).json({ message: 'Bildfehler: ' + error.message });
      }
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token abgelaufen' });
      }
      if (error.name === 'SyntaxError') {
        return res.status(400).json({ message: 'Ungültige JSON-Daten' });
      }

      res.status(500).json({ message: 'Serverfehler beim Speichern des Rezepts' });
    } finally {
      if (conn) conn.release();
    }
})
//POST '/api/RezeptErstellen' END
//########################################################################################################

// GET - Eigene Rezepte holen
//########################################################################################################
app.get('/api/eigene-rezepte', authMiddleware, async (req, res) => {
    const conn = await getDatabaseConnection();
    try {
        const userId = req.user.id;
            
        
        const [rezepteRows, fields] = await conn.query(
            'SELECT * FROM recipe WHERE user_id = ?',
            [userId]
        );
        
        // DEBUG: 
        write_log('API_EIGENE_REZEPTE rows', {
            userId,
            rezeptCount: rezepteRows.length,
            firstRezept: rezepteRows.length > 0 ? {
                id: rezepteRows[0].id,
                titel: rezepteRows[0].titel,
                zutaten: rezepteRows[0].zutaten,
                zubereitung: rezepteRows[0].zubereitung
            } : 'Keine Rezepte'
        });
        write_log('API_EIGENE_REZEPTE fields', {
            userId,
            rezeptCount: fields.length,
            firstRezept: fields.length > 0 ? {
                id: fields[0].id,
                titel: fields[0].titel,
                zutaten: fields[0].zutaten,
                zubereitung: fields[0].zubereitung
            } : 'Keine Rezepte'
        });

        res.status(200).json(rezepteRows);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Fehler beim Laden der Rezepte' });
    } finally {
        if (conn) conn.release();
    }
});
/*
Die Destrukturierung [rezepte] nimmt nur das erste Element des Ergebnisses. Wenn die Abfrage mehrere Rezepte zurückgibt, 
werden nur die ersten genommen. Wenn nur ein Rezept vorhanden ist, wird es als einzelnes Objekt zurückgegeben

conn.query() gibt ein Tupel zurück: [rows, fields]
const [rezepte] nimmt nur die rows
MySQL gibt bei:
Keinen Ergebnissen: Leeres Array []
Einem Ergebnis: Ein Array mit einem Element [{...}]
Mehreren Ergebnissen: Array mit mehreren Elementen [{...}, {...}]
 */
// Rezepte holen ENDE
//########################################################################################################

// Server starten
app.listen(process.env.PORT, () => {
  console.log('Server läuft auf Port :3001');
});

