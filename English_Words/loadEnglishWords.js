const fs = require('fs');
const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://hayksargsyan2015:980501hayk@cluster1.6vqcva1.mongodb.net/?retryWrites=true&w=majority';
const databaseName = 'tazaDatabase';
const collectionName = 'words_alpha';

async function insertWords(words) {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(databaseName);
    const collection = db.collection(collectionName);
    await collection.insertMany(words);
    console.log('Words inserted successfully.');
  } catch (error) {
    console.error('Error inserting words:', error);
  } finally {
    await client.close();
  }
}

async function loadWords() {
  const words = fs.readFileSync('words_alpha.txt', 'utf8')
    .split('\n')
    .map((word) => ({ word: word.trim() }));

  await insertWords(words);
}

loadWords();

