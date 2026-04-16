import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import authRoutes from './routes/authRoutes.js';
import charityRoutes from './routes/charityRoutes.js';
import subscriptionRoutes from './routes/subscriptionRoutes.js';
import scoreRoutes from './routes/scoreRoutes.js';
import drawRoutes from './routes/drawRoutes.js';
import winnerRoutes from './routes/winnerRoutes.js';

const app = express();

// Middleware - Ensuring CORS is fully open for dev
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/charities', charityRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/scores', scoreRoutes);
app.use('/api/draws', drawRoutes);
app.use('/api/winners', winnerRoutes);

// Basic route
app.get('/', (req, res) => {
  res.send('PlayForCause API is running...');
});

const PORT = process.env.PORT || 5005;

app.listen(PORT, () => {
  console.log(`🚀 Server ready at: http://localhost:${PORT}`);
});
