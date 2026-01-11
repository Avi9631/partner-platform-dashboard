import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import {
  Link as LinkIcon,
  Copy,
  Check,
  Download,
  Share2,
  QrCode,
  ExternalLink,
  Globe,
  Smartphone,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import QRCode from 'qrcode';

export default function PropertyLinks({ draftId, property }) {
  const [copied, setCopied] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [selectedColor, setSelectedColor] = useState('#ea580c'); // orange-600
  const qrCanvasRef = useRef(null);

  const propertyUrl = `${window.location.origin}/property/${draftId}`;

  useEffect(() => {
    generateQRCode();
  }, [propertyUrl, selectedColor]);

  const generateQRCode = async () => {
    try {
      const url = await QRCode.toDataURL(propertyUrl, {
        width: 300,
        margin: 2,
        color: {
          dark: selectedColor,
          light: '#ffffff',
        },
      });
      setQrCodeUrl(url);
    } catch (error) {
      console.error('Error generating QR code:', error);
      toast.error('Failed to generate QR code');
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(propertyUrl);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  const downloadQRCode = () => {
    const link = document.createElement('a');
    link.download = `property-${draftId}-qr-code.png`;
    link.href = qrCodeUrl;
    link.click();
    toast.success('QR code downloaded successfully');
  };

  const shareProperty = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: property?.draftData?.title || 'Check out this property',
          text: 'View this amazing property listing',
          url: propertyUrl,
        });
        toast.success('Shared successfully');
      } catch (error) {
        if (error.name !== 'AbortError') {
          toast.error('Failed to share');
        }
      }
    } else {
      copyToClipboard();
    }
  };

  const openInNewTab = () => {
    window.open(propertyUrl, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-1 bg-orange-600 rounded-full"></div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Share Property</h2>
            <p className="text-sm text-gray-600 mt-1">
              Share your property with QR code or direct link
            </p>
          </div>
        </div>
      </div>

      {/* Combined Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-white shadow-sm border border-gray-200">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:divide-x divide-gray-200">
              {/* Left Column - QR Code */}
              <div className="space-y-6 lg:pr-8">
                <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                  <div className="p-2.5 rounded-lg bg-orange-100">
                    <QrCode className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">QR Code</h3>
                    <p className="text-sm text-gray-600">Scannable code for instant access</p>
                  </div>
                </div>

                {/* Custom Color Selector */}
                <div className="space-y-3">
                  <label htmlFor="qr-color-picker" className="text-sm font-medium text-gray-700">
                    Customize Color
                  </label>
                  <div className="flex items-center gap-3">
                    <label 
                      htmlFor="qr-color-picker" 
                      className="relative block w-14 h-14 rounded-lg border-2 border-gray-300 cursor-pointer hover:border-gray-400 hover:scale-105 transition-all duration-200 shadow-sm hover:shadow-md overflow-hidden"
                      title="Choose QR code color"
                    >
                      <input
                        id="qr-color-picker"
                        type="color"
                        value={selectedColor}
                        onChange={(e) => setSelectedColor(e.target.value)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div 
                        className="absolute inset-0"
                        style={{ backgroundColor: selectedColor }}
                      ></div>
                    </label>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{selectedColor.toUpperCase()}</p>
                      <p className="text-xs text-gray-500">Click to change color</p>
                    </div>
                  </div>
                </div>

                {/* QR Code Display */}
                <div className="flex justify-center py-4">
                  <div className="relative">
                    <div className="bg-white p-5 rounded-xl shadow-lg border-4" style={{ borderColor: `${selectedColor}20` }}>
                      {qrCodeUrl ? (
                        <img
                          src={qrCodeUrl}
                          alt="Property QR Code"
                          className="w-48 h-48"
                        />
                      ) : (
                        <div className="w-48 h-48 flex items-center justify-center bg-gray-100 rounded-lg">
                          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-600"></div>
                        </div>
                      )}
                    </div>
                    <div 
                      className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg"
                      style={{ backgroundColor: selectedColor }}
                    >
                      Scan Me
                    </div>
                  </div>
                </div>

                {/* QR Code Info */}
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
                  <div className="flex items-start gap-3">
                    <Smartphone className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <p className="font-semibold text-orange-900 mb-1">Usage Tips</p>
                      <ul className="text-orange-700 space-y-1 text-xs">
                        <li>• Print and place on property signage</li>
                        <li>• Add to brochures and flyers</li>
                        <li>• Instant access for visitors</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Property URL & Actions */}
              <div className="space-y-6 lg:pl-8">
                <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                  <div className="p-2.5 rounded-lg bg-blue-100">
                    <LinkIcon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Property Link</h3>
                    <p className="text-sm text-gray-600">Direct URL to share</p>
                  </div>
                </div>

                {/* URL Display */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-700">
                    Share URL
                  </label>
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <Input
                        value={propertyUrl}
                        readOnly
                        className="pr-10 font-mono text-sm bg-gray-50 border-gray-200"
                      />
                      <Globe className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                    <Button
                      onClick={copyToClipboard}
                      variant="outline"
                      size="icon"
                      className="flex-shrink-0 border-gray-200 hover:bg-gray-50"
                    >
                      {copied ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4 text-gray-600" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-700">
                    Quick Actions
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      onClick={downloadQRCode}
                      className="bg-orange-600 hover:bg-orange-700 text-white"
                      disabled={!qrCodeUrl}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download QR
                    </Button>
                    <Button
                      onClick={copyToClipboard}
                      variant="outline"
                      className="border-gray-200 hover:bg-gray-50"
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4 mr-2 text-green-600" />
                          <span className="text-green-600">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-2" />
                          Copy Link
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={openInNewTab}
                      variant="outline"
                      className="border-gray-200 hover:bg-gray-50"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Open Link
                    </Button>
                    <Button
                      onClick={shareProperty}
                      variant="outline"
                      className="border-gray-200 hover:bg-gray-50"
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>

                {/* Sharing Info */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                  <div className="flex items-start gap-3">
                    <Globe className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <p className="font-semibold text-blue-900 mb-1">Sharing Options</p>
                      <ul className="text-blue-700 space-y-1 text-xs">
                        <li>• Share on social media</li>
                        <li>• Send via email or messaging</li>
                        <li>• Embed in your website</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                  <div className="flex items-start gap-3">
                    <QrCode className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <p className="font-semibold text-green-900 mb-1">Pro Tip</p>
                      <p className="text-green-700 text-xs">
                        Use both QR code and link together for maximum reach. QR codes work great offline while links are perfect for digital sharing.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
