import React from 'react';
import { Job } from '../models/JobType';

interface ProfileJobProps {
  content: Job[];
}
const ProfileJob: React.FC<ProfileJobProps> = ({ content }) => {
  console.log(content);
  return (
    <div className="flex pt-2 flex-wrap gap-2">
      {content.map((item) => (
        <div className="p-2 rounded-2xl bg-selected bg-opacity-45">
          <span className="p-2 text-text text-sm font-semibold">{item.name}</span>
        </div>
      ))}
    </div>
  );
};

export default ProfileJob;
