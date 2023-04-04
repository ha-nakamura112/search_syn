// pages/api/synonyms/[word].js
import dotenv from 'dotenv';
import { OpenAIApi, Configuration } from 'openai';

dotenv.config();

const API_KEY = process.env.OPEN_CHAT_KEY;

export default async function handler(req, res) {
  const first  = req.body.first;
  const word  = req.body.word;
	const config = new Configuration({
    apiKey: API_KEY
  });
  
  const openai = new OpenAIApi(config);

  try {
					const prompt = `
					Give me some words which is a synonyms with 
					"${first}${word}" in belows format which can be convert to Json. Don't put answer before your answer and meaning should be only two.
					Eachmeaning should be more than 10 words and not be same as ${word}
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


    if (!response) {
      return res.status(404).json({ message: 'No synonyms found.' });
    }

		const parsableJSONresponse = response.data.choices[0].text;
    console.log(parsableJSONresponse)
		res.status(200).json(JSON.parse(parsableJSONresponse));

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error });
  }
}
