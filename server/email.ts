import { MailService } from '@sendgrid/mail';
import { sendDripCampaignEmail } from './email-campaigns';
import { emailScheduler } from './email-scheduler';
import { scheduleDelayedCall, getLeadCallInstructions } from './twilio-integration';

let mailService: MailService | null = null;

function initializeEmailService() {
  if (!process.env.SENDGRID_API_KEY) {
    console.log("SendGrid API key not found - email notifications disabled");
    return;
  }

  mailService = new MailService();
  mailService.setApiKey(process.env.SENDGRID_API_KEY);
  console.log("Email service initialized");
}

export async function sendLeadNotification(leadData: any) {
  if (!mailService) {
    console.log("Email service not initialized - skipping notification");
    return false;
  }

  try {
    const firstName = leadData.name.split(' ')[0];
    const emailContent = `
New Arizona Home First Waitlist Submission!

Name: ${leadData.name}
Email: ${leadData.email}
Phone: ${leadData.phone}
Timeline: ${leadData.timeline || 'Not specified'}

Quiz Answers:
${leadData.quizAnswers ? JSON.stringify(leadData.quizAnswers, null, 2) : 'No quiz data'}

Submitted: ${new Date().toLocaleString()}
    `;

    await mailService.send({
      to: 'estebanholman@gmail.com',
      from: 'info@arizonahomefirst.org',
      replyTo: 'estebanholman@gmail.com',
      subject: 'New Arizona Home First Lead - ' + leadData.name,
      text: emailContent,
    });

    console.log(`Lead notification sent for: ${leadData.email}`);
    
    // Send welcome email (first drip campaign email)
    await sendDripCampaignEmail(leadData.email, firstName, 0);
    
    // Schedule the remaining 47 campaigns
    emailScheduler.scheduleLeadCampaigns(
      leadData.id || 'temp-' + Date.now(),
      leadData.email,
      firstName,
      new Date()
    );

    // Schedule Twilio call with 3-minute delay
    const twilioSuccess = await scheduleDelayedCall({
      name: leadData.name,
      phone: leadData.phone,
      email: leadData.email,
      timestamp: new Date().toISOString()
    }, 3);

    // Log call instructions with timing information
    const callInstructions = getLeadCallInstructions({
      name: leadData.name,
      phone: leadData.phone,
      email: leadData.email,
      timestamp: new Date().toISOString()
    });
    
    console.log('\n' + '='.repeat(80));
    console.log('🚨 NEW LEAD - CALL SCHEDULED IN 3 MINUTES 🚨');
    console.log(callInstructions);
    console.log('='.repeat(80) + '\n');
    
    return true;
  } catch (error) {
    console.error('Failed to send lead notification:', error);
    return false;
  }
}

// Initialize on startup
initializeEmailService();