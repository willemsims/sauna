"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from 'next/navigation';
import Header from "@/components/Header";
import Footer from "@/components/Footer";

function DesignSystemContent() {
  const [activeTab, setActiveTab] = useState("colors");

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1 py-12">
        <div className="container px-4 md:px-6 max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Design System</h1>
          
          {/* Tabs */}
          <div className="tabs mb-8">
            <button 
              className={`tab tab-bordered ${activeTab === "colors" ? "tab-active" : ""}`}
              onClick={() => setActiveTab("colors")}
            >
              Colors
            </button>
            <button 
              className={`tab tab-bordered ${activeTab === "typography" ? "tab-active" : ""}`}
              onClick={() => setActiveTab("typography")}
            >
              Typography
            </button>
            <button 
              className={`tab tab-bordered ${activeTab === "components" ? "tab-active" : ""}`}
              onClick={() => setActiveTab("components")}
            >
              Components
            </button>
            <button 
              className={`tab tab-bordered ${activeTab === "spacing" ? "tab-active" : ""}`}
              onClick={() => setActiveTab("spacing")}
            >
              Spacing
            </button>
          </div>
          
          {/* Colors */}
          {activeTab === "colors" && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Colors</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                <div className="p-4 rounded-lg border">
                  <div className="h-24 bg-primary rounded-md mb-2"></div>
                  <p className="font-semibold">Primary</p>
                  <p className="text-sm text-base-content/70">bg-primary, text-primary</p>
                  <p className="text-xs text-base-content/50 mt-1">#ad8f68</p>
                </div>
                
                <div className="p-4 rounded-lg border">
                  <div className="h-24 bg-primary-dark rounded-md mb-2"></div>
                  <p className="font-semibold">Primary Dark</p>
                  <p className="text-sm text-base-content/70">bg-primary-dark, text-primary-dark</p>
                  <p className="text-xs text-base-content/50 mt-1">#8d7348</p>
                </div>
                
                <div className="p-4 rounded-lg border">
                  <div className="h-24 bg-secondary rounded-md mb-2"></div>
                  <p className="font-semibold">Secondary</p>
                  <p className="text-sm text-base-content/70">bg-secondary, text-secondary</p>
                  <p className="text-xs text-base-content/50 mt-1">#1a1a1a</p>
                </div>
                
                <div className="p-4 rounded-lg border">
                  <div className="h-24 bg-gray-light rounded-md mb-2"></div>
                  <p className="font-semibold">Light Gray</p>
                  <p className="text-sm text-base-content/70">bg-gray-light, text-gray-light</p>
                  <p className="text-xs text-base-content/50 mt-1">#a0a0a0</p>
                </div>
                
                <div className="p-4 rounded-lg border">
                  <div className="h-24 bg-neutral rounded-md mb-2"></div>
                  <p className="font-semibold">Neutral</p>
                  <p className="text-sm text-base-content/70">bg-neutral, text-neutral</p>
                </div>
                
                <div className="p-4 rounded-lg border">
                  <div className="h-24 bg-accent rounded-md mb-2"></div>
                  <p className="font-semibold">Accent</p>
                  <p className="text-sm text-base-content/70">bg-accent, text-accent</p>
                </div>
                
                <div className="p-4 rounded-lg border">
                  <div className="h-24 bg-base-100 rounded-md mb-2"></div>
                  <p className="font-semibold">Base 100</p>
                  <p className="text-sm text-base-content/70">bg-base-100</p>
                </div>
              </div>
              
              <h3 className="text-xl font-bold mb-3">Usage Examples</h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold mb-2">Dividers</h4>
                  <div className="p-4 bg-base-100 rounded-lg border">
                    <div className="mb-4">Content above divider</div>
                    <div className="border-t border-gray-light my-4"></div>
                    <div>Content below divider</div>
                  </div>
                  <p className="text-sm text-base-content/70 mt-1">border-gray-light</p>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold mb-2">Selected Items</h4>
                  <div className="p-4 bg-base-100 rounded-lg border">
                    <div className="flex gap-4">
                      <div className="p-3 border-l-4 border-gray-light bg-base-200 rounded-md">
                        Selected item with light gray border
                      </div>
                      <div className="p-3 border-l-4 border-primary bg-base-200 rounded-md">
                        Selected item with primary border
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold mb-2">Footer Text</h4>
                  <div className="p-4 bg-base-100 rounded-lg border">
                    <p className="text-gray-light">Copyright © 2025 - All rights reserved</p>
                  </div>
                  <p className="text-sm text-base-content/70 mt-1">text-gray-light</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Typography */}
          {activeTab === "typography" && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Typography</h2>
              
              <div className="space-y-6 mb-8">
                <div>
                  <h1 className="text-5xl font-bold">Heading 1</h1>
                  <p className="text-sm text-base-content/70 mt-1">text-5xl font-bold</p>
                </div>
                
                <div>
                  <h2 className="text-4xl font-bold">Heading 2</h2>
                  <p className="text-sm text-base-content/70 mt-1">text-4xl font-bold</p>
                </div>
                
                <div>
                  <h3 className="text-3xl font-bold">Heading 3</h3>
                  <p className="text-sm text-base-content/70 mt-1">text-3xl font-bold</p>
                </div>
                
                <div>
                  <h4 className="text-2xl font-bold">Heading 4</h4>
                  <p className="text-sm text-base-content/70 mt-1">text-2xl font-bold</p>
                </div>
                
                <div>
                  <h5 className="text-xl font-bold">Heading 5</h5>
                  <p className="text-sm text-base-content/70 mt-1">text-xl font-bold</p>
                </div>
                
                <div>
                  <p className="text-base">Body text</p>
                  <p className="text-sm text-base-content/70 mt-1">text-base</p>
                </div>
                
                <div>
                  <p className="text-sm">Small text</p>
                  <p className="text-sm text-base-content/70 mt-1">text-sm</p>
                </div>
                
                <div>
                  <p className="text-gray-light">Secondary text (light gray)</p>
                  <p className="text-sm text-base-content/70 mt-1">text-gray-light</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Components */}
          {activeTab === "components" && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Components</h2>
              
              <div className="space-y-8 mb-8">
                <div>
                  <h3 className="text-xl font-bold mb-3">Buttons</h3>
                  <div className="flex flex-wrap gap-4">
                    <button className="btn btn-primary">Primary</button>
                    <button className="btn btn-secondary">Secondary</button>
                    <button className="btn btn-accent">Accent</button>
                    <button className="btn btn-neutral">Neutral</button>
                    <button className="btn">Default</button>
                    <button className="btn btn-outline">Outline</button>
                    <button className="btn btn-ghost">Ghost</button>
                    <button className="btn btn-link">Link</button>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold mb-3">Custom Buttons</h3>
                  <div className="flex flex-wrap gap-4">
                    <button className="inline-block bg-secondary text-white font-medium py-3 px-6 rounded-sm hover:bg-black transition-colors">
                      Find a Sauna
                    </button>
                    <button className="inline-block bg-primary text-white font-medium py-3 px-6 rounded-sm hover:bg-primary-dark transition-colors">
                      Primary Button
                    </button>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold mb-3">Cards</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="card bg-base-100 shadow-xl">
                      <div className="card-body">
                        <h2 className="card-title">Card Title</h2>
                        <p>Card content goes here.</p>
                        <div className="card-actions justify-end">
                          <button className="btn btn-primary">Action</button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="card bg-primary text-primary-content shadow-xl">
                      <div className="card-body">
                        <h2 className="card-title">Primary Card</h2>
                        <p>Card with primary background.</p>
                        <div className="card-actions justify-end">
                          <button className="btn">Action</button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="card bg-secondary text-secondary-content shadow-xl">
                      <div className="card-body">
                        <h2 className="card-title">Secondary Card</h2>
                        <p>Card with secondary background.</p>
                        <div className="card-actions justify-end">
                          <button className="btn">Action</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold mb-3">Dividers</h3>
                  <div className="p-4 bg-base-100 rounded-lg border">
                    <div>Content above divider</div>
                    <div className="divider"></div>
                    <div>Content below divider</div>
                    
                    <div className="mt-6">Content above custom divider</div>
                    <div className="border-t border-gray-light my-4"></div>
                    <div>Content below custom divider</div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Spacing */}
          {activeTab === "spacing" && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Spacing</h2>
              
              <div className="space-y-6 mb-8">
                <div>
                  <h3 className="text-xl font-bold mb-3">Standard Spacing</h3>
                  <div className="p-4 bg-base-200 border border-base-300 rounded-md">
                    <p>Content with standard padding</p>
                  </div>
                  <p className="text-sm text-base-content/70 mt-1">p-4</p>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold mb-3">Large Spacing</h3>
                  <div className="p-6 bg-base-200 border border-base-300 rounded-md">
                    <p>Content with large padding</p>
                  </div>
                  <p className="text-sm text-base-content/70 mt-1">p-6</p>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold mb-3">Extra Large Spacing</h3>
                  <div className="p-8 bg-base-200 border border-base-300 rounded-md">
                    <p>Content with extra large padding</p>
                  </div>
                  <p className="text-sm text-base-content/70 mt-1">p-8</p>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold mb-3">Margin Examples</h3>
                  <div className="space-y-4">
                    <div className="bg-base-200 border border-base-300 rounded-md p-4">
                      <p>Base element</p>
                    </div>
                    <div className="bg-base-200 border border-base-300 rounded-md p-4 mt-4">
                      <p>Element with mt-4</p>
                    </div>
                    <div className="bg-base-200 border border-base-300 rounded-md p-4 mt-8">
                      <p>Element with mt-8</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

export default function DesignSystem() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DesignSystemContent />
    </Suspense>
  );
} 