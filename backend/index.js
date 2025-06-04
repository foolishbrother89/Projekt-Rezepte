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


// Damit der dynamiache import funktioniert! für das Testen!
export const app = express();




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
        res.status(200).json({message: 'Regestrierdaten in die Datenbank gespeichert'});
        
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
    res.status(200).json({ token, userId: user.id});
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
// Statische Dateien bereitstellen 
app.use('/uploads', express.static('public/uploads'));
// GET - Eigene Rezepte holen
//########################################################################################################
app.get('/api/eigene-rezepte', authMiddleware, async (req, res) => {
    const conn = await getDatabaseConnection();
    try {
        const userId = req.user.id;
            
        
        const rezepteRows = await conn.query(
            'SELECT * FROM recipe WHERE user_id = ?',
            [userId]
        );
        
        write_log('API_EIGENE_REZEPTE', {
            userId,
            rezeptCount: rezepteRows.length,
            rezepte: rezepteRows 
        });
        res.status(200).json(rezepteRows);
        /*
        rezepteRows:
        {"userId":2,"rezeptCount":7,"rezepte":[{"id":1,"titel":"Eier","zutaten":[{"zutat":"Ei","menge":"2","einheit":"Anzahl"}],"zubereitung":["braten",""],"bild_url":"b0a9af2a397a0696766f9cbb6cc7b250","user_id":2,"public":0,"created_at":"2025-05-29T14:14:44.000Z"},{"id":2,"titel":"Spagetti","zutaten":[{"zutat":"Spagetti","menge":"200","einheit":""},{"zutat":"Olivenöl","menge":"3","einheit":"Teelöffel"},{"zutat":"Knoblauch","menge":"1","einheit":"Anzahl"}],"zubereitung":["Spagetti Kochen ","Knoblauch vorbereiten","Olivenöl hinzufügen"],"bild_url":"ab4ffd3af44dfe5f019605fcf4bf8f85","user_id":2,"public":0,"created_at":"2025-05-29T14:23:08.000Z"},{"id":3,"titel":"Nudelsalat","zutaten":[{"zutat":"Penne","menge":"200","einheit":""},{"zutat":"Mayo","menge":"3","einheit":"Esslöffel"},{"zutat":"","menge":"","einheit":"Gramm"}],"zubereitung":["Nudeln Kochen ",""],"bild_url":"16f299c2d884346c648b5ad1935dd91d","user_id":2,"public":0,"created_at":"2025-05-29T14:35:18.000Z"},{"id":4,"titel":"Nudelsalat","zutaten":[{"zutat":"Penne","menge":"200","einheit":""},{"zutat":"Mayo","menge":"3","einheit":"Esslöffel"},{"zutat":"","menge":"","einheit":"Gramm"}],"zubereitung":["Nudeln Kochen ",""],"bild_url":"81c4e14041463b361c6578d24b240d0c","user_id":2,"public":0,"created_at":"2025-05-29T14:38:36.000Z"},{"id":5,"titel":"Nudelsalat","zutaten":[{"zutat":"Penne","menge":"200","einheit":""},{"zutat":"Mayo","menge":"3","einheit":"Esslöffel"},{"zutat":"","menge":"","einheit":"Gramm"}],"zubereitung":["Nudeln Kochen ",""],"bild_url":"551571d3632a541717047fc20d0e1e21","user_id":2,"public":0,"created_at":"2025-05-29T14:39:56.000Z"},{"id":6,"titel":"Nudelsalat","zutaten":[{"zutat":"Penne","menge":"200","einheit":""},{"zutat":"Mayo","menge":"3","einheit":"Esslöffel"},{"zutat":"","menge":"","einheit":"Gramm"}],"zubereitung":["Nudeln Kochen ",""],"bild_url":"277b9a35d85a4b4757fa36e374828c4a","user_id":2,"public":0,"created_at":"2025-05-29T14:43:44.000Z"},{"id":7,"titel":"Nudelsalat","zutaten":[{"zutat":"Penne","menge":"200","einheit":""},{"zutat":"Mayo","menge":"3","einheit":"Esslöffel"},{"zutat":"","menge":"","einheit":"Gramm"}],"zubereitung":["Nudeln Kochen ",""],"bild_url":"ff550459466460a68a463a20ed767d40","user_id":2,"public":0,"created_at":"2025-05-29T15:00:24.000Z"}]}
        */

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


// Delete /api/rezept-loeschen
//########################################################################################################

app.delete('/api/rezept-loeschen', authMiddleware, async (req, res) =>{
    const userId = req.user.id;
    // Rezeptid ausm body holen, um das richtige zu löschen
    const { rezeptID } = req.body;
    const conn = await getDatabaseConnection();
    try{
        const geloeschtstatus = await conn.query(
            'DELETE FROM recipe WHERE user_id = ? AND id = ?',
            [ userId, rezeptID ]
        );
        
        if (geloeschtstatus.affectedRows > 0) {
            res.status(200).json({ message: 'Rezept erfolgreich gelöscht.' });
        } else {
            res.status(404).json({ message: 'Rezept nicht gefunden.' });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Fehler beim Löschen des Rezepts' });
    } finally {
        if (conn) conn.release();
    }
});
// Delete ENDE
//########################################################################################################


// PUT '/api/RezeptBearbeiten'
//########################################################################################################
//hier sollten die bearbeiteten Rezepte ankommen
app.put('/api/RezeptBearbeiten', authMiddleware, upload.single('bild'), async (req, res) => {
    
    //Datenbankverbindung aufbauen: 
    const conn = await getDatabaseConnection();

    try {
        //userId aus authMiddleware 
        const userId = req.user.id;
        
        // Daten aus Formular extrahieren
        const { titel, zutaten, zubereitung, rezeptID} = req.body;

        // Prüfen ob das Rezept dem Benutzer gehört
        const rows = await conn.query(
            'SELECT * FROM recipe WHERE id = ? AND user_id = ?',
            [rezeptID, userId]
        );
        write_log('Antwort rows', rows);
        // Antwort rows: [{"id":6,"titel":"Nudelsalat","zutaten":[{"zutat":"Penne","menge":"200","einheit":""},{"zutat":"Mayo","menge":"3","einheit":"Esslöffel"},{"zutat":"Magie","menge":"1","einheit":"Kilogramm"}],"zubereitung":["Nudeln Kochen ","hallo","nein"],
        // "bild_url":null,"user_id":2,"public":0,"created_at":"2025-05-29T14:43:44.000Z"}]

        // rows ist ein Array von Rezept-Objekten (hier mit nur einem Element).
        // rows[0] selektiert das erste Objekt im Array 
        let existingRecipe = rows[0];

        if (!existingRecipe) {
            return res.status(404).json({ 
                message: 'Rezept nicht gefunden oder keine Berechtigung' 
            });
        }

        // Bild-Update Logic
        let bildUrl = existingRecipe.bild_url; // Behalte das alte Bild als Standard
        write_log('altes Bild', bildUrl);
        // altes Bild: undefined

        write_log('req.file', req.file);
        //req.file: {"fieldname":"bild","originalname":"eckis-italienischer-nudelsalat-mit-pesto.webp",
        // "encoding":"7bit","mimetype":"image/webp","destination":"public/uploads/",
        // "filename":"708aba03f68c8f9be2b8dcd2b1dec49e",
        // "path":"public/uploads/708aba03f68c8f9be2b8dcd2b1dec49e","size":62254}

        // Wenn ein neues Bild hochgeladen wurde, verwende das neue
        if (req.file) {
            bildUrl = req.file.filename;
        }
        

        // Rezept in Datenbank aktualisieren
        const updateResult = await conn.query(
            `UPDATE recipe 
             SET titel = ?, zutaten = ?, zubereitung = ?, bild_url = ?
             WHERE id = ? AND user_id = ?`,
            [
              titel,
              zutaten,  
              zubereitung,  
              bildUrl,
              rezeptID,
              userId
            ]
        );

        if (updateResult.affectedRows === 0) {
            return res.status(404).json({ 
                message: 'Rezept konnte nicht aktualisiert werden' 
            });
        }

        //Erfolgsmeldung mit aktualisierten Daten
        res.status(200).json({
            message: 'Rezept erfolgreich aktualisiert',
        });
        
    } catch (error) {
      console.error('Fehlerdetails beim Rezept-Update:', {
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

      res.status(500).json({ message: 'Serverfehler beim Aktualisieren des Rezepts' });
    } finally {
      if (conn) conn.release();
    }
});
//PUT '/api/RezeptBearbeiten' END
//########################################################################################################

// PUT '/api/RezeptPublicToggle' Veröffentlichen
//########################################################################################################

app.put('/api/RezeptPublicToggle', authMiddleware, async (req, res) => {
    
    //Datenbankverbindung aufbauen: 
    const conn = await getDatabaseConnection();

    try {
        //userId aus authMiddleware 
        const userId = req.user.id;
        
        const { rezeptID, publicrecepie } = req.body;

        // Rezept public in Datenbank aktualisieren
        const updateResult = await conn.query(
            `UPDATE recipe 
             SET public = ?
             WHERE id = ? AND user_id = ?`,
            [
              publicrecepie,
              rezeptID,
              userId
            ]
        );

        if (updateResult.affectedRows === 0) {
            return res.status(404).json({ 
                message: 'Rezept konnte nicht aktualisiert werden' 
            });
        }

        res.status(200).json({
            message: 'Rezept erfolgreich aktualisiert',
        });
        
    } catch (error) {
      console.error('Fehlerdetails beim Rezept-Update:', {
          message: error.message,
          stack: error.stack,
          body: req.body,
        });

      // Spezifische Fehlermeldungen
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: 'Ungültiger Token' });
      }
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token abgelaufen' });
      }
      if (error.name === 'SyntaxError') {
        return res.status(400).json({ message: 'Ungültige JSON-Daten' });
      }

      res.status(500).json({ message: 'Serverfehler beim Aktualisieren des Rezepts' });
    } finally {
      if (conn) conn.release();
    }
});
//PUT '/api/RezeptBearbeiten' END
//########################################################################################################

// GET - public Rezepte holen
//########################################################################################################
app.get('/api/PublicRezepte', async (req, res) => {
    const conn = await getDatabaseConnection();
    try {
        const publicRezepte = 1
        const rezepteRows = await conn.query(
            'SELECT * FROM recipe WHERE public = ?',
            [publicRezepte]
        );
        
        write_log('API_Public_REZEPTE', rezepteRows);

        res.status(200).json(rezepteRows);
        

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Fehler beim Laden der Rezepte' });
    } finally {
        if (conn) conn.release();
    }
});

// public Rezepte holen ENDE
//########################################################################################################




// Server starten
app.listen(process.env.PORT, () => {
  console.log('Server läuft auf Port :3001');
});

