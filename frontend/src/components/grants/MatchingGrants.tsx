'use client';

import { useState, useEffect } from 'react';
import { grantsApi } from '@/services/grants';
import { Grant } from '@/types/models';
import { GrantCard } from './GrantCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Loader2, Target, Search, Filter, Download } from 'lucide-react';

interface MatchingGrantsProps {
  showFilters?: boolean;
}

export default function MatchingGrants({ showFilters = true }: MatchingGrantsProps) {
  const [grants, setGrants] = useState<Grant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const limit = 20;

  useEffect(() => {
    loadMatchingGrants();
  }, [currentPage]);

  const loadMatchingGrants = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await grantsApi.getMatchingGrants(currentPage * limit, limit);
      setGrants(prev => currentPage === 0 ? data : [...prev, ...data]);
      setHasMore(data.length === limit);
      if (currentPage === 0) {
        setTotalCount(data.length);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load matching grants');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(0);
    loadMatchingGrants();
  };

  const handleLoadMore = () => {
    setCurrentPage(prev => prev + 1);
  };

  const exportToCSV = () => {
    const headers = [
      'Title', 'Description', 'Source', 'Min Amount', 'Max Amount', 
      'Deadline', 'Industry Focus', 'Location', 'Status'
    ];
    
    const csvContent = [
      headers.join(','),
      ...grants.map(grant => [
        `"${grant.title}"`,
        `"${grant.description?.replace(/"/g, '""') || ''}"`,
        grant.source,
        grant.min_amount || '',
        grant.max_amount || '',
        grant.deadline || '',
        grant.industry_focus || '',
        grant.location_eligibility || '',
        grant.status
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `matching-grants-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const filteredGrants = grants.filter(grant =>
    grant.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    grant.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    grant.industry_focus?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && currentPage === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-600" />
            Matching Grants
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Loading matching grants...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error && currentPage === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-600" />
            Matching Grants
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={loadMatchingGrants} variant="outline">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-600" />
            Matching Grants
            <Badge variant="outline" className="ml-2">
              {totalCount} matches
            </Badge>
          </CardTitle>
          {grants.length > 0 && (
            <Button onClick={exportToCSV} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {showFilters && (
          <div className="mb-6">
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search grants..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button type="submit" variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </form>
          </div>
        )}

        {grants.length === 0 && !loading ? (
          <div className="text-center py-8">
            <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">No matching grants found</p>
            <p className="text-sm text-gray-500">
              Try updating your profile preferences or check back later
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {filteredGrants.map((grant) => (
                <GrantCard key={grant.id} grant={grant} onClick={() => {}} />
              ))}
            </div>

            {hasMore && (
              <div className="mt-6 text-center">
                <Button 
                  onClick={handleLoadMore} 
                  variant="outline"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    'Load More'
                  )}
                </Button>
              </div>
            )}

            {grants.length > 0 && !hasMore && (
              <div className="mt-6 text-center text-sm text-gray-500">
                You&apos;ve seen all matching grants
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
} 