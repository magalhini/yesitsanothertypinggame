export function calculateCharsTyped(words, index) {
  return words.slice(0, index).join('').length;
}

export function calculateWpm(chars, time = 60) {
  console.log('elaped time', time);
  return Math.round((chars / 5) / (time / 60));
}

export function calculateScore(wpm, right, wrong) {
  return Math.round((wpm * (right / 10) / (wrong + (1 / .1))) * wpm / 10);
}

export function shuffle(arr) {
  if (arr.length <= 1) return arr;

  let shuffled = arr.slice(0);

  for (let i = arr.length - 1; i >= 0; i--) {
    let random = Math.floor(Math.random() * i);
    let temp = shuffled[i];
    shuffled[i] = shuffled[random];
    shuffled[random] = temp;
  }

  return shuffled;
}
