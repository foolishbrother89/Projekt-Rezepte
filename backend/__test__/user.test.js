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
        const token = jwt.sign(
                    { 
                    username: 'testuser',
                    name: 'Test Benutzer',
                    email: 'test@example.com',
                    password: 'password123', 
                    },
                    process.env.JWT_SECRET_KEY
                );


        getDatabaseConnection.mockImplementation(() => ({
            query: jest.fn().mockResolvedValue({ affectedRows: 1 }),
            release: jest.fn(),
        }));
        
        const response = await request(app)
            .post('/api/register')
            .set('Authorization', `Bearer ${token}`)
            .send({
                username: 'testuser',
                name: 'Test Benutzer',
                email: 'test@example.com',
                password: 'password123',
            });

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ 
            message: 'Regestrierdaten in die Datenbank gespeichert' 
        });
    });
});