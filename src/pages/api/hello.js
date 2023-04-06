import dotenv from 'dotenv';
dotenv.config();

import { OpenAIApi, Configuration } from 'openai';

const API_KEY = process.env.OPEN_CHAT_KEY;

export default async function handler(req, res) {
  if(req.method === "POST"){
    const adv  = req.body.adv;
    const word  = req.body.word;
    const num  = req.body.num;
    const lang  = req.body.lang;
    const config = new Configuration({
      apiKey: API_KEY
    });
    
    const openai = new OpenAIApi(config);
  
    try {
            const prompt = `
            Please provide ${num} synonyms and their meanings for the word "${adv} ${word}" in ${lang}. Your response should be in the following format, which can be converted to JSON. Don't put any word before your answer:
  
  [
    {
      "index": 1,
      "word": "synonym_1",
      "meaning": [
        "a description of the first meaning of synonym_1, which should be more than 10 words and not identical to the word being defined",
        "a description of the second meaning of synonym_1, which should be more than 10 words and not identical to the word being defined"
      ]
    },
    {
      "index": 2,
      "word": "synonym_2",
      "meaning": [
        "a description of the first meaning of synonym_2, which should be more than 10 words and not identical to the word being defined",
        "a description of the second meaning of synonym_2, which should be more than 10 words and not identical to the word being defined"
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
  
  
      if (!response) {
        return res.status(404).json({ message: 'No synonyms found.', flag: false });
      }
  
      const parsableJSONresponse = response.data.choices[0].text;
      res.status(200).json(JSON.parse(parsableJSONresponse));
  
    } catch (error) {
      res.status(500).json({ message: error, flag: false });
    }
  }else {
    res.status(404).json({ message: 'No Page Found', flag: false  });
  }
}