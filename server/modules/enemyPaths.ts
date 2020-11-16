import positions from '../../src/shared/positions';
import { Position } from '../../src/shared/sharedTypes';

interface EnemyPaths {
  [key: string]: Position[];
}

const enemyPaths: EnemyPaths = {
  pinkA: [
    positions[26],
    positions[40],
    positions[39],
    positions[38],
    positions[37],
    positions[49],
    positions[50],
    positions[51],
    positions[60],
    positions[78],
    positions[88],
    positions[105],
    positions[114],
    positions[115],
    positions[116],
    positions[117],
    positions[128],
    positions[127],
    positions[138],
    positions[147],
  ],

  pinkB: [
    positions[147],
    positions[138],
    positions[127],
    positions[128],
    positions[117],
    positions[116],
    positions[115],
    positions[114],
    positions[105],
    positions[88],
    positions[78],
    positions[60],
    positions[51],
    positions[50],
    positions[49],
    positions[37],
    positions[38],
    positions[39],
    positions[40],
    positions[26],
  ],

  purpleA: [
    positions[147],
    positions[146],
    positions[145],
    positions[144],
    positions[143],
    positions[142],
    positions[123],
    positions[122],
  ],

  purpleB: [
    positions[122],
    positions[123],
    positions[142],
    positions[143],
    positions[144],
    positions[145],
    positions[146],
    positions[147],
  ],

  blueA: [
    positions[122],
    positions[97],
    positions[96],
    positions[71],
    positions[70],
    positions[69],
    positions[45],
    positions[42],
    positions[24],
    positions[25],
    positions[26],
  ],

  blueB: [
    positions[26],
    positions[25],
    positions[24],
    positions[42],
    positions[45],
    positions[69],
    positions[70],
    positions[71],
    positions[96],
    positions[97],
    positions[122],
  ],

  greenA: [
    positions[122],
    positions[97],
    positions[96],
    positions[71],
    positions[70],
    positions[44],
    positions[43],
    positions[23],
    positions[22],
    positions[21],
    positions[20],
    positions[19],
    positions[26],
  ],

  greenB: [
    positions[26],
    positions[19],
    positions[20],
    positions[21],
    positions[22],
    positions[23],
    positions[43],
    positions[44],
    positions[70],
    positions[71],
    positions[96],
    positions[97],
    positions[122],
  ],

  mustardA: [
    positions[122],
    positions[97],
    positions[96],
    positions[95],
    positions[94],
    positions[93],
    positions[92],
    positions[91],
    positions[90],
    positions[76],
    positions[77],
    positions[78],
    positions[79],
    positions[80],
    positions[86],
    positions[85],
    positions[84],
  ],

  mustardB: [
    positions[84],
    positions[85],
    positions[86],
    positions[80],
    positions[79],
    positions[78],
    positions[77],
    positions[76],
    positions[90],
    positions[91],
    positions[92],
    positions[93],
    positions[94],
    positions[95],
    positions[96],
    positions[97],
    positions[122],
  ],

  redA: [
    positions[101],
    positions[92],
    positions[91],
    positions[90],
    positions[76],
    positions[62],
    positions[49],
    positions[37],
    positions[38],
    positions[39],
    positions[40],
    positions[26],
  ],

  redB: [
    positions[26],
    positions[40],
    positions[39],
    positions[38],
    positions[37],
    positions[49],
    positions[62],
    positions[76],
    positions[90],
    positions[91],
    positions[92],
    positions[101],
  ],

  lightPurpleA: [
    positions[101],
    positions[100],
    positions[93],
    positions[94],
    positions[73],
    positions[68],
    positions[46],
    positions[41],
    positions[40],
    positions[26],
  ],

  lightPurpleB: [
    positions[26],
    positions[40],
    positions[41],
    positions[46],
    positions[68],
    positions[73],
    positions[94],
    positions[93],
    positions[100],
    positions[101],
  ],

  tealA: [
    positions[147],
    positions[138],
    positions[127],
    positions[126],
    positions[125],
    positions[120],
    positions[99],
    positions[94],
    positions[73],
    positions[68],
    positions[46],
    positions[41],
    positions[40],
    positions[26],
  ],

  tealB: [
    positions[26],
    positions[40],
    positions[41],
    positions[46],
    positions[68],
    positions[73],
    positions[94],
    positions[99],
    positions[120],
    positions[125],
    positions[126],
    positions[127],
    positions[138],
    positions[147],
  ],

  peaA: [
    positions[147],
    positions[146],
    positions[139],
    positions[126],
    positions[125],
    positions[120],
    positions[99],
    positions[94],
    positions[93],
    positions[100],
    positions[101],
  ],

  peaB: [
    positions[101],
    positions[100],
    positions[93],
    positions[94],
    positions[99],
    positions[120],
    positions[125],
    positions[126],
    positions[139],
    positions[146],
    positions[147],
  ],

  mossA: [
    positions[101],
    positions[92],
    positions[91],
    positions[102],
    positions[117],
    positions[128],
    positions[127],
    positions[126],
    positions[125],
    positions[124],
    positions[123],
    positions[122],
  ],

  mossB: [
    positions[122],
    positions[123],
    positions[124],
    positions[125],
    positions[126],
    positions[127],
    positions[128],
    positions[117],
    positions[102],
    positions[91],
    positions[92],
    positions[101],
  ],

  bluePurpleA: [
    positions[101],
    positions[92],
    positions[91],
    positions[102],
    positions[117],
    positions[116],
    positions[115],
    positions[114],
    positions[113],
    positions[112],
    positions[111],
    positions[108],
    positions[85],
    positions[84],
  ],

  bluePurpleB: [
    positions[84],
    positions[85],
    positions[108],
    positions[111],
    positions[112],
    positions[113],
    positions[114],
    positions[115],
    positions[116],
    positions[117],
    positions[102],
    positions[91],
    positions[92],
    positions[101],
  ],

  orangeA: [
    positions[147],
    positions[138],
    positions[127],
    positions[128],
    positions[137],
    positions[136],
    positions[149],
    positions[135],
    positions[150],
    positions[134],
    positions[131],
    positions[113],
    positions[112],
    positions[111],
    positions[108],
    positions[85],
    positions[84],
  ],

  orangeB: [
    positions[84],
    positions[85],
    positions[108],
    positions[111],
    positions[112],
    positions[113],
    positions[131],
    positions[134],
    positions[150],
    positions[135],
    positions[149],
    positions[136],
    positions[137],
    positions[128],
    positions[127],
    positions[138],
    positions[147],
  ],

  yellowA: [
    positions[84],
    positions[85],
    positions[86],
    positions[80],
    positions[58],
    positions[53],
    positions[52],
    positions[51],
    positions[35],
    positions[30],
    positions[15],
    positions[16],
    positions[17],
    positions[18],
    positions[19],
    positions[26],
  ],

  yellowB: [
    positions[26],
    positions[19],
    positions[18],
    positions[17],
    positions[16],
    positions[15],
    positions[30],
    positions[35],
    positions[51],
    positions[52],
    positions[53],
    positions[58],
    positions[80],
    positions[86],
    positions[85],
    positions[84],
  ],

  lightRedA: [
    positions[84],
    positions[83],
    positions[56],
    positions[55],
    positions[33],
    positions[34],
    positions[31],
    positions[12],
    positions[13],
    positions[14],
    positions[15],
    positions[16],
    positions[17],
    positions[18],
    positions[19],
    positions[26],
  ],

  lightRedB: [
    positions[26],
    positions[19],
    positions[18],
    positions[17],
    positions[16],
    positions[15],
    positions[14],
    positions[13],
    positions[12],
    positions[31],
    positions[34],
    positions[33],
    positions[55],
    positions[56],
    positions[83],
    positions[84],
  ],
};

export default enemyPaths;
