import { Prodotto } from '@/types';

export function getFilterProducts(products: Prodotto[], filter: any) {
  // Convert the filter string to lowercase
  const lowercaseFilter = filter.toLowerCase();
  if (products) {
    const scoredProducts = products.map((product) => {
      return {
        ...product, // Spread the existing properties of the product
        score: calculateSearchScore(lowercaseFilter, product), // Update the 'score' property
      };
    });
    // Find the highest score among the products
    const highestScore = Math.max(
      ...scoredProducts.map((product) => product.score!)
    );
    // Define the threshold score as half of the highest score
    const thresholdScore = highestScore / 3;

    // Filter the products based on the threshold score
    const filteredProducts = scoredProducts.filter(
      (product) => product.score! >= thresholdScore
    );

    // Exclude products with a score always below 5
    const finalProducts = filteredProducts.filter(
      (product) => product.score! >= 20
    );
    // Sort the filtered products based on the score in descending order
    const sortedProducts = finalProducts.sort((a, b) => b.score! - a.score!);
    return sortedProducts.length > 0 ? sortedProducts : [];
  }
}

function calculateSearchScore(filter: string, product: object): number {
  let score = 0;
  let matchedFields = 0;
  const objectEntries = Object.entries(product);
  const keywords = filter.split(' '); // Split the search term into keywords

  for (const entries of objectEntries) {
    if (
      !['id', 'immagine', 'prezzo', 'sconto', 'percentuale'].includes(
        entries[0]
      )
    ) {
      const value = entries[1];
      const lowercasedValue =
        typeof value === 'string' ? value.toLowerCase() : '';

      for (const keyword of keywords) {
        const keywordWords = keyword.split(' '); // Split the keyword into individual words

        for (const keywordWord of keywordWords) {
          const keywordDistance = calculateLevenshteinDistance(
            keywordWord,
            lowercasedValue
          );

          if (lowercasedValue.includes(keywordWord) || keywordDistance <= 1) {
            score += 100 * keyword.length; // Increase score if keyword word is found in the value or is very close
          } else {
            score += (1 / (keywordDistance + 1)) * keywordWord.length; // Assign higher score for closer matches
            // console.log(lowercasedValue, keywordDistance);
          }
        }
      }

      if (
        keywords.some((keyword) => {
          const keywordWords = keyword.split(' '); // Split the keyword into individual words
          return keywordWords.some((keywordWord) =>
            lowercasedValue.includes(keywordWord)
          );
        })
      ) {
        matchedFields++; // Increment the count of matched fields if any keyword word is found
      }
    }
  }

  // Add the number of matched fields to the score
  score += matchedFields;

  return score;
}

function calculateLevenshteinDistance(a: string, b: string): number {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[b.length][a.length];
}
