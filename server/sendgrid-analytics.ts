import { MailService } from '@sendgrid/mail';

interface EmailStats {
  delivered: number;
  opens: number;
  clicks: number;
  bounces: number;
  spam_reports: number;
  unsubscribes: number;
}

interface CampaignAnalytics {
  campaignId: number;
  subject: string;
  totalSent: number;
  deliveryRate: number;
  openRate: number;
  clickRate: number;
  lastUpdated: Date;
}

class SendGridAnalytics {
  private apiKey: string;
  private baseUrl = 'https://api.sendgrid.com/v3';

  constructor() {
    if (!process.env.SENDGRID_API_KEY) {
      throw new Error("SENDGRID_API_KEY required for analytics");
    }
    this.apiKey = process.env.SENDGRID_API_KEY;
  }

  // Get email activity for specific email
  async getEmailActivity(messageId: string) {
    try {
      const response = await fetch(`${this.baseUrl}/messages/${messageId}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`SendGrid API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to get email activity:', error);
      return null;
    }
  }

  // Get global email statistics
  async getGlobalStats(startDate: string, endDate: string): Promise<EmailStats | null> {
    try {
      const response = await fetch(
        `${this.baseUrl}/stats?start_date=${startDate}&end_date=${endDate}&aggregated_by=day`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`SendGrid API error: ${response.status}`);
      }

      const data = await response.json();
      
      // Aggregate the daily stats
      const totals: EmailStats = {
        delivered: 0,
        opens: 0,
        clicks: 0,
        bounces: 0,
        spam_reports: 0,
        unsubscribes: 0
      };

      if (data && data.length > 0) {
        data.forEach((day: any) => {
          if (day.stats && day.stats.length > 0) {
            day.stats.forEach((stat: any) => {
              totals.delivered += stat.metrics?.delivered || 0;
              totals.opens += stat.metrics?.opens || 0;
              totals.clicks += stat.metrics?.clicks || 0;
              totals.bounces += stat.metrics?.bounces || 0;
              totals.spam_reports += stat.metrics?.spam_reports || 0;
              totals.unsubscribes += stat.metrics?.unsubscribes || 0;
            });
          }
        });
      }

      return totals;
    } catch (error) {
      console.error('Failed to get global stats:', error);
      return null;
    }
  }

  // Get campaign performance (last 30 days)
  async getCampaignAnalytics(): Promise<CampaignAnalytics[]> {
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    const stats = await this.getGlobalStats(startDate, endDate);
    
    if (!stats) {
      return [];
    }

    // For now, return aggregate stats
    // In production, you'd query by specific campaign categories/tags
    const campaignAnalytics: CampaignAnalytics[] = [{
      campaignId: 1,
      subject: "Arizona Home First Drip Campaigns",
      totalSent: stats.delivered + stats.bounces,
      deliveryRate: stats.delivered / (stats.delivered + stats.bounces) * 100,
      openRate: stats.opens / stats.delivered * 100,
      clickRate: stats.clicks / stats.delivered * 100,
      lastUpdated: new Date()
    }];

    return campaignAnalytics;
  }

  // Get email events (opens, clicks, bounces, etc.)
  async getEmailEvents(limit: number = 100) {
    try {
      const response = await fetch(
        `${this.baseUrl}/activity?limit=${limit}`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`SendGrid API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to get email events:', error);
      return [];
    }
  }

  // Calculate performance metrics
  calculateMetrics(stats: EmailStats) {
    const total = stats.delivered + stats.bounces;
    
    return {
      deliveryRate: total > 0 ? (stats.delivered / total * 100).toFixed(2) : '0',
      openRate: stats.delivered > 0 ? (stats.opens / stats.delivered * 100).toFixed(2) : '0',
      clickRate: stats.delivered > 0 ? (stats.clicks / stats.delivered * 100).toFixed(2) : '0',
      bounceRate: total > 0 ? (stats.bounces / total * 100).toFixed(2) : '0',
      unsubscribeRate: stats.delivered > 0 ? (stats.unsubscribes / stats.delivered * 100).toFixed(2) : '0'
    };
  }
}

export const sendGridAnalytics = new SendGridAnalytics();