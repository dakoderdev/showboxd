import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const TMDB_HEADERS = {
  Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
  accept: "application/json",
};

const IMPORTANT_CREW_JOBS = ["Executive Producer", "Director", "Producer", "Writer", "Creator"];

const STREAMING_NORMALIZE = {
  "Netflix": "Netflix",
  "Netflix Standard with Ads": "Netflix",
  "Hulu": "Hulu",
  "Amazon Prime Video": "Amazon Prime Video",
  "Amazon Prime Video with Ads": "Amazon Prime Video",
  "Max": "HBO Max",
  "HBO Max": "HBO Max",
  "HBO Max Amazon Channel": "HBO Max",
  "Apple TV": "Apple TV",
  "Apple TV+": "Apple TV",
  "Disney Plus": "Disney Plus",
  "Disney+": "Disney Plus",
  "Paramount Plus Premium": "Paramount+",
  "Paramount Plus Essential": "Paramount+",
  "Paramount Plus Apple TV Channel ": "Paramount+",
  "Paramount+ Amazon Channel": "Paramount+",
  "Paramount+ Roku Premium Channel": "Paramount+",
};

const SKIP = ["Euphoria"];

async function fetchShowDetail(id) {
  const [detail, ratings, credits, providers] = await Promise.all([
    fetch(`https://api.themoviedb.org/3/tv/${id}`, { headers: TMDB_HEADERS }).then(r => r.json()),
    fetch(`https://api.themoviedb.org/3/tv/${id}/content_ratings`, { headers: TMDB_HEADERS }).then(r => r.json()),
    fetch(`https://api.themoviedb.org/3/tv/${id}/credits`, { headers: TMDB_HEADERS }).then(r => r.json()),
    fetch(`https://api.themoviedb.org/3/tv/${id}/watch/providers`, { headers: TMDB_HEADERS }).then(r => r.json()),
  ]);

  const age_rating = ratings.results?.find(r => r.iso_3166_1 === "US")?.rating ?? null;

  const cast = (credits.cast ?? []).slice(0, 16).map(c => c.name);

  const crew = (credits.crew ?? [])
    .filter(c => IMPORTANT_CREW_JOBS.includes(c.job))
    .map(c => c.name)
    .filter((name, i, arr) => arr.indexOf(name) === i);

  const usProviders = providers.results?.US;
  const rawStreaming = [
    ...(usProviders?.flatrate ?? []),
    ...(usProviders?.free ?? []),
  ].map(p => p.provider_name);
  const streaming = [...new Set(rawStreaming.map(s => STREAMING_NORMALIZE[s]).filter(Boolean))];

  return { detail, age_rating, cast, crew, streaming };
}

function toSqlValue(val) {
  if (val === null) return "NULL";
  if (typeof val === "boolean") return val ? "TRUE" : "FALSE";
  if (typeof val === "number") return val;
  return `'${String(val).replace(/'/g, "''")}'`;
}

async function run() {
  const res = await fetch("https://api.themoviedb.org/3/tv/popular?language=en-US&page=2", { headers: TMDB_HEADERS });
  if (!res.ok) {
    console.log("Request failed:", res.status, res.statusText);
    return;
  }

  const data = await res.json();
  const shows = data.results.slice(0, 20).filter(s => !SKIP.includes(s.name));

  const rows = [];
  for (const show of shows) {
    const { detail, age_rating, cast, crew, streaming } = await fetchShowDetail(show.id);
    rows.push({
      name: detail.name,
      img_vertical: detail.poster_path ? `https://image.tmdb.org/t/p/w500${detail.poster_path}` : null,
      description: detail.overview ?? null,
      seasons: detail.number_of_seasons ?? null,
      ongoing: detail.status === "Returning Series" || detail.status === "In Production",
      age_rating,
      release_year: detail.first_air_date ? parseInt(detail.first_air_date.split("-")[0]) : null,
      cast,
      crew,
      streaming,
    });
  }

  const sql = rows.map(r =>
    `INSERT INTO public.shows (name, img_vertical, description, seasons, ongoing, age_rating, release_year, "cast", crew, streaming_sites) VALUES (${toSqlValue(r.name)}, ${toSqlValue(r.img_vertical)}, ${toSqlValue(r.description)}, ${toSqlValue(r.seasons)}, ${toSqlValue(r.ongoing)}, ${toSqlValue(r.age_rating)}, ${toSqlValue(r.release_year)}, '${String(JSON.stringify(r.cast)).replace(/'/g, "''")}', '${String(JSON.stringify(r.crew)).replace(/'/g, "''")}', '${String(JSON.stringify(r.streaming)).replace(/'/g, "''")}');`
  ).join("\n");

  console.log(sql);
}

run();