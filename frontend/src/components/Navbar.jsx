import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Search, Heart, Home, Menu, X, User, LogOut, LayoutDashboard, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';

export const Navbar = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isOwner, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/listings?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setMobileMenuOpen(false);
    }
  };

  return (
    <nav className="bg-primary border-b border-primary/10 sticky top-0 z-50 shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2 group" data-testid="navbar-logo">
            <Home className="h-8 w-8 text-accent transition-transform group-hover:scale-110" />
            <span className="text-xl font-bold text-white">RENTEASE</span>
          </Link>

          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Input
                type="text"
                placeholder="Search by location or property type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
                data-testid="navbar-search-input"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2"
                data-testid="navbar-search-button"
              >
                <Search className="h-5 w-5 text-gray-400" />
              </button>
            </div>
          </form>

          <div className="hidden md:flex items-center space-x-4">
            <Link to="/listings" data-testid="navbar-listings-link">
              <Button variant="ghost" className="text-white hover:bg-white/10 hover:text-white">
                Browse
              </Button>
            </Link>
            
            {isAuthenticated && (
              <>
                <Link to="/favorites" data-testid="navbar-favorites-link">
                  <Button variant="ghost" className="text-white hover:bg-white/10 hover:text-white">
                    <Heart className="h-5 w-5 mr-2" />
                    Favorites
                  </Button>
                </Link>
                {user?.role === 'CUSTOMER' && (
                  <Link to="/wishlist" data-testid="navbar-wishlist-link">
                    <Button variant="ghost" className="text-white hover:bg-white/10 hover:text-white">
                      <Heart className="h-5 w-5 mr-2 fill-red-500 text-red-500" />
                      Wishlist
                    </Button>
                  </Link>
                )}
              </>
            )}

            {isOwner && (
              <>
                <Link to="/owner/dashboard" data-testid="navbar-dashboard-link">
                  <Button variant="ghost" className="text-white hover:bg-white/10 hover:text-white">
                    <LayoutDashboard className="h-5 w-5 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                <Link to="/owner/inbox" data-testid="navbar-inbox-link">
                  <Button variant="ghost" className="text-white hover:bg-white/10 hover:text-white">
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Messages
                  </Button>
                </Link>
                <Link to="/owner/add-listing" data-testid="navbar-add-listing-link">
                  <Button className="bg-accent hover:bg-accent/90 text-white font-semibold rounded-xl shadow-soft">
                    List Property
                  </Button>
                </Link>
              </>
            )}

            {!isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="ghost" className="text-white hover:bg-white/10 hover:text-white">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="bg-secondary hover:bg-secondary/90 text-white font-semibold rounded-xl shadow-soft">
                    Sign Up
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-xl hover:bg-white/10 text-white transition-colors"
                >
                  <User className="h-5 w-5" />
                  <span className="text-sm font-medium">{user?.name}</span>
                </button>
                
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-card rounded-xl shadow-soft-lg py-1 z-50 border border-border">
                    <div className="px-4 py-3 border-b border-border">
                      <p className="text-sm font-semibold text-foreground">{user?.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{user?.email}</p>
                      <p className="text-xs text-accent font-medium mt-1.5">{user?.role}</p>
                    </div>
                    {isOwner && (
                      <>
                        <Link
                          to="/owner/dashboard"
                          className="block px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          Dashboard
                        </Link>
                        <Link
                          to="/owner/inbox"
                          className="block px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <MessageCircle className="h-4 w-4 inline mr-2" />
                          Messages
                        </Link>
                      </>
                    )}
                    <button
                      onClick={() => {
                        logout();
                        setUserMenuOpen(false);
                        navigate('/');
                      }}
                      className="block w-full text-left px-4 py-2.5 text-sm text-destructive hover:bg-muted transition-colors"
                    >
                      <LogOut className="h-4 w-4 inline mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <button
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="navbar-mobile-menu-button"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-4 border-t border-white/10" data-testid="navbar-mobile-menu">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10 bg-white/10 border-white/20 text-white placeholder:text-white/60"
                  data-testid="navbar-mobile-search-input"
                />
                <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2">
                  <Search className="h-5 w-5 text-white/60" />
                </button>
              </div>
            </form>
            <Link to="/listings" onClick={() => setMobileMenuOpen(false)} className="block">
              <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/10" data-testid="navbar-mobile-listings-link">
                Browse
              </Button>
            </Link>
            {isAuthenticated && (
              <>
                <Link to="/favorites" onClick={() => setMobileMenuOpen(false)} className="block">
                  <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/10" data-testid="navbar-mobile-favorites-link">
                    <Heart className="h-5 w-5 mr-2" />
                    Favorites
                  </Button>
                </Link>
                {user?.role === 'CUSTOMER' && (
                  <Link to="/wishlist" onClick={() => setMobileMenuOpen(false)} className="block">
                    <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/10" data-testid="navbar-mobile-wishlist-link">
                      <Heart className="h-5 w-5 mr-2 fill-red-500 text-red-500" />
                      Wishlist
                    </Button>
                  </Link>
                )}
              </>
            )}
            {isOwner && (
              <>
                <Link to="/owner/dashboard" onClick={() => setMobileMenuOpen(false)} className="block">
                  <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/10">
                    <LayoutDashboard className="h-5 w-5 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                <Link to="/owner/inbox" onClick={() => setMobileMenuOpen(false)} className="block">
                  <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/10">
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Messages
                  </Button>
                </Link>
                <Link to="/owner/add-listing" onClick={() => setMobileMenuOpen(false)} className="block">
                  <Button className="w-full bg-accent hover:bg-accent/90 text-white font-semibold rounded-xl" data-testid="navbar-mobile-add-listing-link">
                    List Property
                  </Button>
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};
