const express = require('express');
const app = express();
app.use(express.json());

app.get('/', (request, response) => {
  response.send('Hello, Andrew!');
});

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
