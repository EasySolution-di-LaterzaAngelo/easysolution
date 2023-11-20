export default async function getGoogleData() {
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/place/details/json?place_id=ChIJ3-dCeugDRxMRDucZxC_1_4c&language=it&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS}`,
    { next: { revalidate: 300 } }
  );

  if (!response.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch data');
  }

  return response.json();
}
