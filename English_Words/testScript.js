const axios = require('axios');

async function testSearchEndpoint(word) {
  try {
    await axios.get(`http://localhost:3000/api/search?w=${word}`);
    console.log(`Word "${word}" exists`);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      console.log(`Word "${word}" does not exist`);
    } else {
      console.error('Error testing search endpoint:', error);
    }
  }
}

async function testNormalizeEndpoint(word) {
  try {
    const response = await axios.post('http://localhost:3000/api/normalize', { word });
    console.log(`Normalized word for "${word}": ${response.data.normalizedWord}`);
  } catch (error) {
    console.error('Error testing normalize endpoint:', error);
  }
}

testSearchEndpoint('little');
testSearchEndpoint('big');
testSearchEndpoint('orange');
testSearchEndpoint('mice');
testSearchEndpoint('asdfasdf');
testSearchEndpoint('apple');

testNormalizeEndpoint('mice');
testNormalizeEndpoint('WoMaN');
testNormalizeEndpoint('Elephants');
testNormalizeEndpoint('GIRAFFES');
testNormalizeEndpoint('MONKEYS');
testNormalizeEndpoint('zebras');

