import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import useIngredientsList from './useIngredientsList';
import { Recipe } from '../interfaces/recipe';
import { parseIngredient } from 'parse-ingredient';
// import {IMPERIAL_UNITS, METRIC_UNITS, UNIT_ORDER, IMPERIAL, METRIC} from '../interfaces/ingredient'
// Mock the parse-ingredient library

vi.mock('parse-ingredient', () => ({
  parseIngredient: vi.fn()
}));

// Mock the utils/ingredients module
vi.mock('../../utils/ingredients', () => ({

  convertToAllUnits: vi.fn((quantity, fromUnit, toUnit) => {
    // Simple mock conversion logic
    if (fromUnit === 'teaspoon' && toUnit === 'tablespoon') {
      return quantity / 3;
    }
    if (fromUnit === 'tablespoon' && toUnit === 'cup') {
      return quantity / 16;
    }
    return quantity;
  })
}));

const mockParseIngredient = vi.mocked(parseIngredient);

describe('useIngredientsList', () => {
  const mockRecipe: Recipe = {
    name: 'Test Recipe',
    url: 'https://example.com/recipe',
    recipeIngredient: [
      '2 cups flour',
      '1 tablespoon sugar',
      '1 teaspoon salt'
    ],
    mainEntityOfPage: undefined
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('extractIngredients', () => {
    it('should initialize with empty keywordsMap', () => {
      const { result } = renderHook(() => useIngredientsList());
      expect(result.current.keywordsMap).toEqual({});
    });

    it('should handle recipe with no ingredients', () => {
      const { result } = renderHook(() => useIngredientsList());
      const emptyRecipe: Recipe = {
        name: 'Empty Recipe',
        url: 'https://example.com',
        recipeIngredient: [],
        mainEntityOfPage: undefined
      };

      act(() => {
        result.current.extractIngredients(emptyRecipe);
      });

      expect(result.current.keywordsMap).toEqual({});
    });

    it('should extract and consolidate ingredients correctly', () => {
      mockParseIngredient
        .mockReturnValueOnce([{
          description: 'all-purpose flour',
          quantity: 2,
          unitOfMeasure: 'cups',
          unitOfMeasureID: 'cup',
          quantity2: null,
          isGroupHeader: false
        }])
        .mockReturnValueOnce([{
          description: 'granulated sugar',
          quantity: 1,
          unitOfMeasure: 'tablespoon',
          unitOfMeasureID: 'tablespoon',
          quantity2: null,
          isGroupHeader: false
        }])
        .mockReturnValueOnce([{
          description: 'kosher salt',
          quantity: 1,
          unitOfMeasure: 'teaspoon',
          unitOfMeasureID: 'teaspoon',
          quantity2: null,
          isGroupHeader: false
        }]);

      const { result } = renderHook(() => useIngredientsList());

      act(() => {
        result.current.extractIngredients(mockRecipe);
      });

      const keywordsMap = result.current.keywordsMap
      const flourObj = keywordsMap['flour'];

      expect(keywordsMap).toHaveProperty('flour');
      expect(keywordsMap).toHaveProperty('sugar');
      expect(keywordsMap).toHaveProperty('salt');

      expect(flourObj.quantity).toBe(2);
      expect(flourObj.unitOfMeasure).toBe('cups');
      expect(Object.keys(flourObj.ingredients)).toHaveLength(1);
    });

    it('should consolidate ingredients with same keyword', () => {
      mockParseIngredient
        .mockReturnValueOnce([{
          description: 'all-purpose flour',
          quantity: 2,
          unitOfMeasure: 'cups',
          unitOfMeasureID: 'cup',
          quantity2: null,
          isGroupHeader: false
        }])
        .mockReturnValueOnce([{
          description: 'whole wheat flour',
          quantity: 1,
          unitOfMeasure: 'cup',
          unitOfMeasureID: 'cup',
          quantity2: null,
          isGroupHeader: false
        }]);

      const { result } = renderHook(() => useIngredientsList());
      const recipeWithDuplicates: Recipe = {
        name: 'Test Recipe',
        url: 'https://example.com',
        recipeIngredient: ['2 cups all-purpose flour', '1 cup whole wheat flour'],
        mainEntityOfPage: undefined
      };

      act(() => {
        result.current.extractIngredients(recipeWithDuplicates);
      });
      const keywordsMap = result.current.keywordsMap;

      expect(keywordsMap['flour'].quantity).toBe(3);
      expect(Object.keys(keywordsMap['flour'].ingredients)).toHaveLength(2);
    });

    it('should handle unit conversion between compatible units', () => {
      mockParseIngredient
        .mockReturnValueOnce([{
          description: 'vanilla extract',
          quantity: 3,
          unitOfMeasure: 'teaspoons',
          unitOfMeasureID: 'teaspoon',
          quantity2: null,
          isGroupHeader: false
        }])
        .mockReturnValueOnce([{
          description: 'vanilla extract',
          quantity: 2,
          unitOfMeasure: 'tablespoons',
          unitOfMeasureID: 'tablespoon',
          quantity2: null,
          isGroupHeader: false
        }]);

      const { result } = renderHook(() => useIngredientsList());
      const recipeWithConversions: Recipe = {
        name: 'Test Recipe',
        url: 'https://example.com',
        recipeIngredient: ['3 teaspoons vanilla extract', '2 tablespoons vanilla extract'],
        mainEntityOfPage: undefined
      };

      act(() => {
        result.current.extractIngredients(recipeWithConversions);
      });

      const keywordsMap = result.current.keywordsMap;

      // Should consolidate to the larger unit (tablespoon)
      expect(keywordsMap['vanilla extract'].unitOfMeasure).toBe('tablespoons');
      expect(keywordsMap['vanilla extract'].unitOfMeasureID).toBe('tablespoon');
      expect(keywordsMap['vanilla extract'].quantity).toBe(3);
    });

    it('should handle ingredients with non-standard units', () => {
      mockParseIngredient
        .mockReturnValueOnce([{
          description: 'large eggs',
          quantity: 1,
          unitOfMeasure: '',
          unitOfMeasureID: null,
          quantity2: null,
          isGroupHeader: false
        }])
        .mockReturnValueOnce([{
          description: 'medium egg',
          quantity: 1,
          unitOfMeasure: '',
          unitOfMeasureID: null,
          quantity2: null,
          isGroupHeader: false
        }])
        .mockReturnValueOnce([{
          description: 'eggs',
          quantity: 3,
          unitOfMeasure: '',
          unitOfMeasureID: null,
          quantity2: null,
          isGroupHeader: false
        }])
        .mockReturnValueOnce([{
          description: 'cilantro',
          quantity: 1,
          unitOfMeasure: 'bunch',
          unitOfMeasureID: 'bunch',
          quantity2: null,
          isGroupHeader: false
        }])
        .mockReturnValueOnce([{
          description: 'cilantro',
          quantity: 0.5,
          unitOfMeasure: 'cup',
          unitOfMeasureID: 'cup',
          quantity2: null,
          isGroupHeader: false
        }])
        .mockReturnValueOnce([{
          description: 'cilantro',
          quantity: 4,
          unitOfMeasure: 'tablespoons',
          unitOfMeasureID: 'tablespoon',
          quantity2: null,
          isGroupHeader: false
        }])
        .mockReturnValueOnce([{
          description: 'cilantro',
          quantity: 0.5,
          unitOfMeasure: 'bunch',
          unitOfMeasureID: 'bunch',
          quantity2: null,
          isGroupHeader: false
        }]);

      const { result } = renderHook(() => useIngredientsList());

      const recipeWithCountUnits: Recipe = {
        name: 'Test Recipe',
        url: 'https://example.com',
        recipeIngredient: [
          '1 large egg',
          '1 medium egg',
          '3 eggs',
          '1 small bunch of cilantro',
          '1/2 cup cilantro',
          '4 tbsp. of cilantro',
          '1/2 bunch of cilantro'
        ],
        mainEntityOfPage: undefined
      };

      act(() => {
        result.current.extractIngredients(recipeWithCountUnits);
      });


      const keywordsMap = result.current.keywordsMap

      expect(keywordsMap['eggs']).toBeDefined();
      expect(keywordsMap['eggs'].quantity).toBe(5);
      expect(keywordsMap['cilantro']).toBeDefined();
      expect(keywordsMap['cilantro'].unitOfMeasure).toBe('cup');
      expect(keywordsMap['cilantro'].quantity).toBe(.75);
      expect(keywordsMap['cilantro'].additionalQuantities).toBeDefined();
      expect(keywordsMap['cilantro'].additionalQuantities).toStrictEqual({
        bunch: {
          quantity: 1.5,
          unitOfMeasure: "bunch"
        }
      });

      expect(Object.keys(keywordsMap['cilantro'].additionalQuantities || {})).toHaveLength(1);
      expect(Object.values(keywordsMap['cilantro'].additionalQuantities || {}).reduce((accum, val) => { return accum + val.quantity; }, 0)).toBe(1.5);
    });


    it('should handle parsing errors gracefully', () => {
      mockParseIngredient.mockImplementation(() => {
        throw new Error('Parse error');
      });

      const { result } = renderHook(() => useIngredientsList());

      act(() => {
        result.current.extractIngredients({
          mainEntityOfPage: undefined,
          url: ''
        });
      });
      const keywordsMap = result.current.keywordsMap
      expect(keywordsMap).toEqual({});
    });
  });

  // describe('toggleCheckedKeyword', () => {
  //   beforeEach(() => {
  //     mockParseIngredient.mockReturnValue([{
  //       description: 'all-purpose flour',
  //       quantity: 2,
  //       unitOfMeasure: 'cups',
  //       unitOfMeasureID: 'cup'
  //     }]);
  //   });

  //   it('should toggle keyword checked status and all its ingredients', () => {
  //     const { result } = renderHook(() => useIngredientsList());

  //     act(() => {
  //       result.current.extractIngredients(mockRecipe);
  //     });

  //     act(() => {
  //       result.current.toggleCheckedKeyword(true, 'flour');
  //     });

  //     expect(result.current.keywordsMap['flour'].isChecked).toBe(true);
  //     expect(result.current.keywordsMap['flour'].ingredients[0].isChecked).toBe(true);

  //     act(() => {
  //       result.current.toggleCheckedKeyword(false, 'flour');
  //     });

  //     expect(result.current.keywordsMap['flour'].isChecked).toBe(false);
  //     expect(result.current.keywordsMap['flour'].ingredients[0].isChecked).toBe(false);
  //   });
  // });

  // describe('toggleCheckedIngredient', () => {
  //   beforeEach(() => {
  //     mockParseIngredient
  //       .mockReturnValueOnce([{
  //         description: 'all-purpose flour',
  //         quantity: 2,
  //         unitOfMeasure: 'cups',
  //         unitOfMeasureID: 'cup'
  //       }])
  //       .mockReturnValueOnce([{
  //         description: 'whole wheat flour',
  //         quantity: 1,
  //         unitOfMeasure: 'cup',
  //         unitOfMeasureID: 'cup'
  //       }]);
  //   });

  //   it('should toggle individual ingredient checked status', () => {
  //     const { result } = renderHook(() => useIngredientsList());
  //     const recipeWithMultipleFlours: Recipe = {
  //       name: 'Test Recipe',
  //       url: 'https://example.com',
  //       recipeIngredient: ['2 cups all-purpose flour', '1 cup whole wheat flour'],
  //       mainEntityOfPage: undefined
  //     };

  //     act(() => {
  //       result.current.extractIngredients(recipeWithMultipleFlours);
  //     });

  //     act(() => {
  //       result.current.toggleCheckedIngredient(true, 'flour', 'all-purpose flour');
  //     });

  //     const flourKeyword = result.current.keywordsMap['flour'];
  //     const allPurposeFlour = flourKeyword.ingredients.find(i => i.description === 'all-purpose flour');
  //     const wholeWheatFlour = flourKeyword.ingredients.find(i => i.description === 'whole wheat flour');

  //     expect(allPurposeFlour?.isChecked).toBe(true);
  //     expect(wholeWheatFlour?.isChecked).toBe(false);
  //     expect(flourKeyword.isChecked).toBe(false); // Not all ingredients are checked
  //   });

  //   it('should set keyword as checked when all ingredients are checked', () => {
  //     const { result } = renderHook(() => useIngredientsList());
  //     const recipeWithMultipleFlours: Recipe = {
  //       name: 'Test Recipe',
  //       url: 'https://example.com',
  //       recipeIngredient: ['2 cups all-purpose flour', '1 cup whole wheat flour'],
  //       mainEntityOfPage: undefined
  //     };

  //     act(() => {
  //       result.current.extractIngredients(recipeWithMultipleFlours);
  //     });

  //     act(() => {
  //       result.current.toggleCheckedIngredient(true, 'flour', 'all-purpose flour');
  //     });

  //     act(() => {
  //       result.current.toggleCheckedIngredient(true, 'flour', 'whole wheat flour');
  //     });

  //     expect(result.current.keywordsMap['flour'].isChecked).toBe(true);
  //   });
  // });

  // describe('setKeywordsMap', () => {
  //   it('should allow direct manipulation of keywordsMap', () => {
  //     const { result } = renderHook(() => useIngredientsList());
  //     const newKeywordsMap = {
  //       'test': {
  //         quantity: 1,
  //         measurementSystem: 'imperial' as const,
  //         unitOfMeasure: 'cup',
  //         unitOfMeasureID: 'cup',
  //         additionalQuantity: '',
  //         isChecked: false,
  //         ingredients: []
  //       }
  //     };

  //     act(() => {
  //       result.current.setKeywordsMap(newKeywordsMap);
  //     });

  //     expect(result.current.keywordsMap).toEqual(newKeywordsMap);
  //   });
  // });
});