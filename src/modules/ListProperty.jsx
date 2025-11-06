import { useState } from 'react';
import { motion } from 'motion/react';
import { Plus, Building2, TrendingUp, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import PropertyFormSheet from './listProperty/components/PropertyFormSheet';

export default function ListProperty() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const stats = [
    {
      icon: Building2,
      label: 'Active Listings',
      value: '12',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: TrendingUp,
      label: 'Total Views',
      value: '2.4K',
      color: 'from-orange-500 to-red-500',
    },
    {
      icon: Users,
      label: 'Interested Buyers',
      value: '48',
      color: 'from-green-500 to-emerald-500',
    },
  ];

  return (
    <div className="bg-background relative min-h-screen">
      {/* Orange Gradient Background */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-orange-50 via-background to-orange-50/30 dark:from-orange-950/20 dark:via-background dark:to-orange-900/10" />

      {/* Main Content */}
      <div className="relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="pt-8 pb-8"
        >
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-3">
                  <span className="bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 bg-clip-text text-transparent">
                    Property Listings
                  </span>
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl">
                  Manage your properties and reach thousands of potential buyers
                </p>
              </div>
              <Button
                size="lg"
                onClick={() => setIsSheetOpen(true)}
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg shadow-orange-500/30 h-14 px-8 text-base"
              >
                <Plus className="w-5 h-5 mr-2" />
                List New Property
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Stats Section */}
        <div className="container mx-auto px-4 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                >
                  <Card className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-14 h-14 rounded-xl bg-gradient-to-br ${stat.color} p-3 flex items-center justify-center`}
                      >
                        <Icon className="w-full h-full text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          {stat.label}
                        </p>
                        <p className="text-3xl font-bold">{stat.value}</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Empty State / Listings */}
        <div className="container mx-auto px-4 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Card className="p-12 text-center">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-950/50 dark:to-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Building2 className="w-12 h-12 text-orange-600 dark:text-orange-400" />
                </div>
                <h2 className="text-2xl font-bold mb-3">
                  Ready to list your property?
                </h2>
                <p className="text-muted-foreground mb-6">
                  Start by clicking the button above to create your first property listing.
                  Our intuitive form will guide you through each step.
                </p>
                <Button
                  size="lg"
                  onClick={() => setIsSheetOpen(true)}
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Get Started
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="fixed top-20 right-10 w-72 h-72 bg-orange-400/10 rounded-full blur-3xl -z-10" />
      <div className="fixed bottom-20 left-10 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl -z-10" />

      {/* Property Form Sheet */}
      <PropertyFormSheet open={isSheetOpen} onOpenChange={setIsSheetOpen} />
    </div>
  );
}
