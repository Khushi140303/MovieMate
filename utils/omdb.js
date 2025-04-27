import axios from 'axios';
import config from 'config'; // ✅ import config

const OMDB_API_KEY = config.get('omdbApiKey'); // ✅ get from config

export async function fetchMovieDetails(title) {
  const encodedTitle = encodeURIComponent(title);

  try {
    // 1️⃣ First, loose search
    const searchUrl = `http://www.omdbapi.com/?apikey=${OMDB_API_KEY}&s=${encodedTitle}`;
    const searchResponse = await axios.get(searchUrl);

    if (searchResponse.data.Response === "True" && searchResponse.data.Search.length > 0) {
      const correctedTitle = searchResponse.data.Search[0].Title;

      // 2️⃣ Then exact lookup
      const detailsUrl = `http://www.omdbapi.com/?apikey=${OMDB_API_KEY}&t=${encodeURIComponent(correctedTitle)}`;
      const detailsResponse = await axios.get(detailsUrl);

      const data = detailsResponse.data;

      if (data.Response === "True") {
        return {
          title: data.Title,
          genre: data.Genre.split(", "),
          year: parseInt(data.Year),
        };
      }
    }

    // 3️⃣ If no match at all
    return null;

  } catch (err) {
    console.error("OMDb fetch failed:", err);
    return null;
  }
}

