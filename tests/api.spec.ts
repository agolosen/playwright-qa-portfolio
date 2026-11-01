import { test, expect } from '@playwright/test';

const API = 'https://restful-booker.herokuapp.com';

const booking = {
  firstname: 'Alla',
  lastname: 'Golosenko',
  totalprice: 150,
  depositpaid: true,
  bookingdates: { checkin: '2026-12-01', checkout: '2026-12-05' },
  additionalneeds: 'Breakfast',
};

test.describe.serial('Booking API: CRUD flow', () => {
  let token: string;
  let bookingId: number;

  test('POST /auth returns token', async ({ request }) => {
    const res = await request.post(`${API}/auth`, {
      data: { username: 'admin', password: 'password123' },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.token).toBeTruthy();
    token = body.token;
  });

  test('POST /booking creates booking', async ({ request }) => {
    const res = await request.post(`${API}/booking`, { data: booking });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.bookingid).toBeGreaterThan(0);
    expect(body.booking.firstname).toBe('Alla');
    bookingId = body.bookingid;
  });

  test('GET /booking/:id returns created booking', async ({ request }) => {
    const res = await request.get(`${API}/booking/${bookingId}`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.lastname).toBe('Golosenko');
    expect(body.totalprice).toBe(150);
  });

  test('PUT without token is forbidden', async ({ request }) => {
    const res = await request.put(`${API}/booking/${bookingId}`, {
      data: booking,
      headers: { Accept: 'application/json' },
    });
    expect(res.status()).toBe(403);
  });

  test('PUT with token updates booking', async ({ request }) => {
    const res = await request.put(`${API}/booking/${bookingId}`, {
      data: { ...booking, totalprice: 200 },
      headers: { Accept: 'application/json', Cookie: `token=${token}` },
    });
    expect(res.status()).toBe(200);
    expect((await res.json()).totalprice).toBe(200);
  });

  test('DELETE removes booking, then GET returns 404', async ({ request }) => {
    const del = await request.delete(`${API}/booking/${bookingId}`, {
      headers: { Cookie: `token=${token}` },
    });
    expect(del.status()).toBe(201);
    const get = await request.get(`${API}/booking/${bookingId}`);
    expect(get.status()).toBe(404);
  });
});
