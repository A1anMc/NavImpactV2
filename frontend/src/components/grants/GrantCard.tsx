import React, { useState, useEffect } from 'react';
import { Grant } from '../../types/models';
import { format } from 'date-fns';
import { localStorageService } from '../../services/localStorage';
import { grantsApi } from '../../services/grants';

interface GrantCardProps {
  grant: Grant;
  onClick: (grant: Grant) => void;
  showSaveButton?: boolean;
  showSimilarButton?: boolean;
}

export function GrantCard({ grant, onClick, showSaveButton = true, showSimilarButton = true }: GrantCardProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsSaved(localStorageService.isGrantSaved(grant.id));
  }, [grant.id]);

  const formatCurrency = (amount: number | undefined) => {
    if (!amount) return 'Amount not specified';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDateRange = () => {
    const openDate = grant.open_date ? format(new Date(grant.open_date), 'MMM d, yyyy') : 'Not specified';
    const deadline = grant.deadline ? format(new Date(grant.deadline), 'MMM d, yyyy') : 'Not specified';
    return `${openDate} - ${deadline}`;
  };

  const handleSaveToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLoading(true);
    
    try {
      if (isSaved) {
        localStorageService.removeSavedGrant(grant.id);
        setIsSaved(false);
        await grantsApi.trackInteraction(grant.id, 'save');
      } else {
        localStorageService.saveGrant(grant);
        setIsSaved(true);
        await grantsApi.trackInteraction(grant.id, 'save');
      }
    } catch (error) {
      console.error('Error toggling save:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleView = async () => {
    try {
      localStorageService.addViewedGrant(grant.id);
      await grantsApi.trackInteraction(grant.id, 'view');
    } catch (error) {
      console.error('Error tracking view:', error);
    }
    onClick(grant);
  };

  return (
    <div
      className="bg-white rounded-lg shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow"
      onClick={handleView}
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{grant.title}</h3>
        <div className="flex items-center gap-2">
          {showSaveButton && (
            <button
              onClick={handleSaveToggle}
              disabled={isLoading}
              className={`p-2 rounded-full transition-colors ${
                isSaved 
                  ? 'bg-[#0f766e] text-white hover:bg-[#0d9488]' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              title={isSaved ? 'Remove from saved' : 'Save for later'}
            >
              {isSaved ? (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              )}
            </button>
          )}
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${
              grant.status === 'open'
                ? 'bg-green-100 text-green-800'
                : grant.status === 'closed'
                ? 'bg-red-100 text-red-800'
                : grant.status === 'archived'
                ? 'bg-gray-100 text-gray-500'
                : 'bg-yellow-100 text-yellow-800'
            }`}
          >
            {grant.status}
          </span>
        </div>
      </div>

      <p className="text-gray-600 mb-4 line-clamp-2">{grant.description}</p>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <div className="text-sm text-gray-500">Amount Range</div>
          <div className="text-sm font-medium">
            {grant.min_amount || grant.max_amount ? (
              <>
                {formatCurrency(grant.min_amount)} - {formatCurrency(grant.max_amount)}
              </>
            ) : (
              'Amount not specified'
            )}
          </div>
        </div>
        <div>
          <div className="text-sm text-gray-500">Source</div>
          <div className="text-sm font-medium">{grant.source}</div>
        </div>
      </div>

      <div className="mb-4">
        <div className="text-sm text-gray-500">Timeline</div>
        <div className="text-sm font-medium">{formatDateRange()}</div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <div className="text-sm text-gray-500">Industry</div>
          <div className="text-sm font-medium">{grant.industry_focus || 'Not specified'}</div>
        </div>
        <div>
          <div className="text-sm text-gray-500">Location</div>
          <div className="text-sm font-medium">{grant.location_eligibility || 'Not specified'}</div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {grant.tags?.map((tag, index) => (
          <span
            key={index}
            className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
          >
            {tag.name}
          </span>
        ))}
        {grant.org_type_eligible?.map((type, index) => (
          <span
            key={`org-${index}`}
            className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full"
          >
            {type}
          </span>
        ))}
      </div>
    </div>
  );
} 