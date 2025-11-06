import { Sparkles } from 'lucide-react';

/**
 * ProTip component - Displays helpful tips and suggestions to users
 * @param {Object} props
 * @param {string} props.title - The title of the tip
 * @param {string[]} props.tips - Array of tip strings
 * @param {React.ReactNode} props.icon - Optional custom icon (defaults to Sparkles)
 */
export default function ProTip({ title, tips, icon: Icon = Sparkles }) {
  return (
    <div className="bg-gradient-to-r from-orange-50 to-orange-100/50 dark:from-orange-950/30 dark:to-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
      <div className="flex gap-3">
        <div className="flex-shrink-0">
          <Icon className="w-6 h-6 text-orange-600 dark:text-orange-400" />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-orange-900 dark:text-orange-100 text-base mb-2">
            {title}
          </h4>
          <ul className="space-y-1 text-sm text-orange-800 dark:text-orange-200">
            {tips.map((tip, index) => (
              <li key={index}>• {tip}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
