import express from 'express';

console.log('Starting server...');

const app = express();
app.post('/api/actions', (req, res) => {
  res.send({ ok: true });
});

app.listen(4000);
