import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    const db = client.db(process.env.MONGODB_DB || 'sauna-finder');
    
    // Find a sauna that is marked as featured
    let featuredSauna = await db.collection("saunas")
      .findOne(
        { featured: true }, // Look for saunas with featured: true
        { sort: { rating: -1, reviewCount: -1 } } // If multiple, prioritize by rating and review count
      );
    
    // If no featured sauna is found, fall back to highest rated
    if (!featuredSauna) {
      console.log("No featured sauna found, falling back to highest rated");
      featuredSauna = await db.collection("saunas")
        .findOne(
          {}, // Any sauna
          { sort: { rating: -1, reviewCount: -1 } } // Sort by rating and review count
        );
    }
    
    console.log("Featured sauna found:", featuredSauna ? featuredSauna.name : "None");
    
    await client.close();
    return NextResponse.json(featuredSauna);
  } catch (error) {
    console.error("Error fetching featured sauna:", error);
    return NextResponse.json(null, { status: 500 });
  }
} 