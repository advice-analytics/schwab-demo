import React from 'react';

interface ScoreProps {
  label: string;
  value: string | number;
  style?: { color: string; };
  scoreRight?: boolean;
}

const Score: React.FC<ScoreProps> = ({ label, value, style, scoreRight }) => (
  <>
    {scoreRight ? (
      <div className={`flex items-center`}>
        <p className={'mr-5 w-[7.5rem]'}>{label}</p>
        <b style={style} className={'text-lg'}>{value?.toLocaleString()}</b>
      </div>
    ) : (
      <div className={`flex items-center`}>
        <b style={style} className={'mr-5 w-[4rem] text-lg'}>{value?.toLocaleString()}</b>
        <p>{label}</p>
      </div>
    )}
  </>
);

export default Score;