import {app} from './index.js';

// Server starten
app.listen(process.env.PORT, () => {
  console.log('Server läuft auf Port :3001');
});