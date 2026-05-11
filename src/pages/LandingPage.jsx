import { useMemo, useState } from "react";
import Card from "../components/Card";
import EmptyState from "../components/EmptyState";
import ImageCard from "../components/ImageCard";
import LoadingState from "../components/LoadingState";
import SearchBar from "../components/SearchBar";
import imageFeed from "../libs/imageFeed";

function LandingPage() {
  const [query, setQuery] = useState("");
  const { images, isLoading, errorMessage } = imageFeed(query);

  const summary = useMemo(() => {
    if (!images.length) return "No results";

    if (query.trim()) {
      return `${images.length} result${images.length > 1 ? "s" : ""}`;
    }

    return `${images.length} posts`;
  }, [images.length, query]);

  return (
    <div className="page-stack">
      <section className="hero-panel">
        <div>
          <span className="eyebrow">Feed</span>
          <h2>Browse shared images</h2>
          <p>Search and explore uploaded content.</p>
        </div>

        {/* <Card className="hero-stats">
          <div>
            <span>Showing</span>
            <strong>{summary}</strong>
          </div>

          <div>
            <span>Search</span>
            <strong>Title / Caption</strong>
          </div>
        </Card> */}
      </section>

      <Card className="toolbar-panel">
        <SearchBar value={query} onChange={setQuery} />
      </Card>

      {isLoading && <LoadingState label="Loading feed..." />}

      {!isLoading && errorMessage && (
        <EmptyState title="Error" body={errorMessage} />
      )}

      {!isLoading && !errorMessage && (
        <>
          {images.length > 0 ? (
            <section className="image-grid">
              {images.map((img) => (
                <ImageCard key={img.id || img._id} image={img} />
              ))}
            </section>
          ) : (
            <EmptyState
              title="No results"
              body="Try a different search term."
            />
          )}
        </>
      )}
    </div>
  );
}

export default LandingPage;
