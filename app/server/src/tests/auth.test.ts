import app from '../app';
import request from 'supertest';

describe('POST: /login', () => {
	it('Should response with status 200', (done) => {
		request(app)
			.post('/login')
			.send({
				email: 'hanisi@gmail.com',
				password: '123456',
			})
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect(200)
			.end((err) => {
				if (err) return done(err);

				return done();
			});
	});
});
