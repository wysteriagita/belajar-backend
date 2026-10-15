import app from './src/app.js';

const port = process.env.PORT || 3000;

app.listen(port, '0.0.0.0', () => {
  console.log(
    `[Server] running in environment ${process.env.NODE_ENV || 'development'} and at running on http://localhost:${port}`
  );
});
