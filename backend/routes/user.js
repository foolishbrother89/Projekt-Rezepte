import express from 'express';
import 'dotenv/config';
import getDatabaseConnection from '../db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = express.Router();

//POST '/api/register'
//########################################################################################################
//hier sollten die regestrierungsdaten ankommen
router.post('/api/register', async (req, res) => {
    try {
        //die werte aus req.body rausholen
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
        // User existiert bereits
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ 
                message: 'Benutzername oder E-Mail bereits vergeben' 
            });
        }
        res.status(500).json({ message: 'Server error' });
    } finally {
        if (conn) conn.release();
    }
})
//POST '/api/register' END
//########################################################################################################

//POST '/api/login' 
//########################################################################################################
//HIER sollten die login anmeldedaten ankommen
router.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
 
    const conn = await getDatabaseConnection();
    let user;
    try {
        [user] = await conn.query(
        'SELECT * FROM user WHERE username = ? OR email = ?',
        [username, username]);
   
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
    
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    } finally {
        if (conn) conn.release();
    }
});
//POST '/api/login' END
//########################################################################################################
export default router;