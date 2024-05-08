'use client';

import React, { useRef, useState, ChangeEvent, DragEvent } from 'react';

import Image from 'next/image';

const FileUpload: React.FC<{ uploadURL: string }> = ({ uploadURL }) => {
    const [file, setFile] = useState<File | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);

    const handleDragOver = (event: DragEvent<HTMLFormElement>) => {
        event.preventDefault();
    };

    const handleDrop = (event: DragEvent<HTMLFormElement>) => {
        event.preventDefault();
        const files = event.dataTransfer.files;
        if (files.length > 0) {
            setFile(files[0]);
        }
    };

    const handleFileUploadClick = () => {
        if (inputRef?.current) {
            inputRef.current?.click();
        }
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;

        if (files && files.length > 0) {
            setFile(files[0]);
        }
    };

    const handleFileUpload = async () => {};

    return (
      <div className={'flex flex-col items-center gap-y-3'}>
        <form
          action={''}
          className={
            'h-[7rem] flex justify-center items-center cursor-pointer rounded-[0.6rem] border-[0.1rem] border-dashed border-grey w-[20rem]'
          }
          onClick={handleFileUploadClick}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <input
            type={'file'}
            ref={inputRef}
            hidden
            tabIndex={-1}
            onChange={handleFileChange}
          />
          <div className={'flex flex-col items-center'}>
            <p>Drag & drop, or click to select a file</p>
            <Image src={'/cloud.png'} alt={'Img'} width={36} height={36}/>
          </div>
        </form>
        <div>
          {file ? (
            <div className={'flex gap-x-2'}>
              <Image src={'/folder.png'} alt={'File'} width={24} height={24}/>
              <p>
                      <span className={'text-success'}>
                          <b>{file.name}</b>
                      </span>{' '}
                uploaded successfully
              </p>
            </div>
          ) : (
            <p className={'text-error'}>** No file selected **</p>
          )}
        </div>
        <div className={'w-full'}>
          <button
            className={'btn-primary bg-navyblue text-white mt-4 w-full h-10 rounded'}
            onClick={handleFileUpload}
          >
            Upload
          </button>
        </div>
      </div>
    );
};

export default FileUpload;
