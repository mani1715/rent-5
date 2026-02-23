import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, Home, Building2, Mountain, Shield, Star, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { HeroSearch } from '@/components/HeroSearch';
import { mockListings } from '@/data/mockListings';
import { ListingCard } from '@/components/ListingCard';
import { useAuth } from '@/contexts/AuthContext';

export default function LandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const propertyTypes = [
    {
      icon: Home,
      title: 'Rooms',
      description: 'Perfect for students and professionals',
      type: 'room'
    },
    {
      icon: Building2,
      title: 'Houses',
      description: 'Ideal for families and long-term stays',
      type: 'house'
    },
    {
      icon: Mountain,
      title: 'Lodges',
      description: 'Great for vacations and getaways',
      type: 'lodge'
    }
  ];

  const featuredListings = mockListings.filter(listing => listing.featured).slice(0, 3);

  const stats = [
    { value: '15+', label: 'Properties Listed' },
    { value: '100%', label: 'Verified Owners' },
    { value: '4.8', label: 'Average Rating' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-primary">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight" data-testid="landing-hero-title">
              RENTEASE: Connecting Owners and Tenants with Ease
            </h1>
            <p className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed" data-testid="landing-hero-subtitle">
              Discover rooms, houses, and lodges for short or long-term stays. Your next home is just a click away.
            </p>
          </div>
          
          <HeroSearch />

          <div className="mt-12 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-accent mb-2">{stat.value}</div>
                <div className="text-sm text-white/70">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-foreground">
            What are you looking for?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {propertyTypes.map((type) => {
              const Icon = type.icon;
              return (
                <Card
                  key={type.type}
                  className="hover:shadow-soft-lg transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-secondary/50 group"
                  onClick={() => {
                    if (!isAuthenticated) {
                      navigate('/login');
                      return;
                    }
                    navigate(`/listings?type=${type.type}`);
                  }}
                  data-testid={`property-type-card-${type.type}`}
                >
                  <CardContent className="p-8 text-center">
                    <div className="mb-4 inline-flex p-4 rounded-full bg-secondary/10 group-hover:bg-secondary/20 transition-colors">
                      <Icon className="h-12 w-12 text-secondary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-foreground group-hover:text-secondary transition-colors">
                      {type.title}
                    </h3>
                    <p className="text-muted-foreground">{type.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Listings Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-card">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
                Featured Properties
              </h2>
              <p className="text-muted-foreground mt-2">Hand-picked premium listings</p>
            </div>
            <Link to="/listings">
              <Button variant="outline" className="hidden sm:flex">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredListings.map(listing => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-foreground">
            How It Works
          </h2>
          <p className="text-muted-foreground mb-12 max-w-2xl mx-auto">
            Finding your perfect rental is easy with our simple three-step process
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 bg-accent/10">
                <Shield className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">
                Search & Discover
              </h3>
              <p className="text-muted-foreground">
                Browse verified properties that match your needs
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 bg-secondary/10">
                <Users className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">
                Connect & Visit
              </h3>
              <p className="text-muted-foreground">
                Contact owners and schedule property visits
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 bg-accent/10">
                <Star className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">
                Book & Move In
              </h3>
              <p className="text-muted-foreground">
                Secure your rental and move into your new space
              </p>
            </div>
          </div>
          <Link to="/how-it-works">
            <Button variant="outline">
              Learn More
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-card">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-foreground">
                Why Choose RENTEASE?
              </h2>
              <ul className="space-y-4">
                {[
                  'Wide variety of properties across multiple locations',
                  'Flexible rental durations - night, week, or month',
                  'Verified listings with detailed information',
                  'Easy-to-use search and filter options',
                  'Save your favorite properties for later',
                  'Direct contact with verified property owners',
                  'Transparent pricing with no hidden fees'
                ].map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full mr-3 flex items-center justify-center" style={{ backgroundColor: '#10B981' }}>
                      <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative h-96 bg-gray-200 rounded-2xl overflow-hidden shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=400&fit=crop"
                alt="Happy renters"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#2563EB' }}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Find Your Next Home?
          </h2>
          <p className="text-lg text-blue-100 mb-8">
            Join thousands of happy renters and landlords on RENTEASE
          </p>
          <Button
            size="lg"
            onClick={() => navigate('/listings')}
            className="text-lg px-8 py-6"
            style={{ backgroundColor: 'white', color: '#2563EB' }}
            data-testid="landing-cta-button"
          >
            Get Started Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
    </div>
  );
}
