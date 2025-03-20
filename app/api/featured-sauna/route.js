import { NextResponse } from 'next/server';
import dbConnect from '@/libs/dbConnect';
import Sauna from '@/models/Sauna';

// Mark this route as dynamic
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await dbConnect();
    
    // First try to find a sauna marked as featured
    let featuredSauna = await Sauna.findOne({ featured: 'Y' }).select(
      'name address city province postalCode country phone website photoUrl rating reviewCount ' +
      'traditional wood infrared hot_tub cold_plunge steam private public mobile gay'
    );
    
    // If no featured sauna is found, fall back to the highest rated one
    if (!featuredSauna) {
      console.log('No featured sauna found, falling back to highest rated');
      
      featuredSauna = await Sauna.findOne({})
        .sort({ rating: -1, reviewCount: -1 })
        .select(
          'name address city province postalCode country phone website photoUrl rating reviewCount ' +
          'traditional wood infrared hot_tub cold_plunge steam private public mobile gay'
        );
    } else {
      console.log(`Featured sauna found: ${featuredSauna.name}`);
    }
    
    return NextResponse.json(featuredSauna);
  } catch (error) {
    console.error('Error fetching featured sauna:', error);
    return NextResponse.json(
      { error: 'Failed to fetch featured sauna' },
      { status: 500 }
    );
  }
} 