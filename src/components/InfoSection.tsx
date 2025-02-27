import React from 'react';
import { InfoOutlined } from '@mui/icons-material';
import InfoItemType from '../models/InfoItemType';

interface InfoSectionProps {
  contentArray: Array<InfoItemType>;
}
const InfoSection: React.FC<InfoSectionProps> = ({ contentArray }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
      {contentArray.map((item, index) => (
        <div key={index} className="flex items-start space-x-3 p-6 bg-background rounded-lg">
          <InfoOutlined className="text-primary text-3xl" />
          <div>
            <h3 className="text-primary text-xl font-semibold">{item.title}</h3>
            <p className="text-text-secondary">{item.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default InfoSection;
