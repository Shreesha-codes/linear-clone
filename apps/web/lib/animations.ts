export const blurPopUp = {
  initial: { opacity: 0, filter: 'blur(10px)', y: '20%' },
  animate: {
    opacity: 1,
    filter: 'blur(0px)',
    y: 0,
  },
};

export const illustrate = {
  initial: {
    opacity: 0,
    x: 50,
    y: -50,
    z: 300,
  },
  animate: {
    opacity: 1,
    filter: 'blur(0px)',
    x: 0,
    y: 0,
    z: 0,
  },
};
