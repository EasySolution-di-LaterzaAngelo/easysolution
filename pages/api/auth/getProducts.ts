import { getDownloadURL, ref } from 'firebase/storage';
import db, { storage } from '../../../firebase';
import firebase from 'firebase/compat/app';
export async function getProducts() {
  try {
    // Attempt to fetch data from cache
    const dbProdotti = await db
      .collection('prodotti')
      .orderBy('nome', 'asc')
      .get({ source: 'cache' });

    // If cache is empty or data is not available, fetch from server
    if (dbProdotti.empty) {
      // Fetch data from server
      const serverData = await db
        .collection('prodotti')
        .orderBy('nome', 'asc')
        .get({ source: 'server' });

      // Process and return data from the server
      return processProducts(serverData);
    }

    // Process and return data from cache
    return processProducts(dbProdotti);
  } catch (error) {
    // Handle any errors that might occur during the process
    console.error('Error fetching products:', error);
    throw error;
  }
}

// Process products function
async function processProducts(
  data: firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>
) {
  try {
    const prodotti = await Promise.all(
      data.docs.map(async (prodotti) => {
        const myarray = Object.entries(prodotti.data());

        const myObject: any = await myarray.reduce(
          async (objPromise, [key, value]) => {
            const obj = await objPromise;

            if (key === 'immagini') {
              const downloadURLs = [];
              for (let i = 0; i < value.length; i++) {
                const downloadURL = await getDownloadURL(
                  ref(storage, `immagini/${value[i]}`)
                );
                downloadURLs.push(downloadURL);
              }
              return { ...obj, [key]: downloadURLs };
            } else {
              return { ...obj, [key]: value };
            }
          },
          Promise.resolve({})
        );

        myObject.id = prodotti.id;
        return myObject;
      })
    );

    // Sort products by name
    prodotti.sort((a, b) => a.nome.localeCompare(b.nome));

    return prodotti;
  } catch (error) {
    console.error('Error processing products:', error);
    throw error;
  }
}

export async function getDiscountedProducts() {
  const dbProdotti = await db
    .collection('prodotti')
    .orderBy('sconto', 'asc') // Order by 'sconto'
    .get();

  const discountedProducts = dbProdotti.docs
    .filter((doc) => doc.data().sconto !== null)
    .map(async (prodotti) => {
      const myarray = Object.entries(prodotti.data());

      const myObject: any = await myarray.reduce(
        async (objPromise, [key, value]) => {
          const obj = await objPromise;

          if (key === 'immagini') {
            const downloadURLs = [];
            for (let i = 0; i < value.length; i++) {
              const downloadURL = await getDownloadURL(
                ref(storage, `immagini/${value[i]}`)
              );
              downloadURLs.push(downloadURL);
            }
            return { ...obj, [key]: downloadURLs };
          } else {
            return { ...obj, [key]: value };
          }
        },
        Promise.resolve({})
      );
      myObject.id = prodotti.id;
      return myObject;
    });

  const prodotti = await Promise.all(discountedProducts);
  prodotti.sort((a, b) => a.nome.localeCompare(b.nome)); // Sort the final result by 'nome'

  return prodotti;
}

export async function getProduct(id: any) {
  const prodotto = await db.collection('prodotti').doc(id).get();
  const data = prodotto.data();

  if (data) {
    const myarray = Object.entries(data);

    const myObject: any = await myarray.reduce(
      async (objPromise, [key, value]) => {
        const obj = await objPromise;
        if (key === 'immagini') {
          const downloadURLs = [];
          for (let i = 0; i < value.length; i++) {
            const downloadURL = await getDownloadURL(
              ref(storage, `immagini/${value[i]}`)
            );
            downloadURLs.push(downloadURL);
          }
          return { ...obj, [key]: value, immaginiUrl: downloadURLs };
        } else {
          return { ...obj, [key]: value };
        }
      },
      Promise.resolve({})
    );

    return myObject;
  } else {
    return null;
  }
}

export async function getFilterProducts(filter: any) {
  // Convert the filter string to lowercase
  const lowercaseFilter = filter.toLowerCase();

  // Construct a reference to the "prodotti" collection
  const prodottiRef = db.collection('prodotti');

  // Perform the query
  const querySnapshot = await prodottiRef.orderBy('nome').get();

  const prodotti = await Promise.all(
    querySnapshot.docs.map(async (doc) => {
      const prodotto = doc.data();
      const myObject: any = {};

      // Process each field of the product
      for (const [key, value] of Object.entries(prodotto)) {
        if (key === 'immagini') {
          const downloadURLs = [];
          for (let i = 0; i < value.length; i++) {
            const downloadURL = await getDownloadURL(
              ref(storage, `immagini/${value[i]}`)
            );
            downloadURLs.push(downloadURL);
          }
          myObject[key] = downloadURLs;
        } else {
          myObject[key] = value;
        }
      }
      myObject.id = doc.id;
      myObject.score = calculateSearchScore(lowercaseFilter, myObject);
      return myObject;
    })
  );

  // Find the highest score among the products
  const highestScore = Math.max(...prodotti.map((product) => product.score));

  // Define the threshold score as half of the highest score
  const thresholdScore = highestScore / 3;

  // Filter the products based on the threshold score
  const filteredProducts = prodotti.filter(
    (product) => product.score >= thresholdScore
  );

  // Exclude products with a score always below 5
  const finalProducts = filteredProducts.filter(
    (product) => product.score >= 20
  );

  // Sort the filtered products based on the score in descending order
  const sortedProducts = finalProducts.sort((a, b) => b.score - a.score);
  return sortedProducts;
}

function calculateSearchScore(
  filter: string,
  object: { [key: string]: string }
): number {
  let score = 0;
  let matchedFields = 0;
  const objectEntries = Object.entries(object);
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
