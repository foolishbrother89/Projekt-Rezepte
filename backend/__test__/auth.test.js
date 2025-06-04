import request from 'supertest';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import 'dotenv/config';


// Importiere app von `index.js` dynamisch
const { app } = await import('../index');

describe('Authentication Middleware', () => {

    it('sollte Zugang blockieren oohne einen Tocken', async () => {
        const response = await request(app).get('/api/eigene-rezepte');
        expect(response.statusCode).toBe(401);
        expect(response.body.error).toBe('Nicht autorisiert');
    });

    it('sollte einen falschen Token erkennen', async () => {
        const token = jwt.sign({ id: 1, username: 'testuser' }, 'wrong-secret!!!');
        const response = await request(app)
            .get('/api/eigene-rezepte')
            .set('Authorization', `Bearer ${token}`);
        expect(response.statusCode).toBe(403);
        expect(response.body.error).toBe('Token ungültig');
    });

    it('sollte mit einem richtigen Token den Zugang erlauben', async () => {
        const token = jwt.sign(
            { id: 1, username: 'testuser' },
            process.env.JWT_SECRET_KEY);
        const response = await request(app)
          .get('/api/eigene-rezepte')
          .set('Authorization', `Bearer ${token}`);
        expect(response.statusCode).toBe(200);
    });

});