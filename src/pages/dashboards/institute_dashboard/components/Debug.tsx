import React from 'react';

const Debug = () => {
  const localStorageData = {
    user: localStorage.getItem('user'),
    token: localStorage.getItem('token'),
    // add other keys you want to check
  };

  return (
    <div className="fixed bottom-4 right-4 p-4 bg-black/80 text-white rounded-lg max-w-sm">
      <h3 className="font-bold mb-2">LocalStorage Debug:</h3>
      <pre className="text-xs">
        {JSON.stringify(localStorageData, null, 2)}
      </pre>
    </div>
  );
};

export default Debug; 