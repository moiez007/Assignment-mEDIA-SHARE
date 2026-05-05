import { Link } from 'react-router-dom';
import Card from './Card';
import RatingStars from './RatingStars';

function ImageCard({ image }) {
  return (
    <Card className="image-card">
      <Link to={`/images/${image.id || image._id}`} className="image-link">
        <div className="image-frame">
          <img src={image.imageUrl || image.url} alt={image.title} />
        </div>

        <div className="image-copy">
          <div className="image-copy-top">
            <div>
              <h3>{image.title}</h3>
              <p>{image.location}</p>
            </div>

            <span>{image.comments?.length || 0} comments</span>
          </div>

          <p className="image-caption">{image.caption}</p>

          <div className="image-meta">
            <span>By {image.author || image.creator || 'Unknown'}</span>

            <div className="image-rating">
              <RatingStars
                value={Math.round(image.rating || 0)}
                readonly
                size="sm"
              />
              <span>{(image.rating || 0).toFixed(1)}</span>
            </div>
          </div>
        </div>
      </Link>
    </Card>
  );
}

export default ImageCard;