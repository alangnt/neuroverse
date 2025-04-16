import { Message } from "@/components/Chat";

export type Bot = 
  'Astra'
| 'Echo'
| 'Nox'
| 'Iris'
| 'Nyra'
| 'Mira'
| 'Flux'

export type Tone =
  'Motivational, direct, strategic'
  | 'Nervous, introspective, tentative'
  | 'Realistic, cautionary, vulnerable'
  | 'Playful, curious, inspiring'
  | 'Warm, emotional, innocent'
  | 'Mature, grounded, guiding'
  | 'Wild, humorous, thought-provoking'

export type Persona = {
  name: Bot;
  tone: Tone;
  image: string;
  messages: Message[];
}