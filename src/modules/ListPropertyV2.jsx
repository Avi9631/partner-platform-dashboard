import { useState } from 'react';
import { motion } from 'motion/react';
import { PlusCircle, Clock, Shield, Star, CheckCircle2, Target, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PropertyFormSheetV2 } from '@/modules/listProperty/v2';

export default function ListPropertyV2Page() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="p-6">
         <Button
            size="lg"
            onClick={() => setShowForm(true)}
            className="h-10 md:h-12 px-6 md:px-8 text-xs md:text-sm font-bold bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg shadow-orange-500/30 hover:scale-105 transition-all duration-300"
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            List New Property
          </Button>


      <PropertyFormSheetV2 open={showForm} onOpenChange={setShowForm} />
    </div>
  );
}

function MetricCard({ icon, value, label, color }) {
  const colorClasses = {
    blue: 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400',
    orange: 'border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400',
    green: 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400',
    purple: 'border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400',
  };
  return (
    <motion.div whileHover={{ scale: 1.03 }} className={`flex flex-col items-center p-2 md:p-3 rounded-lg md:rounded-xl border-2 shadow-sm transition-all ${colorClasses[color]}`}>
      <div className="mb-1">{icon}</div>
      <div className="text-lg md:text-xl font-extrabold text-gray-900 dark:text-white text-center mb-0.5">{value}</div>
      <div className="text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 text-center">{label}</div>
    </motion.div>
  );
}

function DataCard({ metric, title, description, icon, color }) {
  const colorClasses = { blue: 'from-blue-500 to-blue-600', green: 'from-green-500 to-green-600', purple: 'from-purple-500 to-purple-600', orange: 'from-orange-500 to-orange-600', indigo: 'from-indigo-500 to-indigo-600', yellow: 'from-yellow-500 to-yellow-600' };
  return (
    <motion.div whileHover={{ scale: 1.02 }} className="relative p-2.5 md:p-3 rounded-lg md:rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-orange-300 dark:hover:border-orange-600 hover:shadow-md transition-all duration-300">
      <div className={`inline-flex items-center justify-center p-1.5 rounded-md bg-gradient-to-br ${colorClasses[color]} text-white mb-1 shadow-sm`}>{icon}</div>
      <div className="text-xl md:text-2xl font-extrabold text-orange-600 mb-0.5">{metric}</div>
      <h3 className="text-xs md:text-sm font-bold mb-0.5 text-gray-900 dark:text-gray-100">{title}</h3>
      <p className="text-xs text-muted-foreground leading-tight">{description}</p>
    </motion.div>
  );
}

function WorkflowStep({ step, title, description, time, icon, color }) {
  const colorClasses = { blue: 'from-blue-500 to-blue-600', green: 'from-green-500 to-green-600', purple: 'from-purple-500 to-purple-600', orange: 'from-orange-500 to-orange-600' };
  return (
    <motion.div whileHover={{ y: -1 }} className="relative text-center">
      <div className="flex flex-col items-center">
        <div className={`w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br ${colorClasses[color]} rounded-full flex items-center justify-center text-white text-base md:text-lg font-bold shadow-md mb-1`}>{step}</div>
        <div className="text-xl md:text-2xl mb-0.5">{icon}</div>
        <h3 className="text-xs md:text-sm font-bold mb-0.5 text-gray-900 dark:text-gray-100">{title}</h3>
        <p className="text-xs text-muted-foreground mb-0.5 leading-tight">{description}</p>
        <div className="inline-block px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-xs font-medium text-gray-600 dark:text-gray-400">{time}</div>
      </div>
      {step !== "4" && <div className="hidden md:block absolute top-5 md:top-6 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-orange-400 to-transparent" />}
    </motion.div>
  );
}

function ApprovalStat({ percentage, label, description, positive, neutral }) {
  const bgColor = positive ? 'bg-green-50 dark:bg-green-950/20 border-green-300 dark:border-green-700' : neutral ? 'bg-blue-50 dark:bg-blue-950/20 border-blue-300 dark:border-blue-700' : 'bg-red-50 dark:bg-red-950/20 border-red-300 dark:border-red-700';
  const textColor = positive ? 'text-green-600 dark:text-green-400' : neutral ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400';
  return (
    <div className={`p-2 md:p-3 rounded-lg border ${bgColor} text-center`}>
      <div className={`text-2xl md:text-3xl font-extrabold ${textColor} mb-0.5`}>{percentage}</div>
      <div className="text-xs md:text-sm font-bold text-gray-900 dark:text-gray-100 mb-0.5">{label}</div>
      <div className="text-xs text-muted-foreground leading-tight">{description}</div>
    </div>
  );
}

function TimeBreakdown({ step, time, fields }) {
  return (
    <div className="flex flex-col p-1.5 md:p-2 bg-white dark:bg-gray-800 rounded-md md:rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="text-xs md:text-sm font-semibold text-gray-900 dark:text-gray-100 mb-0.5 leading-tight">{step}</div>
      <div className="text-xs text-muted-foreground mb-0.5">{fields}</div>
      <div className="text-base md:text-lg font-bold text-orange-600">{time}</div>
    </div>
  );
}
