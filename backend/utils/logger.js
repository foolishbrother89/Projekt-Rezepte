import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function write_log(action, data) {
    const timestamp = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
    const logEntry = `${timestamp} - ${action}: ${JSON.stringify(data)}\n`;
    
    const logDir = path.join(__dirname, '../logs');
    const logPath = path.join(logDir, 'app.log');
    
    // Erstelle logs-Verzeichnis falls nicht existiert
    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
    }
    
    // Schreibe Log-Eintrag (synchron für einfachere Fehlerbehandlung)
    try {
        fs.appendFileSync(logPath, logEntry);
    } catch (err) {
        console.error('Logger-Fehler:', err);
    }
}