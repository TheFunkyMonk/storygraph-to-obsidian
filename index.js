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

		// Extract the book title (text directly inside the h3 tag, excluding any child HTML)
		let title = $('.book-title-author-and-series h3').contents().filter(function() {
			return this.type === 'text';
		}).text().trim();

		// Remove any subtitle after a colon or new line character
		title = title.split(':')[0].trim();
		title = title.split('\n')[0].trim();

		// Extract the authors' names from anchor tags inside the p tag with authors in the href
		const authors = [];
		$('.book-title-author-and-series h3 p a').each(function() {
			const href = $(this).attr('href') || '';
			if (href.includes('authors')) {
				authors.push($(this).text().trim());
			}
		});

		// Ensure unique authors and join them into a comma-separated string
		const uniqueAuthors = [...new Set(authors)];
		const authorString = uniqueAuthors.join(', ');

		// Construct the Obsidian note title and path
		const noteTitle = `${title} - ${authorString}`;
		const encodedNoteTitle = encodeURIComponent(noteTitle);
		const vaultName = encodeURIComponent(vaultNameEnv);
		const subfolder = subfolderEnv ? `${subfolderEnv}/` : '';
		const filePath = encodeURIComponent(`${subfolder}${noteTitle}`);

		// Construct the note content with YAML frontmatter and bulleted list
		const content = encodeURIComponent(`---\nstatus: Unread\n---\n- `);

		// Construct the Obsidian deep link
		const obsidianLink = `obsidian://new?vault=${vaultName}&file=${filePath}&content=${content}`;

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
