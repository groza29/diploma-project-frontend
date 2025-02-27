import React from 'react';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';
import Image from '../components/Image';
import InfoSection from '../components/InfoSection';
import IconsFooter from '../components/IconsFooter';
import ListFooter from '../components/ListFooter';

const Home: React.FC = () => {
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
            <h1 className="lg:text-3xl text-primary text-xl font-bold">Heading</h1>
            <h2 className="lg:text-2xl text-text-secondary text-md font-thin">Subheading</h2>
          </div>

          <InfoSection
            contentArray={[
              {
                title: 'Title',
                text: 'Body text for whatever you’d like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story.',
              },
              {
                title: 'Title',
                text: 'Body text for whatever you’d like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story.',
              },
              {
                title: 'Title',
                text: 'Body text for whatever you’d like to sxway. Add main takeaway points, quotes, anecdotes, or even a very very short story.',
              },
              {
                title: 'Title',
                text: 'Body text for whatever you’d like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story.',
              },
              {
                title: 'Title',
                text: 'Body text for whatever you’d like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story.',
              },
              {
                title: 'Title',
                text: 'Body text for whatever you’d like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story.',
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

export default Home;
