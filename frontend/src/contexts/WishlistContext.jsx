import React, { createContext, useState, useContext, useEffect } from 'react';
import { wishlistAPI } from '@/services/wishlistService';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Fetch wishlist on mount if user is customer
  useEffect(() => {
    if (user && user.role === 'CUSTOMER') {
      fetchWishlist();
    } else {
      setWishlist([]);
    }
  }, [user]);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const response = await wishlistAPI.getWishlist();
      if (response.success) {
        setWishlist(response.data);
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (propertyId) => {
    try {
      const response = await wishlistAPI.addToWishlist(propertyId);
      if (response.success) {
        await fetchWishlist(); // Refresh wishlist
        toast.success('Added to wishlist');
        return true;
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      const message = error.response?.data?.message || 'Failed to add to wishlist';
      toast.error(message);
      return false;
    }
  };

  const removeFromWishlist = async (propertyId) => {
    try {
      const response = await wishlistAPI.removeFromWishlist(propertyId);
      if (response.success) {
        await fetchWishlist(); // Refresh wishlist
        toast.success('Removed from wishlist');
        return true;
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      const message = error.response?.data?.message || 'Failed to remove from wishlist';
      toast.error(message);
      return false;
    }
  };

  const isInWishlist = (propertyId) => {
    return wishlist.some(item => 
      item.property?._id === propertyId || 
      item.property === propertyId
    );
  };

  const toggleWishlist = async (propertyId) => {
    if (isInWishlist(propertyId)) {
      return await removeFromWishlist(propertyId);
    } else {
      return await addToWishlist(propertyId);
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        loading,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        toggleWishlist,
        refreshWishlist: fetchWishlist
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within WishlistProvider');
  }
  return context;
};
