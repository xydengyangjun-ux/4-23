import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("GEMINI_API_KEY is not set in .env");
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });

const heroes = [
  { id: 'zhuge', prompt: 'Cyberpunk Guofeng style portrait of Zhuge Liang, traditional Chinese clothing with neon glowing cyan elements, holding a glowing feather fan, high quality, masterpiece, 8k, dark background' },
  { id: 'zhangfei', prompt: 'Cyberpunk Guofeng style portrait of Zhang Fei, fierce warrior, traditional Chinese armor with glowing neon gold accents, high quality, masterpiece, 8k, dark background' },
  { id: 'sunwukong', prompt: 'Cyberpunk Guofeng style portrait of Sun Wukong the Monkey King, mechanical golden cudgel, glowing neon red elements, high quality, masterpiece, 8k, dark background' },
  { id: 'lindaiyu', prompt: 'Cyberpunk Guofeng style portrait of Lin Daiyu, elegant traditional Chinese dress with glowing neon purple accents, melancholic beauty, high quality, masterpiece, 8k, dark background' },
  { id: 'wusong', prompt: 'Cyberpunk Guofeng style portrait of Wu Song, tiger fighter, muscular, traditional martial arts outfit with glowing neon green accents, high quality, masterpiece, 8k, dark background' }
];

async function generate() {
  const dir = path.join(process.cwd(), 'public', 'heroes');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  for (const hero of heroes) {
    console.log(`Generating image for ${hero.id}...`);
    try {
      const response = await ai.models.generateImages({
        model: 'imagen-3.0-generate-002',
        prompt: hero.prompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: '1:1'
        }
      });
      const base64Image = response.generatedImages[0].image.imageBytes;
      fs.writeFileSync(path.join(dir, `${hero.id}.jpg`), Buffer.from(base64Image, 'base64'));
      console.log(`Saved ${hero.id}.jpg`);
    } catch (e) {
      console.error(`Failed to generate for ${hero.id}:`, e);
    }
  }
}

generate();
