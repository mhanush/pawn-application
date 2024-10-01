import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  vus: 10, 
  duration: '30s', 
};

export default function () {
  let res = http.post('http://localhost/api/auth/login', JSON.stringify({
    email: 'mhanush21@gmail.com',
    password: '1234'
  }), { headers: { 'Content-Type': 'application/json' } });

  check(res, {
    'is status 200': (r) => r.status === 200,
  });

  sleep(1); 
}
