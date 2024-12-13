import React, { useEffect, useState } from 'react';
import { fetchData } from '../services/api';

function Home() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchData('https://jsonplaceholder.typicode.com/posts/1')
      .then(setData)
      .catch(console.error);
  }, []);

  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      {data ? <p>{data.title}</p> : <p>Loading...</p>}
    </div>
  );
}

export default Home;
