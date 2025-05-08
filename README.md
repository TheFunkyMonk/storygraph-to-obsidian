# Storygraph to Obsidian

> [!IMPORTANT]
> Unfortunately, The Storygraph has recently implemented Cloudflare protection that prevents this from working. I've reached out to them to see if they can lighten up their scraping protections because it's even broken metadata previews in iOS Messages and other platforms, and will update this accordingly if it's able to work again.

Welcome to **Storygraph to Obsidian**, a super niche app that probably only I will ever use. Though if you also use **The Storygraph** for tracking your books and **Obsidian** for notes, and have thought about automating the process of creating book notes, boy are you in luck.

![](https://i.imgur.com/6pUIrfW.gif)

## What Does It Do?

This app creates a Node.js API endpoint that takes a URL to a book from The Storygraph and converts it into a deep link for Obsidian. Because why spend 10 seconds typing out the title and author of a book when you could spend a whole work day automating it?

With this, you can create a new note in a specified directory with the title formatted as *Book Title - Author*.

## Getting Started

1. **Clone this repository**:
   ```bash
   git clone https://github.com/yourusername/storygraph-to-obsidian.git
   cd storygraph-to-obsidian
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up your environment variables**:
   Create a `.env` file in the root directory and add:
   ```
   OBSIDIAN_VAULT=your-vault-name
   OBSIDIAN_SUBFOLDER=your-subfolder-name (optional)
   ```

4. **Run the server**:
   ```bash
   node index.js
   ```

5. **Use the API**:
   Make a GET request to `http://localhost:3000/storygraph-to-obsidian?url=your-book-url`. Replace `your-book-url` with the URL of the book you want to convert.

   Example:
   ```
   http://localhost:3000/storygraph-to-obsidian?url=https://app.thestorygraph.com/books/your-book-id
   ```

   And voilà! You’ll get an Obsidian deep link in return!

## Automate It (Optional)

If you're feeling particularly fancy, you can throw this on a server and set up an automation using **iOS Shortcuts** (or probably whatever the Android equivalent is) to quickly create notes without lifting a finger! (Well, except to tap a button or two.)

## License

This project is licensed under the MIT License. Feel free to use it, modify it, or ignore it entirely.
