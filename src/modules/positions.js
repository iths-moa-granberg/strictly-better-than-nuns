const positions = {
  1: {
    id: 1,
    x: 5,
    y: 5,
    neighbours: [2, 5],
  },

  2: {
    id: 2,
    x: 133,
    y: 5,
    neighbours: [1, 3, 6],
  },

  3: {
    id: 3,
    x: 261,
    y: 5,
    neighbours: [2, 4],
  },

  4: {
    id: 4,
    x: 389,
    y: 5,
    neighbours: [3, 8],
  },

  5: {
    id: 5,
    x: 5,
    y: 96,
    neighbours: [1, 6, 9],
  },

  6: {
    id: 6,
    x: 133,
    y: 96,
    neighbours: [2, 5, 7],
  },

  7: {
    id: 7,
    x: 261,
    y: 96,
    neighbours: [6, 11, 8],
  },

  8: {
    id: 8,
    x: 389,
    y: 96,
    neighbours: [4, 7, 12],
  },

  9: {
    id: 9,
    x: 5,
    y: 187,
    neighbours: [5, 13],
  },

  10: {
    id: 10,
    x: 133,
    y: 187,
    neighbours: [14, 11],
  },

  11: {
    id: 11,
    x: 261,
    y: 187,
    neighbours: [7, 10],
  },

  12: {
    id: 12,
    x: 389,
    y: 187,
    neighbours: [8, 16],
  },

  13: {
    id: 13,
    x: 5,
    y: 278,
    neighbours: [9, 14],
  },

  14: {
    id: 14,
    x: 133,
    y: 278,
    neighbours: [13, 10, 15],
  },

  15: {
    id: 15,
    x: 261,
    y: 278,
    neighbours: [14, 16],
  },

  16: {
    id: 16,
    x: 389,
    y: 278,
    neighbours: [15, 12],
  },
};

export default positions;
