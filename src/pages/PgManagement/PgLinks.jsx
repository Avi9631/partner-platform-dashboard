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

export default function PgLinks({ draftId, pg }) {
  const [copied, setCopied] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [selectedColor, setSelectedColor] = useState('#3b82f6'); // blue-600
  const qrCanvasRef = useRef(null);

  const pgUrl = `${window.location.origin}/pg/${draftId}`;

  useEffect(() => {
    generateQRCode();
  }, [pgUrl, selectedColor]);

  const generateQRCode = async () => {
    try {
      const url = await QRCode.toDataURL(pgUrl, {
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
      await navigator.clipboard.writeText(pgUrl);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  const downloadQRCode = () => {
    const link = document.createElement('a');
    link.download = `pg-${draftId}-qr-code.png`;
    link.href = qrCodeUrl;
    link.click();
    toast.success('QR code downloaded successfully');
  };

  const shareProperty = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: pg?.draftData?.pgName || 'Check out this PG/Hostel',
          text: 'View this amazing PG/Hostel listing',
          url: pgUrl,
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
    window.open(pgUrl, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-1 bg-blue-600 rounded-full"></div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Share PG/Hostel</h2>
            <p className="text-sm text-gray-600 mt-1">
              Share your listing with QR code or direct link
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
                  <div className="p-2.5 rounded-lg bg-blue-100">
                    <QrCode className="w-5 h-5 text-blue-600" />
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
                      <p className="text-sm text-gray-600 mb-1">Selected Color</p>
                      <p className="text-xs font-mono text-gray-500 uppercase">{selectedColor}</p>
                    </div>
                  </div>
                </div>

                {/* QR Code Display */}
                <div className="flex flex-col items-center justify-center bg-gray-50 rounded-xl p-8 border-2 border-dashed border-gray-300">
                  {qrCodeUrl ? (
                    <motion.img
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      src={qrCodeUrl}
                      alt="QR Code"
                      className="w-48 h-48 rounded-lg shadow-lg"
                    />
                  ) : (
                    <div className="w-48 h-48 flex items-center justify-center">
                      <div className="animate-pulse bg-gray-200 rounded-lg w-full h-full"></div>
                    </div>
                  )}
                </div>

                {/* QR Actions */}
                <div className="flex gap-3">
                  <Button
                    onClick={downloadQRCode}
                    disabled={!qrCodeUrl}
                    className="flex-1 gap-2 bg-blue-600 hover:bg-blue-700"
                  >
                    <Download className="w-4 h-4" />
                    Download QR
                  </Button>
                  <Button
                    onClick={shareProperty}
                    variant="outline"
                    className="flex-1 gap-2"
                  >
                    <Share2 className="w-4 h-4" />
                    Share
                  </Button>
                </div>
              </div>

              {/* Right Column - Link Sharing */}
              <div className="space-y-6 lg:pl-8">
                <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                  <div className="p-2.5 rounded-lg bg-blue-100">
                    <LinkIcon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Direct Link</h3>
                    <p className="text-sm text-gray-600">Share via URL</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Public URL
                    </label>
                    <div className="flex gap-2">
                      <Input
                        value={pgUrl}
                        readOnly
                        className="font-mono text-sm bg-gray-50"
                        onClick={(e) => e.target.select()}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button
                      onClick={copyToClipboard}
                      variant="outline"
                      className="w-full gap-2 border-2"
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4 text-green-600" />
                          <span className="text-green-600">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copy Link
                        </>
                      )}
                    </Button>

                    <Button
                      onClick={openInNewTab}
                      variant="outline"
                      className="w-full gap-2"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Open in New Tab
                    </Button>
                  </div>
                </div>

                {/* Quick Share Options */}
                <div className="space-y-3">
                  <p className="text-sm font-medium text-gray-700">Quick Share</p>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(pgUrl)}`, '_blank')}
                    >
                      <Smartphone className="w-4 h-4" />
                      WhatsApp
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={() => window.open(`mailto:?subject=Check out this PG&body=${encodeURIComponent(pgUrl)}`, '_blank')}
                    >
                      <Globe className="w-4 h-4" />
                      Email
                    </Button>
                  </div>
                </div>

                {/* Stats/Info Box */}
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Globe className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-blue-900">Pro Tip</p>
                      <p className="text-xs text-blue-700 mt-1">
                        Print the QR code and display it at your property for easy access to your listing.
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
