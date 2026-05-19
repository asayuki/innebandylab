const port = Number(process.env.API_PORT ?? 3000);

import app from './app';
app.listen(port, () => {
    console.log(`API listening on port ${port}`);
});