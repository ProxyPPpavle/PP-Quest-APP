
import React, { useEffect, useRef } from 'react';

interface AdProps {
  id: string;
  type: 'banner' | 'banner_small';
}

export const AdsterraAd: React.FC<AdProps> = ({ id, type }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const instanceId = useRef(`ad-${Math.random().toString(36).substr(2, 9)}`);

  useEffect(() => {
    if (!containerRef.current || !id) return;

    // Clear previous content
    containerRef.current.innerHTML = '';
    
    const height = type === 'banner_small' ? 50 : 60;
    const width = type === 'banner_small' ? 320 : 468;

    const adWrapper = document.createElement('div');
    adWrapper.id = `container-${id}-${instanceId.current}`;
    containerRef.current.appendChild(adWrapper);

    const scriptOptions = document.createElement('script');
    scriptOptions.type = 'text/javascript';
    scriptOptions.innerHTML = `
      atOptions = {
        'key' : '${id}',
        'format' : 'iframe',
        'height' : ${height},
        'width' : ${width},
        'params' : {}
      };
    `;
    
    const scriptInvoke = document.createElement('script');
    scriptInvoke.type = 'text/javascript';
    scriptInvoke.src = `https://www.highperformanceformat.com/${id}/invoke.js`;
    
    containerRef.current.appendChild(scriptOptions);
    containerRef.current.appendChild(scriptInvoke);
  }, [id, type]);

  return (
    <div 
      ref={containerRef} 
      className="flex justify-center items-center overflow-hidden my-4 w-full min-h-[60px] opacity-100"
    />
  );
};
