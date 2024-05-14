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
      <div className={`flex`}>
        <p className={'mr-5 w-[8rem]'}>{label}</p>
        <b style={style}>{value?.toLocaleString()}</b>
      </div>
    ) : (
      <div className={`flex`}>
        <b style={style} className={'mr-5 w-[4rem]'}>{value?.toLocaleString()}</b>
        <p>{label}</p>
      </div>
    )}
  </>
);

export default Score;