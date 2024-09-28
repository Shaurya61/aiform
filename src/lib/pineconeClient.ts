import { Pinecone } from '@pinecone-database/pinecone';

export const initPinecone = async () => {
  const pc = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY || "", // Store your API key in an environment variable
  });

  const indexName = 'survey'; // Replace with your preferred index name
  const dimension = 768; // Set this to match the dimensions of your embeddings

  // Check if the index already exists
  const existingIndexes = await pc.listIndexes();
  if (!existingIndexes.indexes?.some((index) => index.name === indexName)) {
    // Create the index if it doesn't exist
    await pc.createIndex({
      name: indexName,
      dimension: dimension,
      metric: 'cosine', // You can use 'euclidean' or 'cosine' depending on your use case
      spec: {
        serverless: {
          cloud: 'aws',
          region: 'us-east-1' // Replace with your desired region
        }
      }
    });
  } else {
    console.log(`Index "${indexName}" already exists. Using the existing index.`);
  }

  return pc.Index(indexName); // Return the initialized index
};
