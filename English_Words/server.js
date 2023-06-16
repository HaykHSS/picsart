const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

mongoose.connect('mongodb+srv://hayksargsyan2015:980501hayk@cluster1.6vqcva1.mongodb.net/tazaDatabase?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  });

app.use(bodyParser.json());

const EnglishWord = mongoose.model('EnglishWord', new mongoose.Schema({
  word: String
}), 'words_alpha');

app.get('/api/search', (req, res) => {
  const word = req.query.w.toLowerCase();

  EnglishWord.findOne({ word })
    .then((result) => {
      if (result) {
        res.sendStatus(200);
      } else {
        res.status(404).json({ error: 'The word does not exist' });
      }
    })
    .catch((error) => {
      console.error('Error searching for word:', error);
      res.sendStatus(500);
    });
});

app.post('/api/normalize', (req, res) => {
  const word = req.body.word.toLowerCase();

  const normalizedWord = word.endsWith('s') ? word.slice(0, -1) : word;

  res.json({ normalizedWord });
});

app.get('/', (req, res) => {
  res.send('There is no page, open another terminal and run test file with node!');
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

