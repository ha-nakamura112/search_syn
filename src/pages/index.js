import React, { useState } from 'react';

function Home() {
  // const server = 'http://localhost:3000/';
  const server = 'https://search-syn.vercel.app/';
  
  const [ userInput, setUserInput] = useState('');
  const [ adv, setAdv ] = useState('too');
  const [ parsedResponse, setparsedResponse ] = useState('');

  const runPrompt = async (e) => {
    e.preventDefault();
    const formData = 
      {
        'word': userInput,
        'adv': adv
      }
    
    const response = await fetch(`${server}api/hello`, {
      method: 'POST',
      body:  JSON.stringify(formData),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    setparsedResponse(data);
  };
  

  return (
    <div>
      <form onSubmit={(e)=>runPrompt(e)}>
        <select onChange={(e)=>setAdv(e.target.value)}>
          <option value='too'>Too</option>
          <option value='very'>Very</option>
        </select>
        <input type='text' onChange={(e)=>setUserInput(e.target.value)}/>
        <button type='submit'>Convert</button>
      </form>
      <div>
        <h4>Synonyms</h4>
        { parsedResponse ? 
          parsedResponse.map((res)=>{
            return (
              <div key={res.index}>
                <h3>{res.word}</h3>
                <div>{res.meaning[0]}</div>
                <div>{res.meaning[1]}</div>
              </div>
            )
          })
        : null
      }

      </div>
    </div>
  );
}

export default Home;