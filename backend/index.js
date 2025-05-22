import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import getDatabaseConnection from './db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


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
        {'user': 'aydin'},    // Payload (Nutzdaten)
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
    res.json({ token, userId: user.id });
});


// Server starten
app.listen(process.env.PORT, () => {
  console.log('Server läuft auf Port :3001');
});

