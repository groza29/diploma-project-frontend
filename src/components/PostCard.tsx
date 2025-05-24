import React, { useState } from 'react';
import Carousel from 'react-material-ui-carousel';
import { Dialog, DialogActions, DialogContent, DialogTitle, Paper, Rating } from '@mui/material';
import Button from './Button';
import { Edit } from '@mui/icons-material';
import { User } from '../models/UsersModel';
import Links from './Links';
import MDEditor from '@uiw/react-md-editor';
import InputField from './InputField';

interface ApplicationWithUsers {
  id: string;
  user_id: string;
  post_id: string;
  feedback?: string;
  status: boolean;
  accepted: string;
  createdAt: number;
  rating?: number;
  user: User;
  actionDate: Date;
}

interface PostCardProps {
  id: string;
  title: string;
  body: string;
  images?: string[];
  status: boolean;
  onEdit?: () => void;
  actionDate?: Date;
  price?: string;
}

const PostCard: React.FC<PostCardProps> = ({
  id,
  title,
  body,
  images,
  status,
  onEdit,
  actionDate,
  price,
}) => {
  const token = localStorage.getItem('token');

  const [statusDialogApplications, setStatusDialogApplications] = useState<boolean>(false);
  const [applications, setApplications] = useState<ApplicationWithUsers[]>([]);
  const [loading, setLoading] = useState(false);
  const [application, setApplication] = useState<ApplicationWithUsers>();
  const [statusGiveFeedbackDialog, setStatusGiveFeedbackDialog] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string | undefined>();

  const [rating, setRating] = useState<number | null>(null);
  const todayMidnight = new Date();
  todayMidnight.setHours(0, 0, 0, 0);
  const todayTimestamp = todayMidnight.getTime();

  const isActionDatePast = Number(actionDate) < todayTimestamp;

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:3000/applications/post/${id}`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
        },
      });
      const data = await res.json();
      setApplications(data);
    } catch (err) {
      console.error('Failed to fetch applications', err);
    } finally {
      setLoading(false);
    }
  };
  const handleOpenDialog = () => {
    setStatusDialogApplications(true);
    fetchApplications();
  };
  const handleGiveFeedbackDialog = async () => {
    setStatusGiveFeedbackDialog(true);
    await fetchApplications();
    console.log('applications: ', applications);

    setApplication(applications.find((app) => app.status === false && app.accepted === 'Accepted'));
    console.log(application);
  };
  const handleAccept = async (applicationId: string) => {
    console.log(applicationId);
    try {
      const response = await fetch(`http://localhost:3000/accept/${applicationId}`, {
        method: 'PUT',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to accept application');
      }

      console.log(`Application ${applicationId} accepted`);
      setStatusDialogApplications(false);
    } catch (error) {
      console.error('Error accepting application:', error);
      alert('Could not accept the application.');
    }
  };

  const handleReject = async (applicationId: string) => {
    console.log(applicationId);
    try {
      const response = await fetch(`http://localhost:3000/reject/${applicationId}`, {
        method: 'PUT',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to reject application');
      }

      console.log(`Application ${applicationId} accepted`);
      setStatusDialogApplications(false);
    } catch (error) {
      console.error('Error rejecting application:', error);
      alert('Could not rejecting the application.');
    }
    console.log(`Rejected ${applicationId}`);
  };

  const handleSendFeedback = async () => {
    if (!rating || !feedback) {
      alert('Please give a rating and a feedback. Thank you!');
    }
    try {
      const response = await fetch(`http://localhost:3000/feedback/${application?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({
          feedback: feedback,
          rating: rating,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit feedback');
      }

      console.log('Feedback submitted!');
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };
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
                  <p className="text-sm text-text-secondary line-clamp-2">
                    {body.length > 120 ? `${body.substring(0, 120)}...` : body}
                  </p>
                  <p className="text-sm text-text-secondary ">
                    Price: <span className="text-primary">{price || '0'} LEI</span>
                  </p>
                </div>
                {!isActionDatePast && (
                  <div>
                    <Button text={'Edit'} onClick={onEdit} nav={true} icon={<Edit />} />
                  </div>
                )}
              </div>
              <div className="flex flex-col">
                <div className="flex items-end">
                  {status ? (
                    <>
                      <h4 className="text-lg text-text mb-1 bg-selected bg-opacity-75 shadow-md rounded-xl p-2 w-full flex justify-center">
                        Open
                      </h4>
                    </>
                  ) : (
                    <>
                      <h4 className="text-lg text-text mb-1 bg-red bg-opacity-75 shadow-md rounded-xl p-2 w-full flex justify-center">
                        Closed
                      </h4>{' '}
                    </>
                  )}
                </div>

                {!isActionDatePast && (
                  <Button
                    className="text-sm text-selected shadow-md"
                    nav={true}
                    onClick={handleOpenDialog}
                    text={'See who applied'}
                  />
                )}
                {isActionDatePast && !feedback && (
                  <Button text={'Give Feedback'} onClick={handleGiveFeedbackDialog} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Dialog
        open={statusDialogApplications}
        onClose={() => setStatusDialogApplications(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Applications</DialogTitle>
        <DialogContent dividers>
          {loading ? (
            <p>Loading applications...</p>
          ) : applications.length === 0 ? (
            <p>No one has applied yet.</p>
          ) : (
            applications.map((app) => (
              <div
                key={app.id}
                className="flex justify-between items-center border-b border-gray-200 py-3"
              >
                <div className="flex lg:flex-row flex-col">
                  <div>
                    <img
                      src={`http://localhost:3000/avatar/${app.user.id}`}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = './images/undraw_professional-woman-avatar_ivds.svg';
                      }}
                      alt={`${app.user.firstName} ${app.user.lastName}`}
                      className="w-20 h-20 rounded-full object-cover bg-gray-300"
                    />
                    <Links
                      text={'See profile'}
                      noUnderline={true}
                      route={`/profile/${app.user.id}`}
                    />{' '}
                  </div>
                  <div className="flex flex-col gap-1 pl-2">
                    <p className="font-semibold">
                      {app.user.firstName} {app.user.lastName}
                    </p>
                    <Rating
                      precision={0.5}
                      value={app.user.rating}
                      readOnly
                      max={5}
                      size="small"
                      sx={{
                        '& .MuiRating-iconFilled': {
                          color: '#0C969C',
                        },
                        '& .MuiRating-iconEmpty': {
                          color: '#031716',
                        },
                      }}
                    />
                    <p className="text-sm text-gray-600">{app.user.email}</p>
                    <p className="text-sm text-text">{app.user.phoneNumber}</p>
                  </div>
                </div>
                {app.accepted === 'In progress' && app.status && (
                  <div className="flex gap-2">
                    <Button onClick={() => handleAccept(app.id)} text={'Accept'} />

                    <Button
                      onClick={() => handleReject(app.id)}
                      text={'Reject'}
                      className="bg-red bg-opacity-90"
                    />
                  </div>
                )}
                {app.accepted === 'Accepted' && app.status && (
                  <div className="flex items-center justify-center">
                    <h2 className="px-6 py-4 bg-selected bg-opacity-60% text-text rounded-xl">
                      Accepted
                    </h2>
                  </div>
                )}

                {app.accepted === 'Accepted' && app.status === false && (
                  <div className="flex items-center justify-center">
                    <Button text={'Give Feedback'} onClick={() => console.log} />
                  </div>
                )}
                {app.accepted === 'Rejected' && app.status && (
                  <div className="flex items-center justify-center">
                    <h2 className="px-6 py-4 bg-red bg-opacity-60% text-text rounded-xl">
                      Rejected
                    </h2>
                  </div>
                )}
              </div>
            ))
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusDialogApplications(false)} text={'Close'} />
        </DialogActions>
      </Dialog>
      <Dialog
        open={statusGiveFeedbackDialog}
        onClose={() => setStatusGiveFeedbackDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Feedback</DialogTitle>
        <DialogContent dividers>
          {loading ? (
            <p>Loading applications...</p>
          ) : !application ? (
            <p>You have no one to give feedback.</p>
          ) : (
            <>
              <div className="flex justify-between">
                <div className="w-1/3 flex flex-col">
                  <img
                    src={`http://localhost:3000/avatar/${application.user.id}`}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = './images/undraw_professional-woman-avatar_ivds.svg';
                    }}
                    alt={'avatar'}
                    className="w-28 h-28 rounded-full object-cover bg-gray-300"
                  />
                  <div className="mt-4 flex flex-col">
                    <h4 className="text-xl text-text font-semibold">
                      {application.user.lastName} {application.user.firstName}
                    </h4>
                    <h5 className="text-text-secondary font-thin">{application.user.email}</h5>
                    <h5 className="text-text-secondary font-thin">
                      {application.user.phoneNumber}
                    </h5>
                  </div>
                </div>
                <div className="w-2/3 flex flex-col items-center justify-center">
                  <div className="w-full">
                    <InputField
                      label={'Feedback'}
                      type={'text'}
                      placeholder={'Write something here'}
                      value={feedback ?? ''}
                      onChange={(e) => setFeedback(e.target.value)}
                    />{' '}
                  </div>

                  <div className=" flex items-center justify-center pt-2">
                    <Rating
                      size="large"
                      value={rating}
                      onChange={(_, newValue) => setRating(newValue)}
                      precision={0.5}
                      sx={{
                        '& .MuiRating-iconFilled': {
                          color: '#0C969C',
                        },
                        '& .MuiRating-iconEmpty': {
                          color: '#031716',
                        },
                      }}
                    />{' '}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button text={'Send Feedback'} onClick={handleSendFeedback} />
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default PostCard;
