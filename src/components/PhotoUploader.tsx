import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Button from './Button';

interface PhotoUploaderProps {
  onFilesSelected: (files: File[]) => void;
}

const PhotoUploader: React.FC<PhotoUploaderProps> = ({ onFilesSelected }) => {
  const [files, setFiles] = useState<File[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const updatedFiles = [...files, ...acceptedFiles];
      setFiles(updatedFiles);
      onFilesSelected(updatedFiles); // send to parent
    },
    [files, onFilesSelected]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: true,
  });

  return (
    <div className="flex flex-col lg:flex-row gap-8 p-6">
      {/* Left Side - Dropzone */}
      <div
        {...getRootProps()}
        className={`rounded-2xl p-6 text-center cursor-pointer transition duration-200 border-2 w-full lg:w-1/2 ${
          isDragActive
            ? 'border-selected border-dotted bg-selected bg-opacity-20'
            : 'border-text border-opacity-10 border-dashed hover:border-selected hover:border-dotted'
        }`}
      >
        <input {...getInputProps()} />
        <img
          src="/images/undraw_uploading_nu4x.svg"
          alt="upload"
          className="mx-auto w-32 h-32 object-contain"
        />
        <p className="text-lg font-light mt-4">Drag and drop photos to upload</p>
        <div className="mt-2">
          <Button text="Select files" />
        </div>
      </div>

      {/* Right Side - Preview List */}
      <div className="bg-background rounded-2xl p-4 w-full lg:w-1/2 border border-selected border-opacity-10 h-80 overflow-y-auto">
        {files.length === 0 ? (
          <p className="text-gray-400">No files selected</p>
        ) : (
          <ul className="space-y-4 pr-2">
            {files.map((file, index) => (
              <li key={index} className="flex items-center gap-4">
                <div className="w-16 h-16 bg-background flex items-center justify-center rounded-lg overflow-hidden">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-text font-medium">{file.name}</p>
                  <p className="text-sm text-text text-opacity-45">
                    {(file.size / 1024).toFixed(0)} KB
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default PhotoUploader;
