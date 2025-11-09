/**
 * Example Usage of PropertyFormSheetV2
 * 
 * This file demonstrates how to integrate the V2 multi-step property form
 * into your application.
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PropertyFormSheetV2 } from '@/modules/listProperty/v2';
import { PlusCircle } from 'lucide-react';

/**
 * Basic Example - Simple Integration
 */
export function BasicExample() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">List Your Property</h2>
      <p className="text-muted-foreground mb-6">
        Click the button below to start listing your property with our new multi-step form.
      </p>
      
      <Button 
        onClick={() => setIsOpen(true)}
        className="bg-gradient-to-r from-orange-500 to-orange-600"
      >
        <PlusCircle className="w-5 h-5 mr-2" />
        List Property
      </Button>

      <PropertyFormSheetV2 
        open={isOpen} 
        onOpenChange={setIsOpen} 
      />
    </div>
  );
}

/**
 * Advanced Example - With Callbacks and Event Tracking
 */
export function AdvancedExample() {
  const [isOpen, setIsOpen] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  const handleOpenChange = (open) => {
    setIsOpen(open);
    
    // Track analytics when form is opened/closed
    if (open) {
      console.log('📊 Property form opened');
      // Analytics: trackEvent('property_form_opened');
    } else {
      console.log('📊 Property form closed');
      // Analytics: trackEvent('property_form_closed');
    }
  };

  const handleFormSubmit = (data) => {
    console.log('✅ Form submitted with data:', data);
    setSubmittedData(data);
    setIsOpen(false);
    
    // Process the form data
    // API call, state updates, etc.
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Property Listings Dashboard</h2>
        <p className="text-muted-foreground">
          Manage your property listings
        </p>
      </div>

      <div className="flex gap-4 mb-6">
        <Button 
          onClick={() => setIsOpen(true)}
          size="lg"
          className="bg-gradient-to-r from-orange-500 to-orange-600"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          Add New Property
        </Button>
      </div>

      {submittedData && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="font-semibold text-green-900 mb-2">
            ✅ Property Listed Successfully!
          </h3>
          <p className="text-sm text-green-700">
            Property Type: {submittedData.propertyType}
          </p>
        </div>
      )}

      <PropertyFormSheetV2 
        open={isOpen} 
        onOpenChange={handleOpenChange}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
}

/**
 * Integration Example - In a Page Component
 */
export default function PropertyListingsPage() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Properties</h1>
          <p className="text-muted-foreground mt-2">
            Manage and list your properties
          </p>
        </div>
        
        <Button 
          onClick={() => setShowForm(true)}
          size="lg"
          className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          List New Property
        </Button>
      </div>

      {/* Your existing property list/grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Property cards */}
      </div>

      {/* The V2 Multi-Step Form */}
      <PropertyFormSheetV2 
        open={showForm} 
        onOpenChange={setShowForm} 
      />
    </div>
  );
}

/**
 * Testing Example - Programmatic Control
 */
export function TestingExample() {
  const [isOpen, setIsOpen] = useState(false);

  // Pre-fill form for testing
  const openWithTestData = () => {
    setIsOpen(true);
    
    // You can prefill data using the context or form defaults
    console.log('Opening form with test data');
  };

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold">Testing & Development</h2>
      
      <div className="flex gap-4">
        <Button onClick={() => setIsOpen(true)}>
          Open Form (Empty)
        </Button>
        
        <Button onClick={openWithTestData} variant="outline">
          Open Form (Test Data)
        </Button>
      </div>

      <PropertyFormSheetV2 
        open={isOpen} 
        onOpenChange={setIsOpen} 
      />
    </div>
  );
}

/**
 * Custom Trigger Example - Different UI Element
 */
export function CustomTriggerExample() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to Property Portal</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Start listing your property in just a few steps
        </p>
        
        <button
          onClick={() => setIsOpen(true)}
          className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          <PlusCircle className="w-6 h-6" />
          <span>List Your Property</span>
          <svg 
            className="w-5 h-5 group-hover:translate-x-1 transition-transform" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
      </div>

      <PropertyFormSheetV2 
        open={isOpen} 
        onOpenChange={setIsOpen} 
      />
    </div>
  );
}
