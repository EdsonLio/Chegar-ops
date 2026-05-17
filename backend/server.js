import express from 'express';
import helmet from 'helmet';
import cors from 'cors';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.get('/health', (_, response) => {
  response.json({
    status: 'ok',
    service: 'chegar-ops-api'
  });
});

app.listen(3000, () => {
  console.log('CHEGAR OPS API running on port 3000');
});
