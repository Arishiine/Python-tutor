# Python Tutor

A web app where learners paste Python code and get an analogy, a line-by-line trace, a variable table, simulated console output, debugging help and a next challenge. The model plays the interpreter; no code is actually executed.

## Structure
- `public/index.html` – the interface
- `api/chat.js` – serverless function that calls the Anthropic API
- `api/_prompt.js` – the tutor system prompt (edit here to change behaviour)

## Run locally
```bash
npm i -g vercel
cp .env.example .env      # add your ANTHROPIC_API_KEY
vercel dev

## Deploy on Vercel
1. vercel.com → Add New → Project → import the GitHub repo.
2. Framework preset: **Other**. Leave build settings empty.
3. Settings → Environment Variables → add `ANTHROPIC_API_KEY`.
4. Deploy. Or from the terminal: `vercel --prod`.

The app is public once deployed, so anyone with the link spends your API credits. Set a spend limit on your key and consider adding rate limiting before sharing widely.
