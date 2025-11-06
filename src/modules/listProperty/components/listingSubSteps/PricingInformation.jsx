import { DollarSign, Calendar } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import useListPropertyStore from '../../store/useListPropertyStore';

export default function PricingInformation() {
  const { formData, updateFormData } = useListPropertyStore();

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2 text-orange-700 dark:text-orange-400">
        <DollarSign className="w-5 h-5" />
        Pricing Information
      </h3>
      
      {/* Listing Type */}
      <div className="space-y-2">
        <Label className="text-sm">
          Listing Type <span className="text-red-500">*</span>
        </Label>
        <div className="grid grid-cols-3 gap-2">
          {['sale', 'rent', 'lease'].map((type) => (
            <button
              key={type}
              onClick={() => updateFormData({ listingType: type })}
              className={`p-2 border rounded text-xs font-medium capitalize transition-all ${
                formData.listingType === type
                  ? 'border-orange-500 bg-orange-500/10 text-orange-700 dark:text-orange-400 scale-105'
                  : 'border-muted hover:border-orange-500/50 hover:scale-105'
              }`}
            >
              For {type}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Price */}
        <div className="space-y-1.5">
          <Label className="text-sm">
            {formData.listingType === 'sale' ? 'Asking Price' : 'Monthly Rent'}{' '}
            <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
              ₹
            </span>
            <Input
              type="number"
              min="0"
              placeholder={
                formData.listingType === 'sale' ? '50,00,000' : '25,000'
              }
              value={formData.price}
              onChange={(e) => updateFormData({ price: e.target.value })}
              className="h-9 pl-6 text-sm"
              required
            />
          </div>
        </div>

        {/* Price Unit */}
        <div className="space-y-1.5">
          <Label className="text-sm">Price Per</Label>
          <Select
            value={formData.priceUnit}
            onValueChange={(value) => updateFormData({ priceUnit: value })}
          >
            <SelectTrigger className="h-9 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="total">Total Price</SelectItem>
              <SelectItem value="per_sqft">Per Sq.ft</SelectItem>
              <SelectItem value="per_sqm">Per Sq.m</SelectItem>
              <SelectItem value="per_acre">Per Acre</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Maintenance Charges (for rent) */}
      {formData.listingType !== 'sale' && (
        <div className="space-y-1.5">
          <Label className="text-sm">
            Maintenance Charges (Monthly)
          </Label>
          <div className="relative">
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
              ₹
            </span>
            <Input
              type="number"
              min="0"
              placeholder="e.g., 2,000"
              value={formData.maintenanceCharges}
              onChange={(e) =>
                updateFormData({ maintenanceCharges: e.target.value })
              }
              className="h-9 pl-6 text-sm"
            />
          </div>
        </div>
      )}

      {/* Available From */}
      <div className="space-y-1.5">
        <Label htmlFor="availableFrom" className="text-sm flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-primary" />
          Available From
        </Label>
        <Input
          id="availableFrom"
          type="date"
          value={formData.availableFrom || ''}
          onChange={(e) => updateFormData({ availableFrom: e.target.value })}
          className="h-9 text-sm"
        />
      </div>
    </div>
  );
}
