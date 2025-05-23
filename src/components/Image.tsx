interface ImageProps {
  source: string;
  alt?: string;
  className?: string;
}

const Image: React.FC<ImageProps> = ({ source, alt, className }) => {
  return (
    <>
      <img
        src={`${source}` || '/images/undraw_photos_09tf.svg'}
        onError={(e) => {
          e.currentTarget.onerror = null;
        }}
        alt={`${alt}`}
        className={`w-full h-full object-cover rounded-lg shadow-lg ${className}`}
      />
    </>
  );
};

export default Image;
