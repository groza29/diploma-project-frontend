import React from 'react';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';
import Image from '../components/Image';

const Home: React.FC = () => {
  const navigator = useNavigate();
  return (
    <div className="bg-background h-screen w-full">
      <section className="relative h-screen w-full flex items-center justify-center">
        <Image source="/images/home1.jpg" alt="Background" className="opacity-30" />
        <div className="justify-center items-center absolute top-60">
          <h1 className="text-7xl font-bold text-center text-primary ">Want to do something?</h1>
          <h1 className="text-3xl font-thin text-center text-text-secondary">
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
      <section className="relative h-screen w-full flex items-center lg:my-10 my-4">
        <div className="w-full flex justify-center py-4 flex-wrap">
          <div className="lg:w-2/5 lg:h-100 w-3/4 h-80 bg-gray-200 mx-10 items-center justify-center rounded-lg shadow-lg">
            <Image source="/images/home2.jpg" />
          </div>
          <div className="lg:w-2/5 lg:h-100 w-3/4 h-80 bg-gray-200 lg:mt-0 mt-2 mx-10 items-center justify-center rounded-lg shadow-lg">
            <Image source="/images/home3.jpg" />
          </div>
        </div>
      </section>
      <section className="w-full py-10 bg-red">
        <h1 className="text-3xl">Heading</h1>
      </section>
    </div>
  );
};

export default Home;
