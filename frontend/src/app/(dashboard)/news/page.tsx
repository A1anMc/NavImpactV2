'use client';

import { useState, useEffect } from 'react';
import { NewsService, IndustryNews } from '@/services/news';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ExternalLink, RefreshCw, TrendingUp, Clock, Source } from 'lucide-react';

export default function NewsPage() {
  const [news, setNews] = useState<IndustryNews[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedSector, setSelectedSector] = useState<string>('all');
  const [availableSectors, setAvailableSectors] = useState<string[]>([]);
  const [stats, setStats] = useState<any>(null);

  // Mock user sectors - in real app, this would come from user profile
  const userSectors = ['creative', 'health', 'tech'];

  useEffect(() => {
    loadNews();
    loadSectors();
    loadStats();
  }, []);

  const loadNews = async () => {
    try {
      setLoading(true);
      const newsData = await NewsService.getNewsForUser(userSectors, 30);
      setNews(newsData);
    } catch (error) {
      console.error('Error loading news:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSectors = async () => {
    try {
      const sectors = await NewsService.getAvailableSectors();
      setAvailableSectors(sectors);
    } catch (error) {
      console.error('Error loading sectors:', error);
    }
  };

  const loadStats = async () => {
    try {
      const statsData = await NewsService.getNewsStats();
      setStats(statsData);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const refreshNews = async () => {
    try {
      setRefreshing(true);
      await NewsService.refreshNewsFeed();
      await loadNews();
      await loadStats();
    } catch (error) {
      console.error('Error refreshing news:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const filteredNews = selectedSector === 'all' 
    ? news 
    : news.filter(item => item.sector === selectedSector);

  const NewsCard = ({ item }: { item: IndustryNews }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant={NewsService.getSectorBadgeColor(item.sector) as any}>
                {item.sector}
              </Badge>
              <Badge variant={NewsService.getRelevanceBadgeColor(item.relevance_score) as any}>
                {NewsService.formatRelevanceScore(item.relevance_score)} relevant
              </Badge>
            </div>
            <CardTitle className="text-lg leading-tight">
              <a 
                href={item.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-blue-600 transition-colors"
              >
                {item.title}
              </a>
            </CardTitle>
          </div>
          <ExternalLink className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {item.summary && (
          <p className="text-gray-600 mb-3 text-sm">
            {NewsService.truncateText(item.summary, 200)}
          </p>
        )}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-4">
            {item.source && (
              <div className="flex items-center gap-1">
                <Source className="w-3 h-3" />
                <span>{item.source}</span>
              </div>
            )}
            {item.published_at && (
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{NewsService.formatDate(item.published_at)}</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>Relevance: {NewsService.formatRelevanceScore(item.relevance_score)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const StatsCard = () => (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">News Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {stats?.total_news_items || 0}
            </div>
            <div className="text-sm text-gray-600">Total Articles</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {stats?.recent_news_items || 0}
            </div>
            <div className="text-sm text-gray-600">Last 7 Days</div>
          </div>
        </div>
        {stats?.sector_breakdown && (
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">By Sector</h4>
            <div className="space-y-1">
              {Object.entries(stats.sector_breakdown).map(([sector, count]) => (
                <div key={sector} className="flex justify-between text-sm">
                  <span className="capitalize">{sector}</span>
                  <span className="font-medium">{count as number}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Industry News</h1>
          <Button disabled>
            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            Loading...
          </Button>
        </div>
        <div className="grid gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Industry News</h1>
        <Button onClick={refreshNews} disabled={refreshing}>
          <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Refreshing...' : 'Refresh News'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Tabs value={selectedSector} onValueChange={setSelectedSector}>
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="all">All</TabsTrigger>
              {availableSectors.map(sector => (
                <TabsTrigger key={sector} value={sector} className="capitalize">
                  {sector}
                </TabsTrigger>
              ))}
            </TabsList>
            
            <TabsContent value={selectedSector} className="mt-6">
              <div className="space-y-4">
                {filteredNews.length === 0 ? (
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center text-gray-500">
                        <p>No news articles found for this sector.</p>
                        <p className="text-sm mt-2">Try refreshing the news feed or selecting a different sector.</p>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  filteredNews.map(item => (
                    <NewsCard key={item.id} item={item} />
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="lg:col-span-1">
          <StatsCard />
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Your Sectors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {userSectors.map(sector => (
                  <Badge 
                    key={sector} 
                    variant={NewsService.getSectorBadgeColor(sector) as any}
                    className="block text-center"
                  >
                    {sector}
                  </Badge>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-3">
                News is personalized based on your selected sectors
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 