import React from 'react';

interface PostCardProps {
  id: string;
  title: string;
  body: string;
  photoUrl?: string;
  onSeeMore?: () => void;
}

const PostCard: React.FC<PostCardProps> = ({ id, title, body, photoUrl, onSeeMore }) => {
  return (
    <div className="flex justify-between items-start bg-white p-4 rounded-lg shadow-md border border-gray-200">
      <div className="flex gap-4">
        <img
          src={photoUrl || '/icons/image-placeholder.svg'}
          alt="Post"
          className="w-20 h-20 object-cover rounded-md bg-gray-100"
        />
        <div>
          <h3 className="text-lg font-bold text-text mb-1">{title}</h3>
          <p className="text-sm text-gray-600 line-clamp-2">
            {body.length > 120 ? `${body.substring(0, 120)}...` : body}
          </p>
        </div>
      </div>
      <button
        onClick={onSeeMore}
        className="text-teal-600 text-sm hover:underline whitespace-nowrap ml-4"
      >
        See more
      </button>
    </div>
  );
};

export default PostCard;
