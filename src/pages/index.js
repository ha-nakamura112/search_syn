import React, { useState } from 'react';


// const server = 'http://localhost:3000/';
const server = 'https://search-syn.vercel.app/';

const fetchDatas = async () => {
  try {
    const res = await fetch(`${server}/data/info.json`);
    const data = await res.json();
    return data;
  }
  catch(err) {
    console.log(err);
  }
};

export async function getStaticProps() {
  const data = await fetchDatas();
  return {
    props: {
      number: data.numbers,
      language: data.languages
    },
  };
}

function Home( { number, language } ) {
  const [ num, setNum ] = useState(1)
  const [ lang, setLang ] = useState('Japanese')
  const [ userInput, setUserInput] = useState('');
  const [ adv, setAdv ] = useState('too');
  const [ msg, setMsg ] = useState(null);
  const [ parsedResponse, setparsedResponse ] = useState('');

  const runPrompt = async (e) => {
    e.preventDefault();
    const sendData = 
      {
        'word': userInput,
        'adv': adv,
        'num': num,
        'lang': lang
      }
    
    const response = await fetch(`${server}api/hello`, {
      method: 'POST',
      body:  JSON.stringify(sendData),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if(response?.status !== 200){
      let data = await response.json();
      setMsg(data?.message)
    }else{
      let data = await response.json();
      setparsedResponse(data);
    }
  };
  
  return (
    <div>
      <form onSubmit={(e)=>runPrompt(e)}>
            <div>
              <label htmlFor='language'>
                Choose which language
              </label>
              <select onChange={(e)=>setLang(e.target.value)} name='language' value={lang}>
              { language && language.map((lan,idx) =>{
                return (
                  <option key={idx} value={lan}>{lan}</option>
                  )
                })}
              </select>
            </div>
            <div>
              <label htmlFor='number'>
                Choose number
              </label>
              <select onChange={(e)=>setNum(e.target.value)} name='number' value={num}>
              {number && number.map((numb,idx) =>{
                return (
                  <option key={idx} value={numb}>{numb}</option>
                  )
                })}
              </select>
            </div>
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
        : 
        <div>
          { msg }
        </div>
      }

      </div>
    </div>
  );
}

export default Home;