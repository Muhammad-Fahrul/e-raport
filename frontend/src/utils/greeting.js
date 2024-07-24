export default () => {
  const now = new Date();
  const hours = now.getHours();

  if (hours >= 18 || hours < 1) {
    return 'malam';
  } else if (hours >= 1 && hours < 12) {
    return 'pagi';
  } else if (hours >= 12 && hours < 16) {
    return 'siang';
  } else if (hours >= 16 && hours < 18) {
    return 'sore';
  }
};
