import React from 'react';

const Token = ({ type }: { type: 'sight' | 'sound' }) => {
  return <div className={`${type}-token`} />;
};

export default Token;
