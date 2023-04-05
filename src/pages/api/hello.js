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
					Please provide synonyms and their meanings for the word ${word}". Your response should be in the following format, which can be converted to JSON:

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