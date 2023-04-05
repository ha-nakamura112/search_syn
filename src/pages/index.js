import React, { useState } from 'react';

function Home() {
  const server = 'http://localhost:3000/';
  // const server = 'https://search-syn.vercel.app/';
  
  const [ userInput, setUserInput] = useState('');
  const [ parsedResponse, setparsedResponse ] = useState('');

  const runPrompt = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    // formData.append('first', e.target[0].value);
    // formData.append('word', userInput);
    const response = await fetch(`${server}api/hello`, {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();
    console.log(data);
    setparsedResponse(data);
  };
  

  return (
    <div>
      <form onSubmit={(e)=>runPrompt(e)}>
        <select name='first'>
          <option value='Too'>Too</option>
          <option value='Very'>Very</option>
        </select>
        <input type='text' name='word'/>
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