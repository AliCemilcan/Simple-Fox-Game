export const TICK_RATE = 2000;
export const ICONS = [
  'fish', 'poop', 'weather'
]
export const RAIN_CHANCE = 0.2
export const SCENES = ['day', 'rain']
export const DAY_LENGTH = 10;
export const NIGHT_LENGTH = 3;

export const getNextHungerTime = (clock) => {
  return Math.floor(Math.random() * 3) + 1 + clock;
}
export const getNextDieTime = (clock) => {
 return Math.floor(Math.random() * 3) + 3 + clock;
}
export const getNextPoopTime = (clock) => {
 return Math.floor(Math.random() * 3) + 4 + clock;
}

