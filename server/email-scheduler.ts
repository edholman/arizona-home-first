import { storage } from './storage';
import { sendDripCampaignEmail, getAllCampaigns } from './email-campaigns';

interface ScheduledEmail {
  leadId: string;
  leadEmail: string;
  leadFirstName: string;
  campaignId: number;
  scheduledDate: Date;
  sent: boolean;
  sentDate?: Date;
}

class EmailScheduler {
  private scheduledEmails: Map<string, ScheduledEmail[]> = new Map();
  private isRunning = false;
  private intervalId: NodeJS.Timeout | null = null;

  // Schedule all 48 campaigns for a new lead
  scheduleLeadCampaigns(leadId: string, leadEmail: string, leadFirstName: string, registrationDate: Date) {
    const campaigns = getAllCampaigns();
    const leadSchedule: ScheduledEmail[] = [];

    campaigns.forEach(campaign => {
      // Skip the welcome email (campaign 1) as it's sent immediately
      if (campaign.id === 1) return;

      const scheduledDate = new Date(registrationDate);
      scheduledDate.setDate(scheduledDate.getDate() + (campaign.weeksSinceRegistration * 7));

      leadSchedule.push({
        leadId,
        leadEmail,
        leadFirstName,
        campaignId: campaign.id,
        scheduledDate,
        sent: false
      });
    });

    this.scheduledEmails.set(leadId, leadSchedule);
    console.log(`Scheduled ${leadSchedule.length} campaigns for ${leadEmail}`);
  }

  // Check for and send due emails
  async processPendingEmails() {
    const now = new Date();
    
    for (const [leadId, schedule] of this.scheduledEmails.entries()) {
      for (const scheduledEmail of schedule) {
        if (!scheduledEmail.sent && scheduledEmail.scheduledDate <= now) {
          try {
            const success = await sendDripCampaignEmail(
              scheduledEmail.leadEmail,
              scheduledEmail.leadFirstName,
              this.getWeeksByCampaignId(scheduledEmail.campaignId)
            );

            if (success) {
              scheduledEmail.sent = true;
              scheduledEmail.sentDate = new Date();
              console.log(`Sent campaign ${scheduledEmail.campaignId} to ${scheduledEmail.leadEmail}`);
            }
          } catch (error) {
            console.error(`Failed to send campaign ${scheduledEmail.campaignId} to ${scheduledEmail.leadEmail}:`, error);
          }
        }
      }
    }
  }

  private getWeeksByCampaignId(campaignId: number): number {
    const campaigns = getAllCampaigns();
    const campaign = campaigns.find(c => c.id === campaignId);
    return campaign?.weeksSinceRegistration || 0;
  }

  // Start the scheduler (check every hour)
  start() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    console.log('Email scheduler started - checking every hour');
    
    // Check immediately, then every hour
    this.processPendingEmails();
    this.intervalId = setInterval(() => {
      this.processPendingEmails();
    }, 60 * 60 * 1000); // 1 hour
  }

  // Stop the scheduler
  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
    console.log('Email scheduler stopped');
  }

  // Get schedule status for a lead
  getLeadSchedule(leadId: string): ScheduledEmail[] {
    return this.scheduledEmails.get(leadId) || [];
  }

  // Get all scheduled emails (for admin dashboard)
  getAllScheduledEmails(): { leadId: string; emails: ScheduledEmail[] }[] {
    const result: { leadId: string; emails: ScheduledEmail[] }[] = [];
    for (const [leadId, emails] of this.scheduledEmails.entries()) {
      result.push({ leadId, emails });
    }
    return result;
  }

  // Manual trigger for testing
  async sendCampaignNow(leadEmail: string, leadFirstName: string, campaignId: number) {
    const weeksSince = this.getWeeksByCampaignId(campaignId);
    return await sendDripCampaignEmail(leadEmail, leadFirstName, weeksSince);
  }
}

// Singleton instance
export const emailScheduler = new EmailScheduler();

// Auto-start the scheduler when module loads
emailScheduler.start();