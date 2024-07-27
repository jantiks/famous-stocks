import React from 'react';

const Hero: React.FC = () => {
  return (
    <div className='contaier bg-clear'>
      <h1 className='text-2xl m-8 font-bold lg:text-4xl lg:m-12'>U.S. Congress and Senate Trading</h1>
      <p className='w-4/5 text-sm m-8 text-center mx-auto lg:w-2/4 lg:text-base lg:mb-12'>The Stock Trading on Congressional Knowledge Act requires U.S. Senators and U.S. Representatives to publicly file and disclose any financial transaction within 45 days of its occurrence. We download those disclosures, parse them for stock trades, fetch the stock's performance in the time following the transaction, and calculate each politician's cumulative return from their trades.
      </p>
    </div>
  );
};

export default Hero;