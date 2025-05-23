import React, { useState } from 'react';
import Carousel from 'react-material-ui-carousel';
import {
  Paper,
  Rating,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button as MuiButton,
} from '@mui/material';
import Button from './Button';
import { PostType } from '../pages/MyPosts';
import ReactMarkdown from 'react-markdown';

interface ApplicationCardProps {
  applicationId: string;
  post: PostType;
  feedback?: string;
  rating?: number;
  createdAt: number;
  accepted: string;
  status: boolean;
}

const ApplicationCard: React.FC<ApplicationCardProps> = ({
  post,
  feedback,
  rating,
  accepted,
  status,
}) => {
  const [openDialog, setOpenDialog] = useState(false);

  const getStatusClasses = (status: string) => {
    switch (status) {
      case 'Accepted':
        return 'bg-selected bg-opacity-75 text-text';
      case 'Rejected':
        return 'bg-red bg-opacity-75 text-text-';
      case 'In progress':
        return 'bg-yellow-700 bg-opacity-75 text-text';
    }
  };
  return (
    <>
      <div className="flex justify-between items-start bg-white p-4 rounded-lg shadow-md border border-gray-200 w-full mb-4">
        <div className="flex lg:flex-row flex-col gap-6 w-full">
          <div className="w-60 h-28">
            {post.imagesUrls?.length ? (
              <Carousel
                autoPlay={false}
                indicators={post.imagesUrls.length > 1}
                navButtonsAlwaysVisible={post.imagesUrls.length > 1}
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
                {post.imagesUrls.map((src, index) => (
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
            <div className="w-full flex items-center">
              <div className="flex flex-col w-1/2">
                <h3 className="text-lg font-bold text-text mb-1 line-clamp-2">
                  {post.title.length > 100 ? `${post.title.substring(0, 100)}...` : post.title}
                </h3>
                <div className="mb-2">
                  <ReactMarkdown>
                    {post.body.length > 120 ? `${post.body.substring(0, 120)}...` : post.body}
                  </ReactMarkdown>
                </div>

                <p className="text-sm text-text-secondary mb-1">
                  <strong>Post Status:</strong>{' '}
                  {post.status ? (
                    <span className="text-selected">Open</span>
                  ) : (
                    <span className="text-red">Closed</span>
                  )}
                </p>
                <div className="text-xs text-text-secondary mt-2">
                  ActionDate:{' '}
                  {post.actionDate ? new Date(Number(post.actionDate)).toLocaleDateString() : 'N/A'}
                </div>
              </div>

              <div className="flex flex-col gap-2 justify-end w-1/2">
                <div className={`flex justify-center p-2 rounded-xl ${getStatusClasses(accepted)}`}>
                  <p className="text-sm font-bold">{accepted}</p>
                </div>

                {rating !== undefined &&
                  accepted === 'Accepted' &&
                  post.status === false &&
                  status === false && (
                    <div>
                      <div className="flex justify-center items-center mt-2">
                        <Rating
                          size="small"
                          precision={0.5}
                          readOnly
                          max={5}
                          value={rating}
                          sx={{
                            '& .MuiRating-iconFilled': {
                              color: '#0C969C',
                            },
                            '& .MuiRating-iconEmpty': {
                              color: '#031716',
                            },
                          }}
                        />
                      </div>

                      <div className="flex items-center justify-center">
                        <Button
                          className="text-sm text-selected shadow-md mt-2"
                          nav={true}
                          onClick={() => setOpenDialog(true)}
                          text="See Feedback"
                        />
                      </div>
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feedback Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle className="font-semibold">Application Feedback</DialogTitle>
        <DialogContent dividers>
          {feedback ? (
            <>
              <p className="text-sm text-text mb-2">Feedback:</p>
              <p className="mb-4 text-base text-gray-800">{feedback}</p>
            </>
          ) : (
            <p className="text-sm text-text">No feedback provided.</p>
          )}

          {rating !== undefined && (
            <div>
              <Rating
                value={rating}
                readOnly
                precision={0.5}
                sx={{
                  '& .MuiRating-iconFilled': {
                    color: '#0C969C',
                  },
                  '& .MuiRating-iconEmpty': {
                    color: '#031716',
                  },
                }}
              />
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button text="Close" onClick={() => setOpenDialog(false)} />
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ApplicationCard;
