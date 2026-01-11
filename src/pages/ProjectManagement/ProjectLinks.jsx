import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy, ExternalLink, Share2, Check, Eye, Home } from 'lucide-react';
import { toast } from 'sonner';

export default function ProjectLinks({ draftId, project }) {
  const [copiedLink, setCopiedLink] = useState(null);

  // Generate links (replace with actual URLs from your app)
  const baseUrl = window.location.origin;
  const projectSlug = project.draftData?.slug || draftId;
  
  const links = [
    {
      id: 'public',
      title: 'Public Project Page',
      description: 'Share this link with potential buyers',
      url: `${baseUrl}/project/${projectSlug}`,
      icon: Eye,
    },
    {
      id: 'preview',
      title: 'Preview Link',
      description: 'Preview how your project looks before publishing',
      url: `${baseUrl}/preview/project/${draftId}`,
      icon: ExternalLink,
    },
    {
      id: 'brochure',
      title: 'Digital Brochure',
      description: 'Mobile-optimized brochure for sharing',
      url: `${baseUrl}/brochure/project/${draftId}`,
      icon: Home,
    },
  ];

  const handleCopyLink = async (link) => {
    try {
      await navigator.clipboard.writeText(link.url);
      setCopiedLink(link.id);
      toast.success('Link copied to clipboard!');
      
      setTimeout(() => {
        setCopiedLink(null);
      }, 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
      toast.error('Failed to copy link');
    }
  };

  const handleShare = async (link) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: project.draftData?.projectName || 'Check out this project',
          text: 'I found this amazing real estate project',
          url: link.url,
        });
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Error sharing:', error);
        }
      }
    } else {
      handleCopyLink(link);
    }
  };

  const handleOpenLink = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Project Links</h2>
        <p className="text-sm text-gray-500">
          Share your project with potential buyers and investors
        </p>
      </div>

      <div className="space-y-4">
        {links.map((link) => {
          const Icon = link.icon;
          const isCopied = copiedLink === link.id;
          
          return (
            <Card key={link.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-green-50 rounded-lg">
                      <Icon className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{link.title}</CardTitle>
                      <CardDescription className="mt-1">
                        {link.description}
                      </CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    value={link.url}
                    readOnly
                    className="font-mono text-sm"
                    onClick={(e) => e.target.select()}
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopyLink(link)}
                    className="gap-2"
                  >
                    {isCopied ? (
                      <>
                        <Check className="h-4 w-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        Copy Link
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenLink(link.url)}
                    className="gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Open
                  </Button>
                  {navigator.share && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleShare(link)}
                      className="gap-2"
                    >
                      <Share2 className="h-4 w-4" />
                      Share
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Additional Marketing Tools */}
      <Card>
        <CardHeader>
          <CardTitle>Marketing Tools</CardTitle>
          <CardDescription>Coming soon</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">
            Generate QR codes, social media posts, email templates, and more to promote your project.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
