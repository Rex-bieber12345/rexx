const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/searchDB', { useNewUrlParser: true, useUnifiedTopology: true });

const searchSchema = new mongoose.Schema({
    title: String,
    description: String,
    url: String
});

const Search = mongoose.model('Search', searchSchema);

app.post('/search', async (req, res) => {
    const query = req.body.query;
    try {
        const results = await Search.find({ $text: { $search: query } });
        res.json(results);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

Search.collection.createIndex({ title: "text", description: "text" });

document.getElementById('searchForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const query = document.getElementById('searchInput').value;

    const response = await fetch('/search', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query })
    });

    const results = await response.json();
    displayResults(results);
});

function displayResults(results) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    if (results.length === 0) {
        resultsDiv.innerHTML = '<p>No results found</p>';
        return;
    }

    results.forEach(result => {
        const resultItem = document.createElement('div');
        resultItem.classList.add('result-item');

        const title = document.createElement('h2');
        title.textContent = result.title;

        const description = document.createElement('p');
        description.textContent = result.description;

        const link = document.createElement('a');
        link.href = result.url;
        link.textContent = 'Visit';

        resultItem.appendChild(title);
        resultItem.appendChild(description);
        resultItem.appendChild(link);

        resultsDiv.appendChild(resultItem);
    });
}
