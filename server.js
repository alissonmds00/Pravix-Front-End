const express = require('express');
const path = require('path');
const app = express();
const PORT = 998;

app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Serve other HTML files without adding .html extension
app.get('/:page', (req, res) => {
  const page = req.params.page;
  const filePath = path.join(__dirname, `${page}.html`);
  res.sendFile(filePath, (err) => {
    if (err) {
      res.redirect('/');
    }
  });
});

app.get(['/inicio', '/pravix'], (req, res) => {
  res.redirect('/');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
