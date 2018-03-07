# Mechas and Kaiju
Mechas and Kaiju is a two-player team based battle game built with React and Express.
Build your battle team, and challenge your friends to a 3v3 fight in the far-flung future world of 2001.

## Play Now
[Play Mechas and Kaiju](https://projectwhitelotus.herokuapp.com)

## Features
### Team-based strategy

   Consider your mechas' unique passive abilities and kaiju's special attacks to synergize your team.
### Procedurally generated monsters

   Mechas and Kaiju are constructed from modular head, body, and arm parts with unique attacks, abilities, and types. Win battles to buy new monsters for your team.
### Three damage types, and three monster types

   Pierce attacks are weak against Reflect type, and strong against Harden type.
   Crush attacks are weak against Absorb type, and strong against Reflect type.
   Spray attacks are weak against Harden type, and strong against Absorb type.

## Dependencies
### React Dependencies

- "enzyme": "^3.2.0",
- "enzyme-adapter-react-16": "^1.1.0",
- "jimp": "^0.2.28",
- "jsdom": "^11.5.1",
- "knex": "^0.14.2",
- "milligram": "^1.3.0",
- "react": "^16.2.0",
- "react-cookie": "^2.1.2",
- "react-dom": "^16.2.0",
- "react-router-dom": "^4.2.2",
- "react-scripts": "1.0.17",
- "sass": "^1.0.0-beta.4",
- "uuid": "^3.1.0"
### Express Dependencies

- "bcrypt": "^1.0.3",
- "body-parser": "^1.18.2",
- "bookshelf": "^0.12.0",
- "cookie-parser": "^1.4.3",
- "cookie-session": "^2.0.0-beta.3",
- "dotenv": "^4.0.0",
- "express": "^4.16.2",
- "express-ws": "^3.0.0",
- "jest": "^21.2.1",
- "jimp": "^0.2.28",
- "knex": "^0.13.0",
- "uuid": "^3.1.0",
- "ws": "^3.3.2",
- "pg": "^7.4.0"

## Local Installation
1. Make sure you have [PostgreSQL](https://www.postgresql.org/download/) installed.
2. Fork and clone this repo.
3. Create a new PostgreSQL database.
4. Create a `.env` (see `.env.example` for required fields).
5. Install dependencies.

   In one terminal, run `npm i`.
   From a second terminal, `cd lotus_server && npm i`.

6. Run database migrations and seed data.

   From the second terminal (in the `lotus_server` folder), run `knex migrate:latest && knex seed:run`.

7. Start the app.

   From the first terminal (in `project-white-lotus`), run `npm run devstart`.
   From the second terminal, run `npm run start`.

8. Play the game!

   Visit `localhost:3000` to get started!
