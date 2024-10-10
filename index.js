const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
require('dotenv').config();

const app = express();

const vaultNameEnv = process.env.OBSIDIAN_VAULT;
const subfolderEnv = process.env.OBSIDIAN_SUBFOLDER;

app.get('/storygraph-to-obsidian', async (req, res) => {
	const { url } = req.query;

	if (!url) {
		return res.status(400).send('No URL provided');
	}

	try {
		const { data } = await axios.get(url);
		const $ = cheerio.load(data);

		// Extract the title and remove any subtitle after a colon
		let title = $('.book-title-author-and-series h3').contents().filter(function () {
			return this.type === 'text';
		}).text().trim();

		// Remove everything after a colon or new line character
		title = title.split(':')[0].trim();
		title = title.split('\n')[0].trim();

		const author = $('.book-title-author-and-series h3 > p')
			.first() // Ensure we're only selecting the first <p> that contains the authors
			.find('a') // Find all <a> elements inside that <p>
			.map(function() {
				return $(this).text().replace(/\s*\(.*?\)\s*/g, '').trim(); // Remove text in parentheses and trim whitespace
			})
			.get() // Convert the jQuery object to a regular array
			.join(', '); // Join the array elements into a comma-separated string

		// Construct the Obsidian note title and path
		const noteTitle = `${title} - ${author}`;
		const encodedNoteTitle = encodeURIComponent(noteTitle);
		const vaultName = encodeURIComponent(vaultNameEnv);
		const subfolder = subfolderEnv ? `${subfolderEnv}/` : '';
		const filePath = encodeURIComponent(`${subfolder}${noteTitle}`);

		// Construct the Obsidian deep link
		const obsidianLink = `obsidian://new?vault=${vaultName}&file=${filePath}`;

		res.send(obsidianLink);
	} catch (error) {
		console.log(error);
		res.status(500).send('Failed to fetch book details');
	}
});

const PORT = 3000;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
