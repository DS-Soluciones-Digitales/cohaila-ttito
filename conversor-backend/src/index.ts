import cors from 'cors';
import express from 'express';
import exchangeRateRouter from './routes/exchangeRate';

const app = express();
const port = Number(process.env.PORT || 3001);

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.use(exchangeRateRouter);

app.listen(port, () => {
  console.log(`Backend listening on http://localhost:${port}`);
});
