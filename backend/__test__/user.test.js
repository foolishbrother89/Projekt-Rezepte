import { jest } from '@jest/globals'
import request from 'supertest';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

// Mock der `db.js`-Datei mit `jest.unstable_mockModule`
jest.unstable_mockModule('../db', () => ({
    __esModule: true,
    default:    jest.fn().mockImplementation(() => ({
    query:      jest.fn().mockResolvedValue([]),
    release:    jest.fn(),
    })),
}));
const getDatabaseConnection = (await import('../db')).default;

// Importiere app von `index.js` dynamisch
const { app } = await import('../index');

beforeEach(() => {
    getDatabaseConnection.mockResolvedValue({
        query: jest.fn().mockResolvedValue(
            []),
        release: jest.fn(),
    });
});

describe('/api/register', () => {
    // Erfolgreiches Regestrieren
    it('sollte einen user erfolgreich regestrieren', async () => {
        // Ich brauch kein Token!

        // Ersetzt die echte bcrypt.hash()-Funktion durch eine Mock-Funktion
        jest.spyOn(bcrypt, 'hash').mockResolvedValue('gehashtesPassword123')

        // Simmuliert erfolgreiches INSERT
        getDatabaseConnection.mockImplementation(() => ({
            query: jest.fn().mockResolvedValue({ affectedRows: 1 }),
            release: jest.fn(),
        }));
        

        const response = await request(app)
            .post('/api/register')
            .send({
                username: 'testuser',
                name: 'Test Benutzer',
                email: 'test@example.com',
                password: 'password123',
            });

        expect(response.statusCode).toBe(201); // 201 für created

        expect(response.body).toEqual({ 
            message: 'Regestrierdaten in die Datenbank gespeichert' 
        });
    });
    // wenn es den nutzer schon gibt
    it('sollte einen Fehler auslösen, wenn der Nutzer bereits existiert', async () => {

        // Simuliert einen Duplicate Entry Error 
        const duplicateError = new Error('Duplicate entry');
        duplicateError.code = 'ER_DUP_ENTRY';
       

        getDatabaseConnection.mockResolvedValue({
            query: jest.fn().mockRejectedValue(duplicateError),
            release: jest.fn(),
        });

        const response = await request(app)
            .post('/api/register')
            .send({
                username: 'existinguser',
                name: 'Existing User',
                email: 'existing@example.com',
                password: 'password123',
            });

        expect(response.statusCode).toBe(409); // 409 für conflict
        expect(response.body).toEqual({ message: 'Benutzername oder E-Mail bereits vergeben' });
    });

    // keine Datenbankverbindung gibt
    it('sollte einen Fehler auslösen, wenn keine Datenbankverbindung hergestellt werden kann', async () => {
        jest.spyOn(bcrypt, 'hash').mockResolvedValue('gehashtesPassword123');

        // Simuliert Datenbankverbindungsfehler
        const connectionError = new Error('Cannot connect to database');
        getDatabaseConnection.mockRejectedValue(connectionError);

        const response = await request(app)
            .post('/api/register')
            .send({
                username: 'testuser',
                name: 'Test Benutzer',
                email: 'test@example.com',
                password: 'password123',
            });
          
        expect(response.statusCode).toBe(500);
        expect(response.body).toEqual({ message: 'Server error' });
    });

    // hashen nicht geklappt 
    it('sollte einen Fehler auslösen, wenn das Passwort-Hashing fehlschlägt', async () => {
        // Simuliert einen Hash-Fehler
        const hashError = new Error('Hashing failed');
        jest.spyOn(bcrypt, 'hash').mockRejectedValue(hashError);

        const response = await request(app)
            .post('/api/register')
            .send({
                username: 'testuser',
                name: 'Test Benutzer',
                email: 'test@example.com',
                password: 'password123',
            });

        expect(response.statusCode).toBe(500);
        expect(response.body).toEqual({ message: 'Server error' });
        expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
    });
    
});