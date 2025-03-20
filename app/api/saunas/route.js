import { NextResponse } from 'next/server';
import dbConnect from '@/libs/dbConnect';
import Sauna from '@/models/Sauna';

// Wilson Score calculation function
function calculateWilsonScore(rating, reviewCount) {
  if (reviewCount === 0) return 0;
  const z = 1.96; // 95% confidence
  const p = rating / 5; // Convert 5-star rating to percentage
  const n = reviewCount;
  
  // Wilson Score calculation
  const numerator = p + z*z/(2*n) - z * Math.sqrt((p*(1-p) + z*z/(4*n))/n);
  const denominator = 1 + z*z/n;
  
  return numerator / denominator;
}

// Add export config to mark this route as dynamic
export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    await dbConnect();
    
    // Get query parameters using searchParams instead of request.url
    const url = new URL(request.url);
    const city = url.searchParams.get('city');
    const province = url.searchParams.get('province');
    
    // Build query
    const query = {};
    
    // Handle multi-word city and province names
    if (city) {
      // Convert underscores to spaces and ensure lowercase
      const formattedCity = city.toLowerCase().replace(/_/g, ' ');
      query.city = formattedCity;
    }
    
    if (province) {
      // Convert underscores to spaces and ensure lowercase
      const formattedProvince = province.toLowerCase().replace(/_/g, ' ');
      query.province = formattedProvince;
    }
    
    console.log('Query:', query); // Debug the query
    
    // Find saunas matching the query
    const saunas = await Sauna.find(query).select(
      'name address city province postalCode country phone website photoUrl rating reviewCount ' +
      'traditional wood infrared hot_tub cold_plunge steam private public mobile gay featured'
    );
    
    console.log(`Found ${saunas.length} saunas for query:`, query); // Debug the results
    
    // Sort saunas by Wilson score (combination of rating and review count)
    saunas.sort((a, b) => {
      const scoreA = calculateWilsonScore(a.rating, a.reviewCount);
      const scoreB = calculateWilsonScore(b.rating, b.reviewCount);
      return scoreB - scoreA;
    });
    
    return NextResponse.json(saunas);
  } catch (error) {
    console.error('Error fetching saunas:', error);
    return NextResponse.json(
      { error: 'Failed to fetch saunas' },
      { status: 500 }
    );
  }
}
