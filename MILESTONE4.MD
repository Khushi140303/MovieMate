Milestone 04 - Final Project Documentation
===

NetID
---
ka2653

Name
---
Khushi Agarwal

Repository Link
---
https://github.com/nyu-csci-ua-0467-001-002-spring-2025/final-project-deployment-Khushi140303

URL for deployed site 
---
https://stunning-trout-69rg7r76xq7wc44j5-3000.app.github.dev

URL for form 1 (from previous milestone) 
---
https://stunning-trout-69rg7r76xq7wc44j5-3000.app.github.dev/

Special Instructions for Form 1
---
No login required. Visit the home page (`/`), fill out **Title**, **Genre**, and **Year**, then click **Add Movie**.

URL for form 2 (for current milestone)
---
https://stunning-trout-69rg7r76xq7wc44j5-3000.app.github.dev/reviews

Special Instructions for Form 2
---
Requires authentication.  
1. Register at `/auth/register`.  
2. Login at `/auth/login`.  
3. Navigate to `/reviews`, select a movie, rate it, and submit a comment.

URL for form 3 (from previous milestone) 
---
https://stunning-trout-69rg7r76xq7wc44j5-3000.app.github.dev/watchlist

Special Instructions for Form 3
---
Requires authentication.  
Add movies to your watchlist from the home page after login. View full watchlist at `/watchlist`.

First link to github line number(s) for constructor, HOF, etc.
---
https://github.com/nyu-csci-ua-0467-001-002-spring-2025/final-project-deployment-Khushi140303/blob/master/app.mjs#L103

Second link to github line number(s) for constructor, HOF, etc.
---
https://github.com/nyu-csci-ua-0467-001-002-spring-2025/final-project-deployment-Khushi140303/blob/master/app.mjs#L214

Short description for links above
---
- MovieEntry class is an ES6 constructor class for safely creating movie entries.
- `map()` is a higher-order function used to transform the raw movie documents into a formatted movie list for display.

Link to github line number(s) for schemas (db.js or models folder)
---
- User Schema: https://github.com/nyu-csci-ua-0467-001-002-spring-2025/final-project-deployment-Khushi140303/blob/master/user.js
- Movie Schema: https://github.com/nyu-csci-ua-0467-001-002-spring-2025/final-project-deployment-Khushi140303/blob/master/movie.js
- Review Schema: https://github.com/nyu-csci-ua-0467-001-002-spring-2025/final-project-deployment-Khushi140303/blob/master/review.js

Description of research topics above with points
---
- 5 points - Passport.js user authentication (registration, login, logout)
- 3 points - Axios used to fetch OMDb API movie details
- 2 points - TailwindCSS styling across all EJS pages
- 3 points - Configuration management using `config` npm module instead of only `.env`

Links to github line number(s) for research topics described above
---
- Passport.js authentication: https://github.com/nyu-csci-ua-0467-001-002-spring-2025/final-project-deployment-Khushi140303/blob/master/routes/auth.js
- OMDb API fetching with Axios: https://github.com/nyu-csci-ua-0467-001-002-spring-2025/final-project-deployment-Khushi140303/blob/master/utils/omdb.js
- TailwindCSS integration: https://github.com/nyu-csci-ua-0467-001-002-spring-2025/final-project-deployment-Khushi140303/tree/master/views
- Configuration management with `config` module: https://github.com/nyu-csci-ua-0467-001-002-spring-2025/final-project-deployment-Khushi140303/blob/master/app.mjs#L22

Optional project notes 
---
- Autocomplete suggestions when typing a movie title are implemented using OMDb's search API.
- Genre and Year are automatically filled after selecting a movie title.
- TailwindCSS is used for clean and responsive page styling.

Attributions
---
- routes/auth.js - Authentication based on Passport.js official documentation (http://passportjs.org/docs)
- utils/omdb.js - OMDb API usage pattern inspired by OMDb API documentation (https://www.omdbapi.com/)
- Styling - TailwindCSS CDN documentation (https://tailwindcss.com/docs/installation/play-cdn)
- Client-side validation - Patterns based on MDN Web Docs (https://developer.mozilla.org/en-US/docs/Learn/Forms/Form_validation)
