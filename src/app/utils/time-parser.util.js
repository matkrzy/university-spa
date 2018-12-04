//00:00:01 => 1000
//00:01:00 => 60 000
//01:00:00=>  3 600 000

export const timeParser = time =>
  time
    .split(':')
    .reverse()
    .reduce((acc, time, i) => {
      if (i === 0) {
        return acc + 1000 * time;
      } else {
        return Math.pow(60, i) * 1000 * +time + +acc;
      }
    }, 0);
