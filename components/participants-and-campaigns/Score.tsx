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
        <p className={'mr-5'}>{label}</p>
        <b style={style}>{value}</b>
      </div>
    ) : (
      <div className={`flex`}>
        <b style={style} className={'mr-5'}>{value}</b>
        <p>{label}</p>
      </div>
    )}
  </>
);

export default Score;