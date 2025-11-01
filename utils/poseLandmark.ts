// Pose 1: index finger up
const isPose1 = (lm: number[][]) => {
  const indexUp = lm[8][1] < lm[6][1];
  const othersDown =
    lm[12][1] > lm[10][1] && lm[16][1] > lm[14][1] && lm[20][1] > lm[18][1];
  return indexUp && othersDown;
};

// Pose 2: index + middle up
const isPose2 = (lm: number[][]) => {
  const indexUp = lm[8][1] < lm[6][1];
  const middleUp = lm[12][1] < lm[10][1];
  const othersDown = lm[16][1] > lm[14][1] && lm[20][1] > lm[18][1];
  return indexUp && middleUp && othersDown;
};

// Pose 3: three fingers up
const isPose3 = (lm: number[][]) => {
  const indexUp = lm[8][1] < lm[6][1];
  const middleUp = lm[12][1] < lm[10][1];
  const ringUp = lm[16][1] < lm[14][1];
  const pinkyDown = lm[20][1] > lm[18][1];
  return indexUp && middleUp && ringUp && pinkyDown;
};

export { isPose1, isPose2, isPose3 };
