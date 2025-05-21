import express from 'express';
import cors from 'cors';


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
        console.log(req.body);
        //ich will erstmal nur den request zurückschicken als response //testzwecke
        res.status(200).json(req.body);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
})

// Server starten
app.listen(3001, () => {
  console.log('Server läuft auf Port :3001');
});

