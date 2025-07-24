'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const BrandingShowcase: React.FC = () => {
  return (
    <div className="container mx-auto px-6 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="heading-xl mb-6">
          NavImpact Branding System
        </h1>
        <p className="body-lg max-w-2xl mx-auto">
          A modern, tech-forward design system built for innovation and trust. 
          Combining deep teal sophistication with soft coral warmth.
        </p>
      </div>

      {/* Color Palette */}
      <section className="mb-16">
        <h2 className="heading-lg mb-8 text-center">Color Palette</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-20 h-20 bg-[#0f766e] rounded-lg mx-auto mb-3 shadow-md"></div>
            <h3 className="font-neue-haas font-medium text-sm mb-1">Deep Teal</h3>
            <p className="font-neue-haas text-xs text-[#334155]">#0f766e</p>
          </div>
          <div className="text-center">
            <div className="w-20 h-20 bg-[#fb6f5f] rounded-lg mx-auto mb-3 shadow-md"></div>
            <h3 className="font-neue-haas font-medium text-sm mb-1">Soft Coral</h3>
            <p className="font-neue-haas text-xs text-[#334155]">#fb6f5f</p>
          </div>
          <div className="text-center">
            <div className="w-20 h-20 bg-[#334155] rounded-lg mx-auto mb-3 shadow-md"></div>
            <h3 className="font-neue-haas font-medium text-sm mb-1">Cool Slate</h3>
            <p className="font-neue-haas text-xs text-[#334155]">#334155</p>
          </div>
          <div className="text-center">
            <div className="w-20 h-20 bg-[#f8fafc] rounded-lg mx-auto mb-3 shadow-md border border-gray-200"></div>
            <h3 className="font-neue-haas font-medium text-sm mb-1">Off-White</h3>
            <p className="font-neue-haas text-xs text-[#334155]">#f8fafc</p>
          </div>
        </div>
      </section>

      {/* Typography */}
      <section className="mb-16">
        <h2 className="heading-lg mb-8 text-center">Typography System</h2>
        <div className="space-y-8">
          <div>
            <h1 className="heading-xl mb-4">Heading XL - Carrotflower</h1>
            <p className="body-lg">This is the largest heading style, perfect for hero sections and main page titles.</p>
          </div>
          <div>
            <h2 className="heading-lg mb-4">Heading LG - Carrotflower</h2>
            <p className="body-lg">Large headings for section titles and important content areas.</p>
          </div>
          <div>
            <h3 className="heading-md mb-4">Heading MD - Carrotflower</h3>
            <p className="body-lg">Medium headings for subsections and card titles.</p>
          </div>
          <div>
            <h4 className="heading-sm mb-4">Heading SM - Carrotflower</h4>
            <p className="body-lg">Small headings for minor sections and component titles.</p>
          </div>
          <div>
            <p className="body-lg mb-4">Body Large - Neue Haas Grotesk Display Pro 45 Light</p>
            <p className="body-md mb-4">Body Medium - Neue Haas Grotesk Display Pro 45 Light</p>
            <p className="body-sm">Body Small - Neue Haas Grotesk Display Pro 45 Light</p>
          </div>
        </div>
      </section>

      {/* Button System */}
      <section className="mb-16">
        <h2 className="heading-lg mb-8 text-center">Button System</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="heading-sm mb-4">Primary Buttons</h3>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-4">
                <Button variant="default">Default</Button>
                <Button variant="default" size="sm">Small</Button>
                <Button variant="default" size="lg">Large</Button>
              </div>
              <div className="flex flex-wrap gap-4">
                <Button variant="default">Gradient</Button>
                <Button variant="default" size="sm">Small</Button>
                <Button variant="default" size="lg">Large</Button>
              </div>
            </div>
          </div>
          <div>
            <h3 className="heading-sm mb-4">Secondary Buttons</h3>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-4">
                <Button variant="outline">Outline</Button>
                <Button variant="outline" size="sm">Small</Button>
                <Button variant="outline" size="lg">Large</Button>
              </div>
              <div className="flex flex-wrap gap-4">
                <Button variant="secondary">Secondary</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="link">Link</Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Card System */}
      <section className="mb-16">
        <h2 className="heading-lg mb-8 text-center">Card System</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="hover-lift">
            <CardHeader>
              <CardTitle>Card Title</CardTitle>
              <CardDescription>
                This is a card description using the Neue Haas font for body text.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="body-md">
                Card content goes here. This demonstrates the proper typography hierarchy 
                with Carrotflower for titles and Neue Haas for body text.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="default" size="sm">Action</Button>
            </CardFooter>
          </Card>

          <Card className="hover-lift bg-gradient-to-br from-[#0f766e]/5 to-[#fb6f5f]/5">
            <CardHeader>
              <CardTitle>Gradient Card</CardTitle>
              <CardDescription>
                Cards can have subtle gradient backgrounds for visual interest.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="body-md">
                This card demonstrates how gradients can be used to create 
                visual hierarchy and brand consistency.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="default" size="sm">Gradient Button</Button>
            </CardFooter>
          </Card>

          <Card className="hover-lift border-[#fb6f5f]/20">
            <CardHeader>
              <CardTitle>Accent Card</CardTitle>
              <CardDescription>
                Cards can use accent colors for special emphasis.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="body-md">
                The border color uses the soft coral accent to draw attention 
                to important content or featured items.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm">Learn More</Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* Logo Showcase */}
      <section className="mb-16">
        <h2 className="heading-lg mb-8 text-center">Logo System</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="text-center">
            <h3 className="heading-sm mb-6">Icon Version</h3>
            <div className="flex justify-center mb-4">
              <img 
                src="/icon-enhanced.svg" 
                alt="NavImpact Icon" 
                className="h-16 w-16 transition-all duration-250 ease-in-out hover:rotate-12 hover:scale-110"
              />
            </div>
            <p className="body-sm text-[#334155]">
              Used for sidebar, favicon, and small displays
            </p>
          </div>
          <div className="text-center">
            <h3 className="heading-sm mb-6">Full Logo</h3>
            <div className="flex justify-center mb-4">
              <img 
                src="/logo-enhanced.svg" 
                alt="NavImpact Logo" 
                className="h-12 transition-all duration-250 ease-in-out hover:scale-105"
              />
            </div>
            <p className="body-sm text-[#334155]">
              Used for header and hero sections
            </p>
          </div>
        </div>
      </section>

      {/* Responsive Breakpoints */}
      <section className="mb-16">
        <h2 className="heading-lg mb-8 text-center">Responsive Design</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Mobile</CardTitle>
              <CardDescription>≤ 768px</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="body-sm space-y-2">
                <li>• Single column layouts</li>
                <li>• Stacked navigation</li>
                <li>• Reduced font sizes</li>
                <li>• Touch-friendly buttons</li>
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Tablet</CardTitle>
              <CardDescription>768px - 1024px</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="body-sm space-y-2">
                <li>• Two-column grids</li>
                <li>• Horizontal navigation</li>
                <li>• Medium font sizes</li>
                <li>• Balanced spacing</li>
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Desktop</CardTitle>
              <CardDescription>≥ 1024px</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="body-sm space-y-2">
                <li>• Multi-column layouts</li>
                <li>• Full navigation</li>
                <li>• Large font sizes</li>
                <li>• Generous spacing</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}; 