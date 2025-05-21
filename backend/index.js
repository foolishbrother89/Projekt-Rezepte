import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import getDatabaseConnection from './db.js';
import bcrypt from 'bcryptjs';


const app = express();

// expresss JSON beibringen 
app.use(express.json());

// configure CORS
app.use(cors({
    origin: [
            'http://aiserver.mshome.net:3000', 
           
        ], // React-URL
    credentials: true // Erlaubt das Senden von Cookies, falls benötigt
}));


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
        //Die Validierung der Daten mache ich später erstmal rein damit
        
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
        conn.release();
    }
})

// Server starten
app.listen(process.env.PORT, () => {
  console.log('Server läuft auf Port :3001');
});

