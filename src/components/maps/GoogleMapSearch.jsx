import { useEffect, useRef } from 'react';
import { Search, MapPin, Loader2, X, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useGoogleMapSearch } from '@/hooks/useGoogleMapSearch';
import { SEARCH_CONFIG } from '@/lib/constants/maps';
import { cn } from '@/lib/utils';

/**
 * GoogleMapSearch Component
 * Provides autocomplete search functionality using Google Places API
 */
export default function GoogleMapSearch({ 
  onPlaceSelect, 
  placeholder = "Search for location...",
  className = "",
  initialValue = ""
}) {
  const searchRef = useRef(null);
  const [state, handlers] = useGoogleMapSearch({ onPlaceSelect, initialValue });
  
  const {
    searchQuery,
    suggestions,
    isLoading,
    showSuggestions,
    selectedIndex,
    error,
  } = state;

  const {
    handleSearchChange,
    handlePlaceSelect,
    handleKeyDown,
    handleClear,
    setShowSuggestions,
  } = handlers;

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setShowSuggestions]);

  return (
    <div ref={searchRef} className={cn("relative w-full", className)}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        
        <Input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          onKeyDown={handleKeyDown}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          placeholder={placeholder}
          className="pl-10 pr-10 h-11 text-sm border-2 focus:border-orange-500 transition-all"
        />

        {/* Loading Spinner or Clear Button */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-orange-500" />
          ) : searchQuery ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 hover:bg-transparent"
              onClick={handleClear}
            >
              <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
            </Button>
          ) : null}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="absolute z-50 w-full mt-2 bg-destructive/10 border-2 border-destructive/50 rounded-lg shadow-lg p-3">
          <div className="flex items-center gap-2 text-sm text-destructive">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && !error && (
        <div className="absolute z-50 w-full mt-2 bg-background border-2 border-muted rounded-lg shadow-lg max-h-80 overflow-y-auto">
          <div className="p-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={suggestion.place_id || index}
                type="button"
                onClick={() => handlePlaceSelect(suggestion)}
                className={cn(
                  "w-full text-left px-3 py-3 rounded-md transition-colors flex items-start gap-3 hover:bg-orange-50 dark:hover:bg-orange-950/30",
                  selectedIndex === index && "bg-orange-50 dark:bg-orange-950/30"
                )}
              >
                <MapPin className="w-4 h-4 mt-0.5 text-orange-500 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground line-clamp-1">
                    {suggestion.structured_formatting?.main_text || suggestion.description}
                  </p>
                  {suggestion.structured_formatting?.secondary_text && (
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                      {suggestion.structured_formatting.secondary_text}
                    </p>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* No Results Message */}
      {showSuggestions && !isLoading && !error && searchQuery.length >= SEARCH_CONFIG.MIN_QUERY_LENGTH && suggestions.length === 0 && (
        <div className="absolute z-50 w-full mt-2 bg-background border-2 border-muted rounded-lg shadow-lg p-4">
          <p className="text-sm text-muted-foreground text-center">
            No locations found for &quot;{searchQuery}&quot;
          </p>
        </div>
      )}
    </div>
  );
}
