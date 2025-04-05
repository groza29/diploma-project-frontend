import { use, useState } from 'react';
import InputField from '../components/InputField';
import Swal from 'sweetalert2';

const CreatePost: React.FC = () => {
  const [title, setTitle] = useState('');
  const [timestamp, setTimestamp] = useState<number>(Date.now());
  const formatDate = (timestamp: number) => new Date(timestamp).toISOString().split('T')[0];
  //   console.log('Timestamp', timestamp);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateStr = e.target.value;
    const newTimestamp = new Date(dateStr).getTime();
    if (newTimestamp >= Date.now()) {
      setTimestamp(newTimestamp);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Opsss',
        text: 'You can not chose an old date!',
        draggable: true,
        iconColor: '#0C969C',
        customClass: {
          confirmButton:
            'bg-primary font-thin text-text py-2 rounded-md mt-2 mb hover:bg-selected transition hover:text-white',
          title: 'font-thin',
        },
      });
    }
  };
  return (
    <div className="bg-background">
      <div className="flex lg:flex-row flex-col">
        <div className="lg:w-2/4 w-3/4 p-8">
          <div className="lg:w-2/4 w-3/4 min-w-48 flex justify-center items-center">
            <InputField
              label={'Title'}
              type={'text'}
              placeholder={'Title'}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
        </div>
        <div className="lg:w-2/4 w-3/4 p-8">
          <div className="lg:w-2/4 w-3/4 min-w-48 flex justify-center items-center">
            <InputField
              label={'Date of the Job'}
              type={'date'}
              placeholder={'Title'}
              value={formatDate(timestamp)}
              onChange={handleDateChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
