
import React, { useState } from 'react';

import { Configuration,OpenAIApi } from "openai";

const config = new Configuration({
	apiKey: "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",
});

const openai = new OpenAIApi(config);

function Home() {
  const [ userInput, setUserInput] = useState('');
  const [ meanings, setMeanings ] = useState(new Map());
  const [ parsedResponse, setparsedResponse ] = useState('');
  const runPrompt = async (e) => {
    e.preventDefault();
    
    const prompt = `
          Give me some words which is a synonyms with 
          "${e.target[0].value} ${userInput}" in belows format which can be convert to Json. Don't put answer before your answer and meaning should be only two.
          Eachmeaning should be more than 10 words and not be same as ${userInput}
        [
          {"index":1,
        "word":"Vassily",
        "meaning":[
          "first meaning",
          "second meaning"
        ]
      },

        {
          "index":2,
        "word":"Hesther",
        "meaning":[
          "first meaning",
          "second meaning"
        ]
      }
    ]
      `;
  
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      max_tokens: 2048,
      temperature: 1,
    });
  
    const parsableJSONresponse = response.data.choices[0].text;
    console.log(parsableJSONresponse)
    setparsedResponse(JSON.parse(parsableJSONresponse))
  
  };
  return (
    <div>
      <form onSubmit={(e)=>runPrompt(e)}>
        <select>
          <option value='Too'>Too</option>
          <option value='Very'>Very</option>
        </select>
        <input type='text' onChange={(e)=> setUserInput(e.target.value)} />
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
                {/* { res.meaning.map((mean,idx)=> {
                  <ul key={idx}>
                    <li>{mean}</li>
                    <li>{mean[0]}</li>
                    <li>{mean[1]}</li>
                  </ul>
                }) } */}
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