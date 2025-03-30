import { useState, useEffect } from 'react';

const ProvinceSelector = ({ 
  locationData, 
  selectedProvince, 
  setSelectedProvince, 
  selectedCity, 
  setSelectedCity,
  saunas,
  loading
}) => {
  return (
    <>
      {/* Desktop View - Three Column Layout */}
      <div className="hidden md:flex gap-6">
        {/* Province column */}
        <div className="w-1/4">
          <div className="border-l-2 border-gray-light pl-4">
            <h3 className="text-xl font-semibold mb-4">Provinces</h3>
            <ul className="space-y-2">
              {Object.keys(locationData).map((provinceKey) => {
                const province = locationData[provinceKey];
                const provinceSlug = provinceKey.toLowerCase().replace(/\s+/g, '-');
                
                return (
                  <li key={provinceKey}>
                    <button
                      onClick={() => setSelectedProvince(provinceKey)}
                      className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                        selectedProvince === provinceKey 
                          ? "bg-base-200 font-medium border-l-4 border-primary" 
                          : "hover:bg-base-100 hover:border-l-4 hover:border-gray-light"
                      }`}
                    >
                      {province.name}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
        
        {/* Cities column */}
        {selectedProvince && locationData[selectedProvince] && (
          <div className="w-1/4">
            <div className="border-l-2 border-gray-light pl-4">
              <h3 className="text-xl font-semibold mb-4">Cities in {locationData[selectedProvince].name}</h3>
              <ul className="space-y-2">
                {Object.keys(locationData[selectedProvince].cities)
                  .sort((a, b) => {
                    // Sort by city name alphabetically
                    const cityA = locationData[selectedProvince].cities[a].name.toUpperCase();
                    const cityB = locationData[selectedProvince].cities[b].name.toUpperCase();
                    return cityA.localeCompare(cityB);
                  })
                  .map((cityKey) => {
                    const city = locationData[selectedProvince].cities[cityKey];
                    // Format the city name properly - capitalize each word
                    const displayName = city.name.split(' ')
                      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(' ');
                    
                    return (
                      <li key={cityKey}>
                        <button
                          onClick={() => setSelectedCity(cityKey)}
                          className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                            selectedCity === cityKey 
                              ? "bg-base-200 font-medium border-l-4 border-primary" 
                              : "hover:bg-base-100 hover:border-l-4 hover:border-gray-light"
                          }`}
                        >
                          {displayName}
                        </button>
                      </li>
                    );
                  })}
              </ul>
            </div>
          </div>
        )}
        
        {/* Saunas column */}
        {selectedProvince && selectedCity && locationData[selectedProvince]?.cities[selectedCity] && (
          <div className="w-2/4">
            <div className="border-l-2 border-gray-light pl-4">
              <h3 className="text-xl font-semibold mb-4">
                Top Saunas in {locationData[selectedProvince].cities[selectedCity].name}
              </h3>
              
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {saunas.length > 0 ? (
                    saunas.map((sauna) => (
                      <SaunaCard key={sauna._id} sauna={sauna} />
                    ))
                  ) : (
                    <p>No saunas found in this location.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Mobile View - Stepped Navigation */}
      <div className="md:hidden">
        {/* Province Selection */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Select Province</h3>
          <select 
            className="select select-bordered w-full"
            value={selectedProvince || ''}
            onChange={(e) => setSelectedProvince(e.target.value)}
          >
            <option value="" disabled>Choose a province</option>
            {Object.keys(locationData).map((provinceKey) => {
              const province = locationData[provinceKey];
              const provinceSlug = provinceKey.toLowerCase().replace(/\s+/g, '-');
              
              return (
                <option key={provinceKey} value={provinceKey}>
                  {province.name}
                </option>
              );
            })}
          </select>
        </div>
        
        {/* City Selection - Only show if province is selected */}
        {selectedProvince && locationData[selectedProvince] && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Select City</h3>
            <select 
              className="select select-bordered w-full"
              value={selectedCity || ''}
              onChange={(e) => setSelectedCity(e.target.value)}
            >
              <option value="" disabled>Choose a city</option>
              {Object.keys(locationData[selectedProvince].cities)
                .sort((a, b) => {
                  // Sort by city name alphabetically
                  const cityA = locationData[selectedProvince].cities[a].name.toUpperCase();
                  const cityB = locationData[selectedProvince].cities[b].name.toUpperCase();
                  return cityA.localeCompare(cityB);
                })
                .map((cityKey) => {
                  const city = locationData[selectedProvince].cities[cityKey];
                  // Format the city name properly - capitalize each word
                  const displayName = city.name.split(' ')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ');
                  
                  return (
                    <option key={cityKey} value={cityKey}>
                      {displayName}
                    </option>
                  );
                })}
            </select>
          </div>
        )}
        
        {/* Saunas List - Only show if city is selected */}
        {selectedProvince && selectedCity && locationData[selectedProvince]?.cities[selectedCity] && (
          <div>
            <h3 className="text-lg font-semibold mb-4">
              Top Saunas in {locationData[selectedProvince].cities[selectedCity].name}
            </h3>
            
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            ) : (
              <div className="space-y-4">
                {saunas.length > 0 ? (
                  saunas.map((sauna) => (
                    <SaunaCard key={sauna._id} sauna={sauna} />
                  ))
                ) : (
                  <p>No saunas found in this location.</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default ProvinceSelector; 