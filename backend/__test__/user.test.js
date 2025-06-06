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

describe('/api/login', () => {
    // erfolgreich eingelogt 
    it('sollte einen Benutzer erfolgreich einloggen', async () => {
        const mockUser = {
            id: 2,
            username: 'testuser',
            name: 'Test Benutzer',
            email: 'test@example.com',
            password_hash: 'gehashtesPassword123'
        };

        // Mock bcrypt.compare für erfolgreichen Passwort-Vergleich
        jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

        // Mock jwt.sign für Token-Erstellung
        jest.spyOn(jwt, 'sign').mockReturnValue('mocked-jwt-token');

        // Simuliert erfolgreiche Benutzer-Abfrage
        getDatabaseConnection.mockResolvedValue({
            query: jest.fn().mockResolvedValue([mockUser]),
            release: jest.fn(),
        });

        const response = await request(app)
            .post('/api/login')
            .send({
                username: 'testuser',
                password: 'password123',
            });

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('token', 'mocked-jwt-token');
        expect(response.body).toHaveProperty('userId', 2);
        expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'gehashtesPassword123');
        expect(jwt.sign).toHaveBeenCalledWith(
            { id: 2, username: 'testuser' },
            process.env.JWT_SECRET_KEY,
            { expiresIn: '1h' }
        );
    });

    // user nicht gefunden
    it('sollte einen Fehler auslösen, wenn der Benutzer nicht gefunden wird', async () => {
        // Simuliert keine Treffer in der Datenbank
        getDatabaseConnection.mockResolvedValue({
            query: jest.fn().mockResolvedValue([]), // Leeres Array = kein Benutzer gefunden
            release: jest.fn(),
        });

        const response = await request(app)
            .post('/api/login')
            .send({
                username: 'nichtexistierender',
                password: 'password123',
            });

        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({ message: 'Benutzer nicht gefunden' });
    });

    // falsches passwort
    it('sollte einen Fehler auslösen, wenn das Passwort falsch ist', async () => {
        const mockUser = {
            id: 2,
            username: 'testuser',
            name: 'Test Benutzer',
            email: 'test@example.com',
            password_hash: 'gehashtesPassword123'
        };

        // Mock bcrypt.compare für fehlgeschlagenen Passwort-Vergleich
        jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

        // Simuliert erfolgreiche Benutzer-Abfrage
        getDatabaseConnection.mockResolvedValue({
            query: jest.fn().mockResolvedValue([mockUser]),
            release: jest.fn(),
        });

        const response = await request(app)
            .post('/api/login')
            .send({
                username: 'testuser',
                password: 'falschespasswort',
            });

        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({ message: 'Falsches Passwort' });
        expect(bcrypt.compare).toHaveBeenCalledWith('falschespasswort', 'gehashtesPassword123');
    });

    // Serverfehler
    it('sollte einen Serverfehler auslösen, wenn die Datenbankabfrage fehlschlägt', async () => {
        // Simuliert Datenbankfehler
        const dbError = new Error('Database query failed');
        getDatabaseConnection.mockResolvedValue({
            query: jest.fn().mockRejectedValue(dbError),
            release: jest.fn(),
        });

        const response = await request(app)
            .post('/api/login')
            .send({
                username: 'testuser',
                password: 'password123',
            });


        expect(response.statusCode).toBe(500);
    });
});

