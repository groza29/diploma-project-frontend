import React from 'react';
import Button from '../Button';
import { useNavigate } from 'react-router-dom';
import Image from '../Image';
import InfoSection from '../InfoSection';
import IconsFooter from '../IconsFooter';
import ListFooter from '../ListFooter';

const GuestHome: React.FC = () => {
  const navigator = useNavigate();
  return (
    <div className="bg-background h-screen w-full">
      <section className="relative h-screen w-full flex items-center justify-center">
        <Image source="/images/home1.jpg" alt="Background" className="opacity-30" />
        <div className="justify-center items-center absolute lg:top-60 top-30">
          <h1 className="lg:text-7xl text-3xl font-bold text-center text-primary ">
            Want to do something?
          </h1>
          <h1 className="lg:text-3xl text-xl font-thin text-center text-text-secondary">
            You are in the right place!{' '}
          </h1>
          <div className="flex justify-center gap-6 items-center">
            <Button
              text="Login"
              nav={true}
              className="bg-button"
              onClick={() => navigator('/login')}
            />
            <Button text="Sign up" onClick={() => navigator('/register')} />
          </div>
        </div>
      </section>
      <section className="w-full lg:w-screen lg:h-screen lg:items-center lg:flex bg-background overflow-hidden p-4">
        <div className="w-full flex justify-center py-4 flex-wrap">
          <div className="lg:w-2/5 lg:h-100 w-3/4 h-auto max-w-full block bg-gray-200 mx-10 items-center justify-center rounded-lg shadow-lg">
            <Image source="/images/home2.jpg" />
          </div>
          <div className="lg:w-2/5 lg:h-100 w-3/4 h-auto max-w-full block bg-gray-200 lg:mt-0 mt-2 mx-10 items-center justify-center rounded-lg shadow-lg">
            <Image source="/images/home3.jpg" />
          </div>
        </div>
      </section>
      <section className="w-full  py-10 bg-background">
        <div className=" lg:mx-20">
          <div className="mb-4 lg:ml-0 ml-4">
            <h1 className="lg:text-3xl text-primary text-xl font-bold">DoSo Benefits</h1>
            <h2 className="lg:text-2xl text-text-secondary text-md font-thin">
              Why you should join DoSo comunity?
            </h2>
          </div>

          <InfoSection
            contentArray={[
              {
                title: 'Discover Local Jobs Easily',
                text: 'Browse a curated feed of local, relevant jobs posted by people in your area. Whether it’s housework, gardening, or pet care—find work that fits your lifestyle.',
              },
              {
                title: 'Post Tasks, Get Help Fast',
                text: 'Need something done? Post a task, add images, and set a budget. Let reliable community members apply and help you get the job done.',
              },
              {
                title: 'Build Your Profile with Feedback',
                text: 'Applicants are rated and reviewed after every job, creating a transparent system that highlights reliability, quality, and communication.',
              },
              {
                title: 'Track Applications with Ease',
                text: 'As a task poster, view all applicants at a glance. Accept or reject with one click and manage your jobs through a clean, intuitive dashboard.',
              },
              {
                title: 'AI-Powered Feedback Insights',
                text: 'Our platform uses AI to turn user feedback and ratings into a smart performance score—helping top performers stand out and grow their reputation.',
              },
              {
                title: 'Grow Your Local Network',
                text: 'Beyond jobs, build connections in your community. Collaborate, share experiences, and grow your impact—one successful task at a time.',
              },
            ]}
          />
        </div>
      </section>
      <footer className="bg-header-background w-full h-100">
        <div className="grid lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 lg:p-6 lg:pb-20 p-6">
          <IconsFooter />
          <ListFooter
            title="Use Cases"
            items={[
              'UI design',
              'UX design',
              'Wireframing',
              'Diagramming',
              'Brainstorming',
              'Online whiteboard',
              'Team collaboration',
            ]}
          />
          <ListFooter
            title="Use Cases"
            items={[
              'UI design',
              'UX design',
              'Wireframing',
              'Diagramming',
              'Brainstorming',
              'Online whiteboard',
              'Team collaboration',
            ]}
          />
          <ListFooter
            title="Use Cases"
            items={[
              'UI design',
              'UX design',
              'Wireframing',
              'Diagramming',
              'Brainstorming',
              'Online whiteboard',
              'Team collaboration',
            ]}
          />
        </div>
      </footer>
    </div>
  );
};

export default GuestHome;
