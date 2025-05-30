const express = require('express');
const { request } = require('undici');
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
		const response = await request(url, {
			headers: {
				'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
				'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
				'Accept-Language': 'en-US,en;q=0.5',
				'Referer': 'https://app.thestorygraph.com/',
				'Cache-Control': 'max-age=0'
			}
		});

		const data = await response.body.text();
		const $ = cheerio.load(data);

		// Extract the book title
		let title = $('.book-title-author-and-series h3').contents().filter(function() {
			return this.type === 'text';
		}).text().trim();

		// Remove any subtitle after a colon or new line character
		title = title.split(':')[0].trim();
		title = title.split('\n')[0].trim();

		// Extract the authors' names
		const authors = [];
		$('.book-title-author-and-series h3 p a').each(function() {
			const href = $(this).attr('href') || '';
			if (href.includes('authors')) {
				authors.push($(this).text().trim());
			}
		});

		// Ensure unique authors and join them
		const uniqueAuthors = [...new Set(authors)];
		const authorString = uniqueAuthors.join(', ');

		// Construct the Obsidian note title and path
		const noteTitle = `${title} - ${authorString}`;
		const encodedNoteTitle = encodeURIComponent(noteTitle);
		const vaultName = encodeURIComponent(vaultNameEnv);
		const subfolder = subfolderEnv ? `${subfolderEnv}/` : '';
		const filePath = encodeURIComponent(`${subfolder}${noteTitle}`);

		// Construct the note content with YAML frontmatter
		const content = encodeURIComponent(`---\nstatus: Unread\n---\n- `);

		// Construct the Obsidian deep link
		const obsidianLink = `obsidian://new?vault=${vaultName}&file=${filePath}&content=${content}`;

		res.send(obsidianLink);
	} catch (error) {
		console.error('Error details:', {
			message: error.message,
			stack: error.stack
		});
		res.status(500).send('Failed to fetch book details');
	}
});

const PORT = 3000;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
