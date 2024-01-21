import fs from "fs";
import path from "path";
import OpenAI from "openai";

const openai = new OpenAI();

const speechFile = path.resolve("./kumusta.mp3");

async function main() {
  const opus = await openai.audio.speech.create({
    model: "tts-1-hd",
    voice: "onyx",
    input: "ku mus ta",
    speed: 0.7,
    content_type: "audio/mpeg",
  });

  const buffer = Buffer.from(await opus.arrayBuffer());
  await fs.promises.writeFile(speechFile, buffer);
  console.log(speechFile);

  
}
main();