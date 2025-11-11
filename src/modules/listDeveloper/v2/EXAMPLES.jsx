// Example usage of Developer Form V2

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DeveloperFormSheetV2 } from '@/modules/listDeveloper/v2';

// Example 1: Basic usage with button trigger
export function BasicExample() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <Button onClick={() => setIsOpen(true)}>
        Register as Developer
      </Button>
      
      <DeveloperFormSheetV2 
        open={isOpen} 
        onOpenChange={setIsOpen} 
      />
    </div>
  );
}

// Example 2: With custom trigger styling
export function StyledTriggerExample() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <Button 
        onClick={() => setIsOpen(true)}
        size="lg"
        className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg"
      >
        🏢 Register Your Company
      </Button>
      
      <DeveloperFormSheetV2 
        open={isOpen} 
        onOpenChange={setIsOpen} 
      />
    </div>
  );
}

// Example 3: Dashboard integration
export function DashboardExample() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeveloperRegistered, setIsDeveloperRegistered] = useState(false);

  const handleFormClose = (isOpen) => {
    setIsFormOpen(isOpen);
    
    // Check if developer was registered
    // In real app, you'd check from API or local storage
    if (!isOpen && isDeveloperRegistered) {
      // Refresh developer data or redirect
      console.log('Developer registered successfully!');
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Welcome to Partner Platform</h2>
          <p className="text-gray-600 mb-4">
            Register as a developer to start listing your projects and connecting with potential buyers.
          </p>
          
          <div className="flex gap-4">
            <Button 
              onClick={() => setIsFormOpen(true)}
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-blue-600"
            >
              Get Started
            </Button>
            
            <Button 
              variant="outline"
              size="lg"
            >
              Learn More
            </Button>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">📊 Portfolio Showcase</h3>
            <p className="text-sm text-gray-600">
              Display your completed and ongoing projects
            </p>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">🤝 Direct Connections</h3>
            <p className="text-sm text-gray-600">
              Connect directly with interested buyers
            </p>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">✅ Verified Profile</h3>
            <p className="text-sm text-gray-600">
              Get RERA verified developer badge
            </p>
          </div>
        </div>
      </div>
      
      <DeveloperFormSheetV2 
        open={isFormOpen} 
        onOpenChange={handleFormClose} 
      />
    </div>
  );
}

// Example 4: Using context outside of sheet
import { useDeveloperFormV2 } from '@/modules/listDeveloper/v2';

function CustomStepIndicator() {
  const { currentStep, getTotalSteps, getProgress } = useDeveloperFormV2();

  return (
    <div className="mb-4 p-4 bg-gray-50 rounded-lg">
      <div className="flex justify-between mb-2">
        <span className="text-sm font-medium">
          Step {currentStep + 1} of {getTotalSteps()}
        </span>
        <span className="text-sm text-gray-600">
          {getProgress()}% Complete
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${getProgress()}%` }}
        />
      </div>
    </div>
  );
}

// Example 5: Header navigation integration
export function HeaderExample() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Logo" className="h-8" />
          <span className="font-bold text-xl">Partner Platform</span>
        </div>
        
        <nav className="flex items-center gap-4">
          <a href="/properties" className="text-gray-600 hover:text-gray-900">
            Properties
          </a>
          <a href="/developers" className="text-gray-600 hover:text-gray-900">
            Developers
          </a>
          <Button 
            variant="outline"
            onClick={() => setIsFormOpen(true)}
          >
            Register as Developer
          </Button>
        </nav>
      </div>
      
      <DeveloperFormSheetV2 
        open={isFormOpen} 
        onOpenChange={setIsFormOpen} 
      />
    </header>
  );
}

// Example 6: Profile completion widget
export function ProfileCompletionWidget() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
      <h3 className="text-xl font-bold mb-2">Complete Your Profile</h3>
      <p className="text-blue-100 mb-4">
        Register as a developer to unlock premium features
      </p>
      
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-white/30" />
          <span className="text-sm">Showcase your projects</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-white/30" />
          <span className="text-sm">Get verified developer badge</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-white/30" />
          <span className="text-sm">Access analytics dashboard</span>
        </div>
      </div>
      
      <Button 
        onClick={() => setIsFormOpen(true)}
        className="w-full bg-white text-blue-600 hover:bg-blue-50"
      >
        Start Registration
      </Button>
      
      <DeveloperFormSheetV2 
        open={isFormOpen} 
        onOpenChange={setIsFormOpen} 
      />
    </div>
  );
}

// Export all examples
export default {
  BasicExample,
  StyledTriggerExample,
  DashboardExample,
  HeaderExample,
  ProfileCompletionWidget,
};
