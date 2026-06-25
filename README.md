# Croak & Chatter

This project was made while learning EJS, Node, and Express for Angela Yu's Udemy course. It was also made while making highly questionable CSS decisions and getting far too emotionally invested in lily pads.
After making a slightly unhinged Tinder parody earlier in the course, I realised that “Toadr” would also have been an excellent concept. Sadly, that ship had sailed. Frogs, however, had not.

Croak & Chatter is messy, silly, and built with enthusiasm. If it entertains you even briefly, it has done its job.

My favourite feature, by far, is that it croaks.

## Features

- Add a new croak/post
- Edit existing posts
- Delete posts
- EJS-rendered pages and partials
- Responsive mobile layout

## Important Note

This was a simple learning project.
Posts do **not** persist after the server restarts because there is no database connected (and will probably never be). The app uses in-memory data.

Future improvements could include:

- Database persistence
- Pagination or “more croaks” loading
- Better post validation
- User accounts, maybe
- More suspicious frog behaviour

## Tech Stack

- Node.js
- Express
- EJS
- CSS
- JavaScript

## Sound Credits
- [Breviceps](https://freesound.org/people/Breviceps/) (Frog symphony)
- [Freesound Community](https://pixabay.com/sound-effects/search/user_id%3a46691455/) (Individual frog croaks)

## Getting Started

Install dependencies:
```npm install```

Start the application:
```npm start``` or ```node index.js```

Then open:
```http://localhost:3000```
