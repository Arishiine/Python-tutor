# Python Tutor

- A web app where learners paste Python code and get an analogy, a line-by-line trace, a variable table, simulated console output, debugging help and a next challenge. The model plays the interpreter; no code is actually executed.
- You can access it [here](https://vercel.com/arishine-s-projects/python-tutor-vercel/94UvcrfgpAMB4kPGWhKUCSnz8Xwe)
# Structure
- `public/index.html` – the interface
- `api/chat.js` – serverless function that calls the Anthropic API
- `api/_prompt.js` – the tutor system prompt (edit here to change behaviour)
