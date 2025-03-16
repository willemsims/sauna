import Image from 'next/image';

const SaunaCard = ({ sauna }) => {
  return (
    <div className="border overflow-hidden hover:shadow-md transition-shadow">
      {/* Sauna Image */}
      <div className="relative h-48 w-full">
        <Image
          src={sauna.photoUrl || '/images/placeholder-sauna.jpg'}
          alt={sauna.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      
      {/* Sauna Details */}
      <div className="p-4">
        <h4 className="font-semibold text-lg">{sauna.name}</h4>
        
        {/* Rating */}
        <div className="flex items-center mt-1 mb-2">
          <span className="text-yellow-500 font-medium">★ {sauna.rating.toFixed(1)}</span>
          <span className="text-sm text-gray-500 ml-1">({sauna.reviewCount} reviews)</span>
        </div>
        
        {/* Type */}
        <p className="text-sm mb-2">{sauna.type} Sauna</p>
        
        {/* Description */}
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{sauna.description}</p>
        
        {/* Contact Info */}
        <div className="text-sm text-gray-700 mb-1">{sauna.address}</div>
        <div className="text-sm text-gray-700 mb-2">{sauna.phone}</div>
        
        {/* Website Link */}
        {sauna.website && (
          <a 
            href={sauna.website} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline text-sm inline-block mt-1"
          >
            Visit Website
          </a>
        )}
      </div>
    </div>
  );
};

export default SaunaCard;
