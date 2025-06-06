import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import getDatabaseConnection from './db.js';
import authMiddleware from './middleware/auth.js';
// LOG
import  {write_log}  from './utils/logger.js'; 

import userRouter from './routes/user.js';
import CRUD from './routes/recepieCRUD.js'


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

// Statische Dateien bereitstellen 
app.use('/uploads', express.static('public/uploads'));

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

      //'TokenExpiredError' prüfe ich schon im auth.js

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


app.use('/', userRouter);
app.use('/', CRUD);


