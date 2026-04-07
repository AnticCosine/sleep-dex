import { TestBed } from '@angular/core/testing';
import { OcrIngredientService } from './ocr-ingredient-service';

const testCases = [
  {
    test: '1',
    expected: [
      { id: 'fancy_egg', quantity: 164 },
      { id: 'honey', quantity: 235 },
      { id: 'snoozy_tomato', quantity: 181 },
      { id: 'plump_pumpkin', quantity: 144}
    ]
  },
  {
    test: '2',
    expected: [
      { id: 'fancy_egg', quantity: 165 },
      { id: 'moomoo_milk', quantity: 1 },
      { id: 'honey', quantity: 200 },
      { id: 'snoozy_tomato', quantity: 154},
      { id: 'soothing_cacao', quantity: 1},
      { id: 'plump_pumpkin', quantity: 136}
    ]
  },
  {
    test: '3',
    expected: [
      { id: 'rousing_coffee', quantity: 410 },
      { id: 'soothing_cacao', quantity: 170 },
      { id: 'moomoo_milk', quantity: 106 },
      { id: 'slowpoke_tail', quantity: 36 },
      { id: 'honey', quantity: 28 },
      { id: 'fancy_apple', quantity: 13 },
      { id: 'snoozy_tomato', quantity: 12 },
      { id: 'pure_oil', quantity: 8 },
      { id: 'greengrass_corn', quantity: 4 }
    ]
  },
  {
    test: '4',
    expected: [
      { id: 'fancy_egg', quantity: 50 },
      { id: 'honey', quantity: 102 },
      { id: 'snoozy_tomato', quantity: 51 },
      { id: 'slowpoke_tail', quantity: 167 },
      { id: 'plump_pumpkin', quantity: 378 }
    ]
  },
  {
    test: '5',
    expected: [
      { id: 'fancy_egg', quantity: 7 },
      { id: 'fancy_apple', quantity: 5 },
      { id: 'fiery_herb', quantity: 13 },
      { id: 'moomoo_milk', quantity: 63 },
      { id: 'honey', quantity: 26 },
      { id: 'pure_oil', quantity: 24 },
      { id: 'warming_ginger', quantity: 29 },
      { id: 'snoozy_tomato', quantity: 38 },
      { id: 'soothing_cacao', quantity: 10 },
      { id: 'greengrass_soybeans', quantity: 7 }
    ]
  },
  {
    test: '6',
    expected: [
      { id: 'honey', quantity: 185 },
      { id: 'pure_oil', quantity: 217 },
      { id: 'soothing_cacao', quantity: 203 },
      { id: 'greengrass_corn', quantity: 210 }
    ]
  },
  {
    test: '7',
    expected: [
      { id: 'fancy_egg', quantity: 168 },
      { id: 'honey', quantity: 227 },
      { id: 'snoozy_tomato', quantity: 215 },
      { id: 'slowpoke_tail', quantity: 30 },
      { id: 'plump_pumpkin', quantity: 160 }
    ]
  },
  {
    test: '8',
    expected: [
      { id: 'honey', quantity: 241 },
      { id: 'moomoo_milk', quantity: 208 },
      { id: 'rousing_coffee', quantity: 256 },
      { id: 'soothing_cacao', quantity: 95 }
    ]
  },
  {
    test: '9',
    expected: [
      { id: 'fancy_egg', quantity: 142 },
      { id: 'fancy_apple', quantity: 21 },
      { id: 'moomoo_milk', quantity: 15 },
      { id: 'honey', quantity: 43 },
      { id: 'warming_ginger', quantity: 20 },
      { id: 'snoozy_tomato', quantity: 86 },
      { id: 'soothing_cacao', quantity: 41 },
      { id: 'greengrass_corn', quantity: 18 },
      { id: 'rousing_coffee', quantity: 96 },
      { id: 'plump_pumpkin', quantity: 265 }
    ]
  },
  {
    test: '10', 
    expected: [
      { id: 'honey', quantity: 321 },
      { id: 'pure_oil', quantity: 167 },
      { id: 'soothing_cacao', quantity: 168 },
      { id: 'greengrass_corn', quantity: 144 }
    ]
  },
  {
    test: '11',
    expected: [
      { id: 'moomoo_milk', quantity: 345 },
      { id: 'honey', quantity: 277 },
      { id: 'rousing_coffee', quantity: 86 },
      { id: 'soothing_cacao', quantity: 82 }
    ]
  },
  {
    test: '12',
    expected: [
      { id: 'fancy_egg', quantity: 342 },
      { id: 'honey', quantity: 85 },
      { id: 'snoozy_tomato', quantity: 113 },
      { id: 'plump_pumpkin', quantity: 257 }
    ]
  },
  {
    test: '13',
    expected: [
      { id: 'large_leek', quantity: 60 },
      { id: 'tasty_mushroom', quantity: 69 },
      { id: 'soft_potato', quantity: 66 },
      { id: 'fancy_apple', quantity: 105 },
      { id: 'bean_sausage', quantity: 84 },
      { id: 'pure_oil', quantity: 66 },
      { id: 'warming_ginger', quantity: 60 },
      { id: 'snoozy_tomato', quantity: 75 },
      { id: 'greengrass_soybeans', quantity: 84 },
      { id: 'rousing_coffee', quantity: 131 }
    ]
  },
  {
    test: '14',
    expected: [
      { id: 'fancy_egg', quantity: 3 },
      { id: 'fancy_apple', quantity: 31 },
      { id: 'fiery_herb', quantity: 3 },
      { id: 'bean_sausage', quantity: 35 },
      { id: 'moomoo_milk', quantity: 45 },
      { id: 'honey', quantity: 1 },
      { id: 'pure_oil', quantity: 10 },
      { id: 'warming_ginger', quantity: 3 },
      { id: 'snoozy_tomato', quantity: 7 }
    ]
  },
  {
    test: '15',
    expected: [
      { id: 'large_leek', quantity: 16 },
      { id: 'tasty_mushroom', quantity: 70 },
      { id: 'fancy_egg', quantity: 31 },
      { id: 'soft_potato', quantity: 52 },
      { id: 'fancy_apple', quantity: 41 },
      { id: 'fiery_herb', quantity: 59 },
      { id: 'bean_sausage', quantity: 67 },
      { id: 'moomoo_milk', quantity: 80 },
      { id: 'honey', quantity: 35 },
      { id: 'pure_oil', quantity: 12 },
      { id: 'warming_ginger', quantity: 29 },
      { id: 'snoozy_tomato', quantity: 24 }
    ]
  },
  {
    test: '16',
    expected: [
      { id: 'fancy_egg', quantity: 69 },
      { id: 'soft_potato', quantity: 3 },
      { id: 'fancy_apple', quantity: 63 },
      { id: 'fiery_herb', quantity: 4 },
      { id: 'bean_sausage', quantity: 93 },
      { id: 'moomoo_milk', quantity: 67 },
      { id: 'honey', quantity: 92 },
      { id: 'pure_oil', quantity: 6 },
      { id: 'warming_ginger', quantity: 14 },
      { id: 'snoozy_tomato', quantity: 9 },
      { id: 'greengrass_soybeans', quantity: 14 },
      { id: 'greengrass_corn', quantity: 6 }
    ]
  },
  {
    test: '17',
    expected: [
      { id: 'tasty_mushroom', quantity: 11 },
      { id: 'fancy_egg', quantity: 40 },
      { id: 'soft_potato', quantity: 4 },
      { id: 'fancy_apple', quantity: 59 },
      { id: 'fiery_herb', quantity: 8 },
      { id: 'bean_sausage', quantity: 68 },
      { id: 'moomoo_milk', quantity: 81 },
      { id: 'honey', quantity: 68 },
      { id: 'pure_oil', quantity: 11 },
      { id: 'warming_ginger', quantity: 6 },
      { id: 'snoozy_tomato', quantity: 10 },
      { id: 'soothing_cacao', quantity: 4 },
      { id: 'greengrass_soybeans', quantity: 3 },
      { id: 'greengrass_corn', quantity: 8 },
      { id: 'plump_pumpkin', quantity: 12 }
    ]
  },
  {
    test: '18',
    expected: [
      { id: 'fancy_egg', quantity: 25 },
      { id: 'moomoo_milk', quantity: 104 },
      { id: 'honey', quantity: 126 },
      { id: 'snoozy_tomato', quantity: 29 },
      { id: 'soothing_cacao', quantity: 156 },
      { id: 'rousing_coffee', quantity: 342 },
      { id: 'plump_pumpkin', quantity: 18 }
    ]
  },
  {
    test: '19',
    expected: [
      { id: 'tasty_mushroom', quantity: 4 },
      { id: 'soft_potato', quantity: 6 },
      { id: 'fancy_apple', quantity: 19 },
      { id: 'bean_sausage', quantity: 1 },
      { id: 'moomoo_milk', quantity: 16 },
      { id: 'honey', quantity: 90 },
      { id: 'pure_oil', quantity: 67 },
      { id: 'snoozy_tomato', quantity: 66 },
      { id: 'soothing_cacao', quantity: 395 },
      { id: 'greengrass_corn', quantity: 133 },
      { id: 'rousing_coffee', quantity: 3 }
    ]
  },
  {
    test: '20',
    expected: [
      { id: 'plump_pumpkin', quantity: 378 },
      { id: 'fancy_egg', quantity: 288 },
      { id: 'honey', quantity: 32 },
      { id: 'snoozy_tomato', quantity: 29 },
      { id: 'slowpoke_tail', quantity: 5 }
    ]
  },
  {
    test: '21',
    expected: [
      { id: 'honey', quantity: 2 },
      { id: 'fancy_egg', quantity: 4 },
      { id: 'pure_oil', quantity: 5 },
      { id: 'large_leek', quantity: 6 },
      { id: 'moomoo_milk', quantity: 6 },
      { id: 'soothing_cacao', quantity: 6 },
      { id: 'slowpoke_tail', quantity: 6 },
      { id: 'fancy_apple', quantity: 122 },
      { id: 'greengrass_corn', quantity: 130 },
      { id: 'warming_ginger', quantity: 140 },
      { id: 'tasty_mushroom', quantity: 156 }
    ]
  },
  {
    test: '22',
    expected: [
      { id: 'tasty_mushroom', quantity: 91 },
      { id: 'fancy_egg', quantity: 2 },
      { id: 'fancy_apple', quantity: 108 },
      { id: 'fiery_herb', quantity: 15 },
      { id: 'moomoo_milk', quantity: 7 },
      { id: 'pure_oil', quantity: 19 },
      { id: 'warming_ginger', quantity: 157 },
      { id: 'slowpoke_tail', quantity: 6 },
      { id: 'greengrass_corn', quantity: 89 }
    ]
  },
  {
    test: '23',
    expected: [
      { id: 'large_leek', quantity: 64 },
      { id: 'tasty_mushroom', quantity: 112 },
      { id: 'soft_potato', quantity: 19 },
      { id: 'fancy_apple', quantity: 52 },
      { id: 'fiery_herb', quantity: 55 },
      { id: 'bean_sausage', quantity: 80 },
      { id: 'moomoo_milk', quantity: 80 },
      { id: 'honey', quantity: 29 },
      { id: 'pure_oil', quantity: 9 },
      { id: 'warming_ginger', quantity: 2 },
      { id: 'snoozy_tomato', quantity: 7 },
      { id: 'soothing_cacao', quantity: 63 },
      { id: 'greengrass_soybeans', quantity: 68 },
      { id: 'greengrass_corn', quantity: 47 }
    ]
  },
  {
    test: '24',
    expected: [
      { id: 'fancy_egg', quantity: 86 },
      { id: 'bean_sausage', quantity: 13 },
      { id: 'moomoo_milk', quantity: 12 },
      { id: 'honey', quantity: 32 },
      { id: 'snoozy_tomato', quantity: 40 },
      { id: 'slowpoke_tail', quantity: 150 },
      { id: 'plump_pumpkin', quantity: 334 }
    ]
  }
];

