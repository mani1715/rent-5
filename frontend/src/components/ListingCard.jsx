import { Link } from 'react-router-dom';
import { Heart, MapPin, Bed, Bath, Maximize } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useWishlist } from '@/contexts/WishlistContext';
import { useAuth } from '@/contexts/AuthContext';

export const ListingCard = ({ listing }) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { user } = useAuth();
  
  const isWishlisted = isInWishlist(listing._id || listing.id);
  const isCustomer = user?.role === 'CUSTOMER';

  const handleToggleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isCustomer) return;
    
    await toggleWishlist(listing._id || listing.id);
  };

  const formatPrice = () => {
    const price = listing.price || listing.monthlyPrice || 0;
    const formattedPrice = price.toLocaleString('en-IN');
    const duration = listing.priceType === 'daily' ? 'day' : 'month';
    return `₹ ${formattedPrice} / ${duration}`;
  };

  const getTypeColor = () => {
    switch (listing.type) {
      case 'room':
        return 'hsl(230, 45%, 55%)';
      case 'house':
        return 'hsl(168, 65%, 50%)';
      case 'lodge':
        return 'hsl(215, 25%, 27%)';
      case 'apartment':
        return 'hsl(230, 45%, 55%)';
      case 'villa':
        return 'hsl(168, 65%, 50%)';
      case 'cottage':
        return 'hsl(215, 25%, 27%)';
      default:
        return 'hsl(230, 45%, 55%)';
    }
  };

  const propertyImage = listing.images?.[0] || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2';
  const propertyLocation = listing.addressText || listing.location || 'Location not specified';

  return (
    <Link to={`/listing/${listing._id || listing.id}`} data-testid={`listing-card-${listing._id || listing.id}`}>
      <Card className="overflow-hidden hover:shadow-soft-lg transition-all duration-300 h-full group">
        <div className="relative">
          <img
            src={propertyImage}
            alt={listing.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {isCustomer && (
            <button
              onClick={handleToggleWishlist}
              className="absolute top-3 right-3 bg-white rounded-full p-2.5 shadow-soft hover:shadow-soft-md hover:scale-110 transition-all"
              data-testid={`wishlist-button-${listing._id || listing.id}`}
            >
              <Heart
                className={`h-5 w-5 transition-colors ${
                  isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'
                }`}
              />
            </button>
          )}
          <Badge
            className="absolute top-3 left-3 font-semibold rounded-lg shadow-soft"
            style={{ backgroundColor: getTypeColor(), color: 'white' }}
            data-testid={`listing-type-badge-${listing._id || listing.id}`}
          >
            {listing.type.toUpperCase()}
          </Badge>
        </div>

        <CardContent className="p-5">
          <h3 className="font-semibold text-lg mb-2 text-foreground group-hover:text-secondary transition-colors" data-testid={`listing-title-${listing._id || listing.id}`}>
            {listing.title}
          </h3>

          <div className="flex items-center text-sm text-muted-foreground mb-3">
            <MapPin className="h-4 w-4 mr-1.5 text-accent" />
            <span data-testid={`listing-location-${listing._id || listing.id}`}>{propertyLocation}</span>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <div className="flex items-center">
              <Bed className="h-4 w-4 mr-1.5" />
              <span>{listing.bedrooms || 1} bed</span>
            </div>
            <div className="flex items-center">
              <Bath className="h-4 w-4 mr-1.5" />
              <span>{listing.bathrooms || 1} bath</span>
            </div>
            <div className="flex items-center">
              <Maximize className="h-4 w-4 mr-1.5" />
              <span>{listing.squareFeet || listing.size || 0} sqft</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-border">
            <span className="text-2xl font-bold text-secondary" data-testid={`listing-price-${listing._id || listing.id}`}>
              {formatPrice()}
            </span>
            <Button
              size="sm"
              className="bg-accent hover:bg-accent/90 text-white font-semibold"
              onClick={(e) => e.preventDefault()}
              data-testid={`view-details-button-${listing._id || listing.id}`}
            >
              View Details
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
