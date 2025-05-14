import React from 'react';
import Carousel from 'react-material-ui-carousel';
import { Paper } from '@mui/material';
import Button from './Button';
import { Edit } from '@mui/icons-material';

interface PostCardProps {
  id: string;
  title: string;
  body: string;
  images?: string[];
  status: boolean;
  onSeeMore?: () => void;
  onEdit?: () => void;
}

const PostCard: React.FC<PostCardProps> = ({
  id,
  title,
  body,
  images,
  onSeeMore,
  status,
  onEdit,
}) => {
  return (
    <div className="flex justify-between items-start bg-white p-4 rounded-lg shadow-md border border-gray-200 w-full">
      <div className="flex gap-6 w-full">
        <div className="w-60 h-28">
          {images && images.length > 0 ? (
            <Carousel
              autoPlay={false}
              indicators={images.length > 1}
              navButtonsAlwaysVisible={images.length > 1}
              animation="slide"
              duration={300}
              className="h-full"
              navButtonsProps={{
                style: {
                  backgroundColor: 'rgba(0,0,0,0.4)',
                  borderRadius: 8,
                },
              }}
            >
              {images.map((src, index) => (
                <Paper
                  key={index}
                  elevation={0}
                  style={{ height: '100%', overflow: 'hidden', borderRadius: 8 }}
                >
                  <img
                    src={src}
                    alt={`Post image ${index + 1}`}
                    className="w-full h-28 object-cover rounded-md"
                  />
                </Paper>
              ))}
            </Carousel>
          ) : (
            <img
              src="/icons/image-placeholder.svg"
              alt="Placeholder"
              className="w-full h-full object-cover rounded-md bg-gray-100"
            />
          )}
        </div>
        <div className="flex flex-col justify-between w-full">
          <div>
            <div className="flex justify-between">
              <div className="flex flex-col justify-between ">
                <div className="max-w-20 lg:max-w-full">
                  <h3 className="text-lg font-bold text-text line-clamp-2 mb-1">
                    {title.length > 100 ? `${title.substring(0, 100)}...` : title}
                  </h3>
                </div>

                <div className="max-w-40 lg:max-w-full">
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {body.length > 120 ? `${body.substring(0, 120)}...` : body}
                  </p>
                </div>

                <div>
                  <Button
                    className="text-sm text-selected shadow-md"
                    nav={true}
                    onClick={onSeeMore}
                    text={'See who applied'}
                  />
                </div>
              </div>
              <div className="flex flex-col">
                {status ? (
                  <>
                    <h4 className="text-lg text-text mb-1 bg-selected bg-opacity-75 shadow-md rounded-xl p-2">
                      Open
                    </h4>
                  </>
                ) : (
                  <>
                    <h4 className="text-lg text-text mb-1 bg-red bg-opacity-75 shadow-md rounded-xl p-2">
                      Closed
                    </h4>{' '}
                  </>
                )}
                <Button text={'Edit'} onClick={onEdit} nav={true} icon={<Edit />} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
