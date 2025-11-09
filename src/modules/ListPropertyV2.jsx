import { useState } from 'react';
import { motion } from 'motion/react';
import { PlusCircle, ArrowLeft, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PropertyFormSheetV2 } from '@/modules/listProperty/v2';
import { Link } from 'react-router-dom';

export default function ListPropertyV2Page() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-background to-orange-50/30 dark:from-orange-950/20 dark:via-background dark:to-orange-900/10">
      {/* Decorative Background */}
      <div className="fixed top-20 right-10 w-72 h-72 bg-orange-400/10 rounded-full blur-3xl -z-10" />
      <div className="fixed bottom-20 left-10 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl -z-10" />

      <div className="container mx-auto px-4 py-12">
        {/* Back Link */}
        <Link to="/list-property">
          <Button variant="ghost" className="mb-6 hover:bg-orange-50 dark:hover:bg-orange-950/30">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to V1 (Card View)
          </Button>
        </Link>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 dark:bg-orange-950/50 border border-orange-200 dark:border-orange-800 mb-6">
            <Sparkles className="w-4 h-4 text-orange-600" />
            <span className="text-sm font-medium text-orange-700 dark:text-orange-300">
              New Multi-Step Experience
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 bg-clip-text text-transparent">
              List Your Property
            </span>
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Complete our enhanced step-by-step form to publish your listing
          </p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Button
              size="lg"
              onClick={() => setShowForm(true)}
              className="h-16 px-10 text-lg font-semibold bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-xl shadow-orange-500/30 hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              <PlusCircle className="w-6 h-6 mr-3" />
              Start Listing Property
              <svg
                className="w-5 h-5 ml-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Button>
          </motion.div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="max-w-5xl mx-auto"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <FeatureCard
              icon="🎯"
              title="Step-by-Step"
              description="Complete each section one at a time with clear guidance"
            />
            <FeatureCard
              icon="💾"
              title="Save & Continue"
              description="Progress is saved as you complete each step"
            />
            <FeatureCard
              icon="✅"
              title="Easy Review"
              description="Review all details before final submission"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FeatureCard
              icon="🔒"
              title="Progressive Unlocking"
              description="Steps unlock as you complete previous sections"
              large
            />
            <FeatureCard
              icon="📊"
              title="Visual Progress"
              description="Track your completion with a clear progress indicator"
              large
            />
          </div>
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-center mt-12"
        >
          <p className="text-sm text-muted-foreground">
            ⚡ Complete the form in just a few minutes • 🎨 Beautiful interface • 📱 Mobile friendly
          </p>
        </motion.div>
      </div>

      {/* V2 Multi-Step Form */}
      <PropertyFormSheetV2 open={showForm} onOpenChange={setShowForm} />
    </div>
  );
}

function FeatureCard({ icon, title, description, large = false }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -4 }}
      className={`p-6 rounded-xl border-2 border-muted bg-white dark:bg-gray-900 hover:border-orange-300 dark:hover:border-orange-700 hover:shadow-lg transition-all duration-300 ${
        large ? 'md:col-span-1' : ''
      }`}
    >
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-gray-100">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </motion.div>
  );
}
