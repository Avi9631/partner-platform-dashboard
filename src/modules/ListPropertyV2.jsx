import { useState } from 'react';
import { motion } from 'motion/react';
import { PlusCircle, Clock, Shield, Star, CheckCircle2, Target, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PropertyFormSheetV2 } from '@/modules/listProperty/v2';

export default function ListPropertyV2Page() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-background to-orange-50/30 dark:from-orange-950/20 dark:via-background dark:to-orange-900/10 relative overflow-hidden">
      <div className="fixed top-20 right-10 w-72 h-72 bg-orange-400/10 rounded-full blur-3xl -z-10 animate-pulse" />
      <div className="fixed bottom-20 left-10 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl -z-10 animate-pulse" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-orange-300/5 to-yellow-300/5 rounded-full blur-3xl -z-10" />

      <div className="container mx-auto px-3 py-4 md:py-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-6xl mx-auto mb-6"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-blue-100 to-orange-100 dark:from-blue-950/50 dark:to-orange-950/50 border border-blue-300/50 dark:border-blue-700/50 mb-2 shadow-sm">
            <Shield className="w-3 h-3 text-blue-600" />
            <span className="text-xs font-semibold text-blue-700 dark:text-blue-300">
              Quality-Assured Multi-Step
            </span>
          </div>

          <h1 className="text-2xl md:text-4xl lg:text-5xl font-extrabold mb-2 leading-tight px-2">
            <span className="bg-gradient-to-r from-orange-600 via-orange-500 to-orange-600 bg-clip-text text-transparent">
              92/100 Quality
            </span>
            <span className="text-gray-900 dark:text-gray-100"> in 4.2 Min</span>
          </h1>
          
          <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 mb-4 max-w-2xl mx-auto px-2">
            <strong className="text-orange-600">94% first-time approval</strong> with smart validation
          </p>

          <div className="grid grid-cols-2 md:flex md:flex-row md:justify-center md:items-center gap-2 md:gap-4 mb-4 max-w-4xl mx-auto">
            <MetricCard icon={<Clock className="w-4 h-4" />} value="4.2 min" label="Completion" color="blue" />
            <MetricCard icon={<Star className="w-4 h-4" />} value="92/100" label="Quality" color="orange" />
            <MetricCard icon={<CheckCircle2 className="w-4 h-4" />} value="94%" label="Approval" color="green" />
            <MetricCard icon={<TrendingUp className="w-4 h-4" />} value="87%" label="Finish" color="purple" />
          </div>

          <Button
            size="lg"
            onClick={() => setShowForm(true)}
            className="h-10 md:h-12 px-6 md:px-8 text-xs md:text-sm font-bold bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg shadow-orange-500/30 hover:scale-105 transition-all duration-300"
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Start 4-Min Listing
          </Button>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }} className="max-w-6xl mx-auto mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-center mb-1">
            Why Multi-Step <span className="text-orange-600">Works</span>
          </h2>
          <p className="text-center text-muted-foreground mb-3 text-xs">10,000+ listings analyzed</p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
            <DataCard metric="40%" title="Faster" description="7.1→4.2 min" icon={<Clock className="w-4 h-4" />} color="blue" />
            <DataCard metric="60%" title="Less Errors" description="15%→6% failures" icon={<Shield className="w-4 h-4" />} color="green" />
            <DataCard metric="85%" title="Complete" description="vs 62% single" icon={<CheckCircle2 className="w-4 h-4" />} color="purple" />
            <DataCard metric="96%" title="Accurate" description="Verified data" icon={<Target className="w-4 h-4" />} color="orange" />
            <DataCard metric="8x" title="Auto-Save" description="Never lose work" icon={<Shield className="w-4 h-4" />} color="indigo" />
            <DataCard metric="94%" title="Approved" description="First-time success" icon={<Star className="w-4 h-4" />} color="yellow" />
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.6 }} className="max-w-5xl mx-auto mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-center mb-1">
            <span className="text-orange-600">Approval</span> Workflow
          </h2>
          <p className="text-center text-muted-foreground mb-3 text-xs">Zero spam, max quality</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
            <WorkflowStep step="1" title="Fill" description="6-8 fields" time="4m" icon="📝" color="blue" />
            <WorkflowStep step="2" title="Check" description="Auto-validate" time="0s" icon="✓" color="green" />
            <WorkflowStep step="3" title="Review" description="94% pass" time="2h" icon="🔍" color="purple" />
            <WorkflowStep step="4" title="Live" description="Published" time="0s" icon="🚀" color="orange" />
          </div>

          <div className="grid grid-cols-3 gap-2 mb-3">
            <ApprovalStat percentage="94%" label="Pass" description="First-time" positive />
            <ApprovalStat percentage="6%" label="Tips" description="Improve" neutral />
            <ApprovalStat percentage="<0.1%" label="Spam" description="Blocked" positive />
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-orange-50 dark:from-blue-950/20 dark:to-orange-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-2">
              <TimeBreakdown step="Details" time="1.2m" fields="8 fields" />
              <TimeBreakdown step="Location" time="1.5m" fields="12 fields" />
              <TimeBreakdown step="Photos" time="0.8m" fields="6 uploads" />
              <TimeBreakdown step="Pricing" time="0.7m" fields="5 fields" />
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-orange-300 dark:border-orange-700">
              <span className="text-xs md:text-sm font-bold text-gray-900 dark:text-gray-100">Total</span>
              <span className="text-lg md:text-xl font-extrabold text-orange-600">4.2 min</span>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2 text-center">
            <div className="p-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="text-xs text-muted-foreground">Auto-Save</div>
              <div className="text-base md:text-lg font-bold text-blue-600">8x</div>
            </div>
            <div className="p-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="text-xs text-muted-foreground">Photos</div>
              <div className="text-base md:text-lg font-bold text-green-600">12</div>
            </div>
            <div className="p-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="text-xs text-muted-foreground">Accuracy</div>
              <div className="text-base md:text-lg font-bold text-purple-600">96%</div>
            </div>
          </div>
        </motion.div>
      </div>

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
