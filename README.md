# Lumen Gallery

Lumen Gallery is a React frontend for a photo-sharing media app built for a university assignment. It supports two user roles in the UI:

- Consumers can browse a responsive image feed, search images by title or caption, open image details, add comments, and submit ratings.
- Creators can use a dashboard form to upload a photo with metadata including title, caption, location, and tagged people.

The project is ready to connect to a REST backend through Axios and `VITE_API_BASE_URL`. While no backend is configured, the gallery uses realistic fallback data so the interface still works during frontend development and demos.

## Stack

- React with Vite
- React Router
- Axios
- Custom CSS

## Project structure

```text
src/
  components/
  data/
  libs/
  pages/
  services/
  styles/
```

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create an environment file:

```bash
cp .env.example .env
```

3. Update the API base URL in `.env` if your backend runs on a different address.

4. Start the development server:

```bash
npm run dev
```

5. Build for production:

```bash
npm run build
```

## Expected API shape

The frontend is prepared for these endpoints:

- `GET /images`
- `GET /images/:id`
- `POST /images`
- `POST /images/:id/comments`
- `POST /images/:id/ratings`
- `POST /auth/login`
- `POST /auth/signup`

## Notes

- Search filters by title and caption.
- Uploads use `multipart/form-data`.
- Authentication screens are included as UI only.
- If the backend is unavailable, read operations fall back to local mock data so the assignment can still be reviewed visually.
