import React from 'react';

const BackgroundDecor: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Premium Blurred Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-110 blur-[100px] opacity-40"
        style={{ backgroundImage: 'url("/images/premium_bg.png")' }}
      />
      
      {/* Warm Gradient Texture */}
      <div className="absolute inset-0 bg-gradient-to-br from-bronze/5 via-transparent to-obsidian/5 opacity-30" />
      
      {/* Light Cream Overlay (#F5EDE3) */}
      <div className="absolute inset-0 bg-background/85" />
      
      {/* Subtle Grain/Noise (Optional for premium feel) */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    </div>
  );
};

export default BackgroundDecor;