describe('OcrIngredientService', () => {
  let service: OcrIngredientService;
  const report: string[] = new Array(testCases.length);
  let totalPassed = 0;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OcrIngredientService);
  });

  afterAll(() => {
    //console.log('\n========== TEST REPORT ==========\n' + report.join('\n') + '\n=================================');
    //console.log("✅ TOTAL PASSED: ", totalPassed)
  });

  async function loadTestImage(path: string): Promise<File> {
    const response = await fetch(path);
    const blob = await response.blob();
    return new File([blob], 'test.png', { type: blob.type });
  }

  testCases.forEach(({test, expected}, index) => {
    it('should correctly parse ingredients from image', async () => {
      const file = await loadTestImage(`/assets/images/tests/${test}.png`);

      const result = await service.processImage(file);

      const sortFn = (a: any, b: any) => a.id.localeCompare(b.id);

      const passed =
        JSON.stringify([...result].sort(sortFn)) ===
        JSON.stringify([...expected].sort(sortFn));

      /*
      if (passed) {
        report[index] = (`✅ TEST ${test}: PASSED`);
        totalPassed++;
      } else {
        report[index] = (
          `❌ TEST ${test}: FAILED
          Expected: ${JSON.stringify(expected)}
          Result  : ${JSON.stringify(result)}
          `
        );
      }
      */

      expect(passed).toEqual(true);
    }, 10000);
  })
  
});
