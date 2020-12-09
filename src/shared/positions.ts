import { Position } from './sharedTypes';

interface Positions {
  readonly [key: number]: Position;
}

const positions: Positions = {
  1: {
    id: 1,
    x: 88.3,
    y: 95,
    neighbours: [21],
    inSight: [],
    requireKey: false,
  },

  2: {
    id: 2,
    x: 80.6,
    y: 95,
    neighbours: [20],
    inSight: [],
    requireKey: false,
  },

  3: {
    id: 3,
    x: 71,
    y: 95,
    neighbours: [19],
    inSight: [],
    requireKey: false,
  },

  4: {
    id: 4,
    x: 61.8,
    y: 95,
    neighbours: [18],
    inSight: [],
    requireKey: false,
  },

  5: {
    id: 5,
    x: 52.1,
    y: 95,
    neighbours: [17],
    inSight: [],
    requireKey: false,
  },

  6: {
    id: 6,
    x: 43.4,
    y: 95,
    neighbours: [16],
    inSight: [],
    requireKey: false,
  },

  7: {
    id: 7,
    x: 31.3,
    y: 94.5,
    neighbours: [14, 8],
    inSight: [9, 8],
    requireKey: false,
  },

  8: {
    id: 8,
    x: 24.5,
    y: 94.5,
    neighbours: [9, 7],
    inSight: [9, 7],
    requireKey: false,
  },

  9: {
    id: 9,
    x: 16.9,
    y: 94.5,
    neighbours: [8, 10, 12],
    inSight: [8, 7],
    requireKey: false,
  },

  10: {
    id: 10,
    x: 9.8,
    y: 94.5,
    neighbours: [11, 9],
    inSight: [32, 11],
    requireKey: false,
  },

  11: {
    id: 11,
    x: 9.8,
    y: 88.1,
    neighbours: [32, 10],
    inSight: [32, 10],
    requireKey: false,
  },

  12: {
    id: 12,
    x: 16.9,
    y: 88.1,
    neighbours: [31, 13, 9],
    inSight: [31, 34, 54, 57, 85, 81, 86, 80, 58, 53, 52, 51, 35, 30, 13, 14, 15],
    requireKey: false,
  },

  13: {
    id: 13,
    x: 24.5,
    y: 88.1,
    neighbours: [12, 14],
    inSight: [12, 31, 34, 56, 34, 83, 54, 57, 84, 85, 81, 86, 80, 58, 53, 52, 51, 35, 30, 14, 15],
    requireKey: false,
  },

  14: {
    id: 14,
    x: 31.3,
    y: 88.1,
    neighbours: [7, 13, 15],
    inSight: [13, 12, 31, 55, 34, 56, 54, 83, 57, 84, 85, 81, 53, 58, 80, 52, 51, 35, 30, 15],
    requireKey: false,
  },

  15: {
    id: 15,
    x: 37.5,
    y: 88.1,
    neighbours: [14, 30, 16],
    inSight: [14, 13, 12, 31, 55, 34, 56, 54, 57, 83, 84, 53, 81, 85, 58, 52, 30, 35, 51],
    requireKey: false,
  },

  16: {
    id: 16,
    x: 43.4,
    y: 88.1,
    neighbours: [15, 17, 6],
    inSight: [17, 18, 19, 20, 21, 22],
    requireKey: false,
  },

  17: {
    id: 17,
    x: 52.1,
    y: 88.1,
    neighbours: [16, 18, 5],
    inSight: [16, 18, 19, 20, 21, 22],
    requireKey: false,
  },

  18: {
    id: 18,
    x: 61.8,
    y: 88.1,
    neighbours: [17, 27, 19, 4],
    inSight: [16, 17, 19, 20, 21, 22, 27],
    requireKey: false,
  },

  19: {
    id: 19,
    x: 71,
    y: 88.1,
    neighbours: [18, 26, 20, 3],
    inSight: [16, 17, 18, 20, 21, 22],
    requireKey: false,
  },

  20: {
    id: 20,
    x: 80.6,
    y: 88.1,
    neighbours: [19, 21, 2],
    inSight: [16, 17, 18, 19, 21, 22],
    requireKey: false,
  },

  21: {
    id: 21,
    x: 88.3,
    y: 88.1,
    neighbours: [20, 22, 1],
    inSight: [16, 17, 18, 19, 20, 21, 22],
    requireKey: false,
  },

  22: {
    id: 22,
    x: 91.4,
    y: 88.1,
    neighbours: [21, 23],
    inSight: [16, 17, 18, 19, 20, 21, 23],
    requireKey: false,
  },

  23: {
    id: 23,
    x: 91.4,
    y: 79.9,
    neighbours: [22, 43],
    inSight: [22],
    requireKey: false,
  },

  24: {
    id: 24,
    x: 85.6,
    y: 79.9,
    neighbours: [25, 42],
    inSight: [25],
    requireKey: false,
  },

  25: {
    id: 25,
    x: 80.6,
    y: 79.9,
    neighbours: [26, 24],
    inSight: [24],
    requireKey: false,
  },

  26: {
    id: 26,
    x: 71,
    y: 79.9,
    neighbours: [40, 25, 19],
    inSight: [],
    requireKey: true,
  },

  27: {
    id: 27,
    x: 61.8,
    y: 79.9,
    neighbours: [39, 18],
    inSight: [18],
    requireKey: false,
  },

  28: {
    id: 28,
    x: 53.4,
    y: 79.9,
    neighbours: [38],
    inSight: [],
    requireKey: false,
  },

  29: {
    id: 29,
    x: 42.5,
    y: 80.5,
    neighbours: [30],
    inSight: [],
    requireKey: false,
  },

  30: {
    id: 30,
    x: 37.5,
    y: 80.5,
    neighbours: [35, 29, 15],
    inSight: [15, 14, 13, 12, 31, 33, 34, 55, 54, 56, 57, 83, 84, 53, 81, 85, 52, 35, 51],
    requireKey: false,
  },

  31: {
    id: 31,
    x: 16.9,
    y: 80.5,
    neighbours: [32, 34, 12],
    inSight: [83, 34, 57, 54, 85, 81, 86, 80, 58, 53, 52, 51, 35, 30, 15, 14, 13, 12],
    requireKey: false,
  },

  32: {
    id: 32,
    x: 9.8,
    y: 80.5,
    neighbours: [31, 11],
    inSight: [11, 10],
    requireKey: false,
  },

  33: {
    id: 33,
    x: 7.7,
    y: 71.9,
    neighbours: [55, 34],
    inSight: [51, 55, 56, 83, 84, 85, 57, 86, 81, 80, 54, 58, 53, 52, 50, 34, 35, 30],
    requireKey: false,
  },

  34: {
    id: 34,
    x: 16.9,
    y: 71.9,
    neighbours: [33, 54, 31],
    inSight: [33, 55, 56, 83, 84, 54, 57, 85, 81, 86, 80, 58, 53, 52, 51, 50, 35, 30, 15, 14, 13, 31, 12],
    requireKey: false,
  },

  35: {
    id: 35,
    x: 37.5,
    y: 71.9,
    neighbours: [30, 51],
    inSight: [34, 33, 55, 54, 56, 57, 53, 83, 52, 51, 31, 12, 13, 14, 15, 30],
    requireKey: false,
  },

  36: {
    id: 36,
    x: 42.5,
    y: 71.4,
    neighbours: [50],
    inSight: [],
    requireKey: false,
  },

  37: {
    id: 37,
    x: 48.2,
    y: 71.4,
    neighbours: [49, 38],
    inSight: [49, 62, 76, 90, 75, 91, 92, 64, 93, 48, 63, 65, 74, 94, 66, 46, 47, 38, 39, 40, 41],
    requireKey: false,
  },

  38: {
    id: 38,
    x: 53.4,
    y: 71.4,
    neighbours: [37, 39, 28],
    inSight: [37, 49, 62, 76, 90, 75, 91, 48, 64, 92, 63, 93, 65, 74, 94, 66, 47, 46, 39, 40, 41],
    requireKey: false,
  },

  39: {
    id: 39,
    x: 61.8,
    y: 71.4,
    neighbours: [38, 48, 40, 27],
    inSight: [38, 37, 49, 48, 62, 76, 90, 75, 91, 63, 64, 92, 65, 93, 66, 74, 47, 46, 40, 41],
    requireKey: false,
  },

  40: {
    id: 40,
    x: 71,
    y: 71.4,
    neighbours: [39, 41, 26],
    inSight: [39, 38, 37, 49, 48, 62, 76, 63, 90, 75, 64, 91, 66, 65, 92, 47, 68, 46, 41],
    requireKey: false,
  },

  41: {
    id: 41,
    x: 79.9,
    y: 71.4,
    neighbours: [40, 46],
    inSight: [40, 39, 38, 37, 49, 48, 62, 76, 63, 47, 66, 64, 75, 90, 91, 65, 46, 68, 73, 94],
    requireKey: false,
  },

  42: {
    id: 42,
    x: 85.6,
    y: 70.5,
    neighbours: [24, 45, 43],
    inSight: [45, 69, 70, 44, 43],
    requireKey: false,
  },

  43: {
    id: 43,
    x: 91.4,
    y: 70.5,
    neighbours: [42, 44, 23],
    inSight: [42, 45, 69, 70, 44],
    requireKey: false,
  },

  44: {
    id: 44,
    x: 91.4,
    y: 63.3,
    neighbours: [45, 70, 43],
    inSight: [42, 45, 69, 70, 43],
    requireKey: false,
  },

  45: {
    id: 45,
    x: 85.6,
    y: 63.3,
    neighbours: [46, 69, 44, 42],
    inSight: [69, 70, 44, 43, 42],
    requireKey: false,
  },

  46: {
    id: 46,
    x: 79.9,
    y: 63.3,
    neighbours: [47, 68, 45, 41],
    inSight: [41, 40, 47, 39, 38, 37, 48, 49, 62, 63, 66, 76, 64, 75, 90, 68, 73, 94],
    requireKey: false,
  },

  47: {
    id: 47,
    x: 73.4,
    y: 65.4,
    neighbours: [66, 46],
    inSight: [40, 39, 38, 37, 48, 49, 62, 63, 76, 66, 64, 75, 90, 91, 65, 92, 68, 46, 41],
    requireKey: false,
  },

  48: {
    id: 48,
    x: 55.3,
    y: 66,
    neighbours: [49, 63, 39],
    inSight: [49, 62, 76, 90, 75, 91, 64, 92, 93, 63, 65, 74, 94, 66, 46, 47, 41, 40, 39, 38, 37],
    requireKey: false,
  },

  49: {
    id: 49,
    x: 48.2,
    y: 66,
    neighbours: [50, 62, 48, 37],
    inSight: [62, 76, 90, 75, 91, 92, 64, 93, 94, 74, 65, 63, 73, 66, 48, 46, 47, 41, 40, 39, 38, 37],
    requireKey: false,
  },

  50: {
    id: 50,
    x: 42.5,
    y: 66,
    neighbours: [51, 49, 36],
    inSight: [34, 51, 33, 52, 53, 54, 55],
    requireKey: false,
  },

  51: {
    id: 51,
    x: 37.5,
    y: 66,
    neighbours: [52, 60, 50, 35],
    inSight: [50, 35, 30, 15, 14, 13, 12, 31, 34, 33, 52, 53, 54, 55],
    requireKey: false,
  },

  52: {
    id: 52,
    x: 32,
    y: 66,
    neighbours: [53, 51],
    inSight: [50, 51, 35, 30, 15, 14, 13, 12, 31, 34, 33, 53, 54, 55, 57, 56],
    requireKey: false,
  },

  53: {
    id: 53,
    x: 26.5,
    y: 66,
    neighbours: [54, 58, 52],
    inSight: [50, 52, 51, 35, 30, 15, 14, 13, 12, 31, 34, 33, 54, 55, 57, 56, 83, 84, 81, 85, 58, 80, 86],
    requireKey: false,
  },

  54: {
    id: 54,
    x: 16.9,
    y: 66,
    neighbours: [55, 57, 53, 34],
    inSight: [50, 53, 52, 51, 35, 30, 15, 14, 13, 12, 31, 34, 33, 55, 56, 83, 57, 84, 85, 81, 86, 80, 58],
    requireKey: false,
  },

  55: {
    id: 55,
    x: 7.7,
    y: 66,
    neighbours: [56, 54, 33],
    inSight: [50, 54, 53, 52, 51, 35, 30, 15, 14, 34, 33, 56, 83, 84, 85, 86, 57, 81, 80, 58],
    requireKey: false,
  },

  56: {
    id: 56,
    x: 7.7,
    y: 57.5,
    neighbours: [83, 55],
    inSight: [83, 84, 85, 86, 81, 80, 58, 57, 52, 53, 35, 30, 54, 15, 14, 34, 13, 33, 55],
    requireKey: false,
  },

  57: {
    id: 57,
    x: 15.9,
    y: 60.3,
    neighbours: [54, 82],
    inSight: [56, 83, 84, 85, 86, 81, 80, 58, 52, 53, 35, 30, 15, 14, 13, 12, 31, 54, 33, 55, 34],
    requireKey: false,
  },

  58: {
    id: 58,
    x: 26.5,
    y: 60.3,
    neighbours: [53, 80],
    inSight: [15, 53, 14, 13, 12, 31, 34, 33, 54, 55, 57, 56, 83, 84, 81, 85, 80, 86],
    requireKey: false,
  },

  59: {
    id: 59,
    x: 31.3,
    y: 60.3,
    neighbours: [79, 60],
    inSight: [79, 87, 106, 113, 131, 134, 130, 114, 105, 88, 78, 60, 129, 115, 104, 89, 77, 61],
    requireKey: false,
  },

  60: {
    id: 60,
    x: 37.5,
    y: 60.3,
    neighbours: [59, 78, 61, 51],
    inSight: [59, 79, 87, 106, 113, 131, 134, 78, 88, 105, 114, 130, 61, 77, 89, 104, 115, 129, 135],
    requireKey: false,
  },

  61: {
    id: 61,
    x: 43.8,
    y: 60.3,
    neighbours: [60, 77],
    inSight: [60, 59, 79, 87, 78, 106, 113, 105, 131, 114, 130, 77, 89, 104, 115, 129, 135, 88],
    requireKey: false,
  },

  62: {
    id: 62,
    x: 48.2,
    y: 59.2,
    neighbours: [76, 49],
    inSight: [76, 90, 75, 91, 92, 93, 94, 64, 74, 65, 73, 63, 66, 46, 47, 41, 40, 48, 39, 38, 37, 49],
    requireKey: false,
  },

  63: {
    id: 63,
    x: 61,
    y: 59.2,
    neighbours: [64, 66, 48],
    inSight: [62, 76, 90, 75, 91, 64, 92, 93, 65, 74, 94, 66, 46, 47, 41, 40, 39, 48, 38, 37, 49],
    requireKey: false,
  },

  64: {
    id: 64,
    x: 61,
    y: 53.2,
    neighbours: [63, 65, 75],
    inSight: [63, 39, 48, 38, 37, 49, 62, 76, 75, 90, 91, 92, 93, 94, 74, 73, 65, 46, 66, 47, 41, 40],
    requireKey: false,
  },

  65: {
    id: 65,
    x: 67,
    y: 53.2,
    neighbours: [64, 66, 74],
    inSight: [66, 39, 63, 48, 38, 37, 49, 62, 64, 76, 75, 90, 91, 92, 93, 74, 94, 73, 41, 47, 40],
    requireKey: false,
  },

  66: {
    id: 66,
    x: 67,
    y: 59.2,
    neighbours: [63, 65, 47],
    inSight: [39, 38, 37, 48, 49, 63, 62, 76, 90, 75, 64, 91, 65, 92, 93, 74, 94, 46, 47, 41, 40],
    requireKey: false,
  },

  67: {
    id: 67,
    x: 75,
    y: 55.8,
    neighbours: [68],
    inSight: [68],
    requireKey: false,
  },

  68: {
    id: 68,
    x: 79.9,
    y: 55.8,
    neighbours: [67, 73, 46],
    inSight: [67, 74, 93, 94, 73, 46, 41, 47, 40],
    requireKey: false,
  },

  69: {
    id: 69,
    x: 85.6,
    y: 56.6,
    neighbours: [70, 45],
    inSight: [70, 45, 44, 42, 43],
    requireKey: false,
  },

  70: {
    id: 70,
    x: 91.4,
    y: 56.6,
    neighbours: [69, 71, 44],
    inSight: [69, 45, 44, 42, 43],
    requireKey: false,
  },

  71: {
    id: 71,
    x: 91.4,
    y: 48.5,
    neighbours: [70, 72, 96],
    inSight: [96, 97, 122],
    requireKey: false,
  },

  72: {
    id: 72,
    x: 85.6,
    y: 48.5,
    neighbours: [71],
    inSight: [],
    requireKey: false,
  },

  73: {
    id: 73,
    x: 79.9,
    y: 48.5,
    neighbours: [94, 68],
    inSight: [68, 46, 41, 62, 65, 64, 76, 75, 90, 74, 91, 92, 93, 94, 49],
    requireKey: false,
  },

  74: {
    id: 74,
    x: 73,
    y: 47.5,
    neighbours: [65, 93],
    inSight: [66, 39, 65, 63, 48, 38, 37, 49, 64, 62, 76, 75, 90, 91, 92, 93, 94, 73, 68],
    requireKey: false,
  },

  75: {
    id: 75,
    x: 54.9,
    y: 47.1,
    neighbours: [91, 64],
    inSight: [90, 91, 92, 93, 94, 74, 73, 65, 64, 46, 66, 47, 41, 63, 40, 39, 48, 38, 37, 49, 62, 76],
    requireKey: false,
  },

  76: {
    id: 76,
    x: 48.2,
    y: 53,
    neighbours: [62, 77, 90],
    inSight: [90, 91, 75, 92, 93, 94, 74, 73, 64, 65, 66, 46, 63, 47, 41, 40, 39, 48, 38, 62, 49, 37],
    requireKey: false,
  },

  77: {
    id: 77,
    x: 43.8,
    y: 53,
    neighbours: [61, 78, 89, 76],
    inSight: [61, 60, 59, 79, 78, 87, 88, 89, 112, 106, 113, 105, 131, 114, 104, 115, 129, 130, 135],
    requireKey: false,
  },

  78: {
    id: 78,
    x: 37.5,
    y: 53,
    neighbours: [79, 88, 77, 60],
    inSight: [79, 87, 106, 113, 131, 134, 88, 105, 114, 130, 135, 129, 115, 104, 89, 77, 61, 60, 59],
    requireKey: false,
  },

  79: {
    id: 79,
    x: 31.3,
    y: 53,
    neighbours: [80, 87, 78, 59],
    inSight: [87, 106, 113, 131, 134, 130, 114, 105, 88, 78, 59, 60, 61, 77, 89, 104, 115, 129, 116],
    requireKey: false,
  },

  80: {
    id: 80,
    x: 26.5,
    y: 53,
    neighbours: [81, 86, 79, 58],
    inSight: [58, 53, 13, 12, 31, 34, 54, 33, 55, 57, 81, 56, 83, 84, 85, 86, 14],
    requireKey: false,
  },

  81: {
    id: 81,
    x: 21.8,
    y: 54,
    neighbours: [82, 80],
    inSight: [83, 84, 85, 86, 80, 58, 53, 30, 15, 14, 13, 12, 31, 34, 54, 57, 33, 55, 56],
    requireKey: false,
  },

  82: {
    id: 82,
    x: 17.5,
    y: 55.7,
    neighbours: [57, 81],
    inSight: [],
    requireKey: false,
  },

  83: {
    id: 83,
    x: 7.7,
    y: 49,
    neighbours: [56, 84],
    inSight: [84, 85, 86, 80, 81, 58, 53, 35, 30, 15, 57, 14, 54, 13, 34, 33, 55, 56, 31],
    requireKey: false,
  },

  84: {
    id: 84,
    x: 7.7,
    y: 41.9,
    neighbours: [109, 85, 83],
    inSight: [85, 86, 80, 81, 58, 53, 30, 15, 14, 57, 54, 13, 34, 33, 55, 56, 83],
    requireKey: false,
  },

  85: {
    id: 85,
    x: 17.2,
    y: 41.9,
    neighbours: [84, 108, 86],
    inSight: [86, 80, 58, 81, 30, 53, 15, 14, 13, 57, 54, 34, 31, 12, 33, 55, 56, 83, 84],
    requireKey: false,
  },

  86: {
    id: 86,
    x: 26.5,
    y: 41.9,
    neighbours: [85, 80],
    inSight: [80, 58, 53, 13, 12, 31, 34, 81, 54, 57, 33, 55, 56, 83, 84, 85],
    requireKey: false,
  },

  87: {
    id: 87,
    x: 31.3,
    y: 44.3,
    neighbours: [106, 88, 79],
    inSight: [106, 113, 131, 134, 130, 114, 129, 105, 115, 116, 104, 88, 89, 77, 78, 61, 60, 79, 59],
    requireKey: false,
  },

  88: {
    id: 88,
    x: 37.5,
    y: 44.3,
    neighbours: [105, 89, 78, 87],
    inSight: [87, 106, 112, 113, 131, 134, 105, 114, 130, 135, 129, 115, 104, 116, 89, 77, 78, 61, 60, 59, 79],
    requireKey: false,
  },

  89: {
    id: 89,
    x: 43.8,
    y: 44.3,
    neighbours: [88, 104, 77],
    inSight: [77, 61, 60, 78, 59, 79, 88, 87, 106, 112, 113, 105, 131, 114, 130, 104, 115, 129, 135],
    requireKey: false,
  },

  90: {
    id: 90,
    x: 48.2,
    y: 41.2,
    neighbours: [76, 91],
    inSight: [91, 92, 93, 94, 74, 73, 75, 65, 46, 64, 66, 47, 41, 63, 40, 48, 38, 37, 49, 62, 76, 39],
    requireKey: false,
  },

  91: {
    id: 91,
    x: 57.2,
    y: 41.2,
    neighbours: [90, 102, 92, 75],
    inSight: [92, 93, 94, 74, 73, 65, 41, 47, 66, 64, 63, 39, 75, 48, 38, 37, 49, 62, 76, 90, 40],
    requireKey: false,
  },

  92: {
    id: 92,
    x: 64.8,
    y: 41.2,
    neighbours: [91, 101, 93],
    inSight: [93, 94, 74, 73, 47, 65, 66, 40, 64, 63, 39, 48, 38, 37, 49, 62, 76, 90, 91, 75],
    requireKey: false,
  },

  93: {
    id: 93,
    x: 73,
    y: 41.2,
    neighbours: [92, 100, 94, 74],
    inSight: [94, 73, 68, 74, 65, 66, 39, 64, 63, 48, 38, 37, 49, 62, 76, 75, 90, 91, 92],
    requireKey: false,
  },

  94: {
    id: 94,
    x: 79.9,
    y: 41.2,
    neighbours: [93, 99, 95, 73],
    inSight: [73, 68, 46, 41, 66, 74, 65, 63, 48, 38, 37, 49, 64, 62, 76, 75, 93, 92, 91, 90],
    requireKey: false,
  },

  95: {
    id: 95,
    x: 85.6,
    y: 41.2,
    neighbours: [94, 96],
    inSight: [96],
    requireKey: false,
  },

  96: {
    id: 96,
    x: 91.4,
    y: 41.2,
    neighbours: [95, 97, 71],
    inSight: [95, 122, 97, 71],
    requireKey: false,
  },

  97: {
    id: 97,
    x: 91.4,
    y: 34.7,
    neighbours: [98, 122, 96],
    inSight: [122, 96, 71],
    requireKey: false,
  },

  98: {
    id: 98,
    x: 85.6,
    y: 34.7,
    neighbours: [97],
    inSight: [],
    requireKey: false,
  },

  99: {
    id: 99,
    x: 79.9,
    y: 34.7,
    neighbours: [94, 120],
    inSight: [120, 125],
    requireKey: false,
  },

  100: {
    id: 100,
    x: 73,
    y: 35,
    neighbours: [101, 93],
    inSight: [101],
    requireKey: false,
  },

  101: {
    id: 101,
    x: 64.8,
    y: 35,
    neighbours: [118, 100, 92],
    inSight: [100],
    requireKey: false,
  },

  102: {
    id: 102,
    x: 57.2,
    y: 34.7,
    neighbours: [91, 117],
    inSight: [117, 128, 137],
    requireKey: false,
  },

  103: {
    id: 103,
    x: 52,
    y: 36,
    neighbours: [104],
    inSight: [],
    requireKey: false,
  },

  104: {
    id: 104,
    x: 43.8,
    y: 36,
    neighbours: [105, 115, 103, 89],
    inSight: [89, 77, 61, 60, 78, 88, 87, 79, 59, 105, 106, 112, 113, 114, 131, 130, 115, 129, 135, 116],
    requireKey: false,
  },

  105: {
    id: 105,
    x: 37.5,
    y: 36,
    neighbours: [114, 106, 104, 88],
    inSight: [106, 112, 113, 131, 114, 130, 129, 115, 104, 116, 87, 88, 89, 79, 78, 77, 59, 60, 61],
    requireKey: false,
  },

  106: {
    id: 106,
    x: 31.3,
    y: 36,
    neighbours: [107, 113, 105, 87],
    inSight: [112, 113, 131, 134, 130, 114, 129, 115, 105, 116, 87, 88, 89, 79, 78, 77, 59, 60, 61, 104],
    requireKey: false,
  },

  107: {
    id: 107,
    x: 22.6,
    y: 36,
    neighbours: [106],
    inSight: [],
    requireKey: false,
  },

  108: {
    id: 108,
    x: 17.2,
    y: 36,
    neighbours: [85, 111],
    inSight: [111],
    requireKey: false,
  },

  109: {
    id: 109,
    x: 7.7,
    y: 35,
    neighbours: [84, 110],
    inSight: [],
    requireKey: true,
  },

  110: {
    id: 110,
    x: 7.7,
    y: 28.3,
    neighbours: [109, 132],
    inSight: [132, 133, 151, 152],
    requireKey: false,
  },

  111: {
    id: 111,
    x: 17.2,
    y: 29.5,
    neighbours: [108, 112],
    inSight: [108],
    requireKey: false,
  },

  112: {
    id: 112,
    x: 24,
    y: 29.5,
    neighbours: [111, 113],
    inSight: [113, 106, 88, 77, 89, 105, 104, 114, 115, 116, 131, 130, 129, 134],
    requireKey: false,
  },

  113: {
    id: 113,
    x: 31.3,
    y: 29.5,
    neighbours: [112, 131, 114, 106],
    inSight: [112, 131, 134, 130, 129, 114, 115, 116, 106, 105, 104, 87, 88, 89, 79, 78, 77, 59, 60, 61],
    requireKey: false,
  },

  114: {
    id: 114,
    x: 37.5,
    y: 29.5,
    neighbours: [113, 130, 115, 105],
    inSight: [112, 113, 131, 130, 129, 115, 116, 106, 105, 104, 87, 88, 89, 79, 78, 77, 59, 60, 61],
    requireKey: false,
  },

  115: {
    id: 115,
    x: 43.8,
    y: 29.5,
    neighbours: [114, 129, 116, 104],
    inSight: [112, 113, 114, 131, 130, 129, 135, 116, 106, 105, 104, 87, 88, 89, 79, 78, 77, 59, 60, 61],
    requireKey: false,
  },

  116: {
    id: 116,
    x: 50,
    y: 29.5,
    neighbours: [115, 117],
    inSight: [135, 130, 129, 131, 112, 113, 114, 115, 106, 105, 104, 87, 88, 79],
    requireKey: false,
  },

  117: {
    id: 117,
    x: 57.2,
    y: 29.5,
    neighbours: [116, 128, 102],
    inSight: [102, 128, 137],
    requireKey: false,
  },

  118: {
    id: 118,
    x: 64.8,
    y: 26.8,
    neighbours: [119, 101],
    inSight: [119],
    requireKey: true,
  },

  119: {
    id: 119,
    x: 71.6,
    y: 26.8,
    neighbours: [118, 126],
    inSight: [118],
    requireKey: true,
  },

  120: {
    id: 120,
    x: 79.9,
    y: 26.5,
    neighbours: [125, 99],
    inSight: [125, 99],
    requireKey: false,
  },

  121: {
    id: 121,
    x: 85.6,
    y: 26.5,
    neighbours: [122],
    inSight: [],
    requireKey: true,
  },

  122: {
    id: 122,
    x: 91.4,
    y: 26.5,
    neighbours: [121, 97, 123],
    inSight: [97, 96, 71],
    requireKey: false,
  },

  123: {
    id: 123,
    x: 91.4,
    y: 20.6,
    neighbours: [124, 142, 122],
    inSight: [128, 127, 126, 125, 124],
    requireKey: false,
  },

  124: {
    id: 124,
    x: 85.6,
    y: 20.6,
    neighbours: [125, 123],
    inSight: [128, 127, 126, 125, 123],
    requireKey: false,
  },

  125: {
    id: 125,
    x: 79.9,
    y: 20.6,
    neighbours: [126, 124, 120],
    inSight: [128, 127, 126, 124, 123, 120, 99],
    requireKey: false,
  },

  126: {
    id: 126,
    x: 71.6,
    y: 20.6,
    neighbours: [127, 139, 125, 119],
    inSight: [128, 127, 125, 124, 123],
    requireKey: false,
  },

  127: {
    id: 127,
    x: 64.4,
    y: 20.6,
    neighbours: [128, 138, 126],
    inSight: [128, 126, 125, 124, 123],
    requireKey: false,
  },

  128: {
    id: 128,
    x: 57.2,
    y: 20.6,
    neighbours: [137, 127, 117],
    inSight: [137, 117, 102, 127, 126, 125, 124, 123],
    requireKey: false,
  },

  129: {
    id: 129,
    x: 43.8,
    y: 22.2,
    neighbours: [130, 135, 115],
    inSight: [131, 130, 135, 116, 115, 104, 89, 77, 61, 114, 105, 88, 78, 60, 113, 106, 87, 79, 59, 112],
    requireKey: false,
  },

  130: {
    id: 130,
    x: 37.5,
    y: 22.2,
    neighbours: [131, 129, 114],
    inSight: [131, 129, 116, 115, 104, 89, 77, 61, 114, 105, 88, 78, 60, 113, 106, 87, 79, 59, 112],
    requireKey: false,
  },

  131: {
    id: 131,
    x: 31.3,
    y: 22.2,
    neighbours: [134, 130, 113],
    inSight: [134, 130, 129, 116, 115, 104, 89, 77, 61, 114, 105, 88, 78, 60, 113, 106, 87, 79, 59, 112],
    requireKey: false,
  },

  132: {
    id: 132,
    x: 12,
    y: 19.8,
    neighbours: [110, 133],
    inSight: [110, 133, 151, 152],
    requireKey: false,
  },

  133: {
    id: 133,
    x: 18,
    y: 12.6,
    neighbours: [132, 151],
    inSight: [110, 132, 151, 152, 153],
    requireKey: false,
  },

  134: {
    id: 134,
    x: 31.3,
    y: 13.8,
    neighbours: [131, 150],
    inSight: [150, 135, 131, 113, 106, 87, 79, 59, 112, 88, 78, 60],
    requireKey: false,
  },

  135: {
    id: 135,
    x: 43.8,
    y: 13.8,
    neighbours: [150, 129, 149],
    inSight: [134, 150, 129, 115, 116, 104, 89, 77, 61, 88, 78, 60],
    requireKey: false,
  },

  136: {
    id: 136,
    x: 51.5,
    y: 16.7,
    neighbours: [149, 137],
    inSight: [149],
    requireKey: false,
  },

  137: {
    id: 137,
    x: 57.2,
    y: 17,
    neighbours: [136, 128],
    inSight: [128, 117, 102],
    requireKey: false,
  },

  138: {
    id: 138,
    x: 64.4,
    y: 15,
    neighbours: [147, 127],
    inSight: [147],
    requireKey: false,
  },

  139: {
    id: 139,
    x: 71.6,
    y: 15.7,
    neighbours: [146, 140, 126],
    inSight: [146, 145, 144, 143, 142, 141, 140],
    requireKey: false,
  },

  140: {
    id: 140,
    x: 78.5,
    y: 15.7,
    neighbours: [139, 141],
    inSight: [146, 145, 144, 143, 142, 141, 139],
    requireKey: false,
  },

  141: {
    id: 141,
    x: 85,
    y: 15.7,
    neighbours: [140, 142],
    inSight: [146, 145, 144, 143, 142, 140, 139],
    requireKey: false,
  },

  142: {
    id: 142,
    x: 91.4,
    y: 15.7,
    neighbours: [123, 141, 143],
    inSight: [146, 145, 144, 143, 141, 140, 139],
    requireKey: false,
  },

  143: {
    id: 143,
    x: 91.4,
    y: 5.4,
    neighbours: [142, 144],
    inSight: [146, 145, 144, 142, 141, 140, 139],
    requireKey: false,
  },

  144: {
    id: 144,
    x: 81.5,
    y: 5.4,
    neighbours: [145, 143],
    inSight: [146, 145, 143, 142, 141, 140, 139],
    requireKey: false,
  },

  145: {
    id: 145,
    x: 71.6,
    y: 5.4,
    neighbours: [146, 144],
    inSight: [146, 144, 143, 142, 141, 140, 139],
    requireKey: false,
  },

  146: {
    id: 146,
    x: 71.6,
    y: 11,
    neighbours: [147, 145, 139],
    inSight: [145, 144, 143, 142, 141, 140, 139],
    requireKey: false,
  },

  147: {
    id: 147,
    x: 64.4,
    y: 11,
    neighbours: [148, 146, 138],
    inSight: [138],
    requireKey: false,
  },

  148: {
    id: 148,
    x: 57.6,
    y: 11,
    neighbours: [155, 147],
    inSight: [155],
    requireKey: true,
  },

  149: {
    id: 149,
    x: 49,
    y: 10.7,
    neighbours: [135, 136],
    inSight: [136],
    requireKey: false,
  },

  150: {
    id: 150,
    x: 37.5,
    y: 11.3,
    neighbours: [134, 135],
    inSight: [134, 135],
    requireKey: false,
  },

  151: {
    id: 151,
    x: 25.5,
    y: 6.8,
    neighbours: [133, 152],
    inSight: [110, 132, 133, 152, 153, 154],
    requireKey: false,
  },

  152: {
    id: 152,
    x: 34.8,
    y: 3.5,
    neighbours: [151, 153],
    inSight: [110, 132, 133, 151, 153, 154],
    requireKey: false,
  },

  153: {
    id: 153,
    x: 43.5,
    y: 3.7,
    neighbours: [152, 154],
    inSight: [133, 151, 152, 154],
    requireKey: false,
  },

  154: {
    id: 154,
    x: 51,
    y: 5,
    neighbours: [153, 155],
    inSight: [151, 152, 153, 154],
    requireKey: false,
  },

  155: {
    id: 155,
    x: 56.4,
    y: 5.3,
    neighbours: [154, 148],
    inSight: [148],
    requireKey: true,
  },
};

export default positions;
