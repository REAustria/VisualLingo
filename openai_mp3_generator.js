import fs from "fs";
import path from "path";
import OpenAI from "openai";

const openai = new OpenAI();

const speechFile = path.resolve("./kumusta.mp3");

async function main() {
  const mp3 = await openai.audio.speech.create({
    model: "tts-1-hd",
    voice: "nova",
    input: "ku mus ta",
    speed: 0.7,
    content_type: "audio/mpeg",
  });
  console.log(speechFile);
  const buffer = Buffer.from(await mp3.arrayBuffer());
  await fs.promises.writeFile(speechFile, buffer);

  // try {
  //   const mp3 = await openai.audio.speech.create({
  //     model: "tts-1-hd",
  //     voice: "nova",
  //     input: "kumusta",
  //     speed: 0.7,
  //     content_type: "audio/mpeg",
  //   });

  //   const buffer = Buffer.from(await mp3.arrayBuffer());
  //   await fs.promises.writeFile(speechFile, buffer);
  //   console.log("MP3 file generated successfully:", speechFile);
  // } catch (error) {
  //   console.error("Error generating MP3:", error);
  // }
}
main();