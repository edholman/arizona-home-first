import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertLeadSchema, quizAnswerSchema } from "@shared/schema";
import { sendLeadNotification } from "./email";
import { emailScheduler } from "./email-scheduler";
import { sendGridAnalytics } from "./sendgrid-analytics";
import { getLeadCallInstructions } from "./twilio-integration";
import { postToCallCenter, testCallCenterIntegration, bulkPushLeadsToCallCenter } from "./call-center-integration";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Create lead endpoint
  app.post("/api/leads", async (req, res) => {
    try {
      const leadData = insertLeadSchema.parse(req.body);
      const lead = await storage.createLead(leadData);
      
      // Send email notification to admin
      await sendLeadNotification(lead);
      
      // Post to call center for outbound prospecting (don't block on failure)
      postToCallCenter(lead).catch(error => {
        console.error('Call center integration failed:', error);
      });
      
      console.log(`New lead created: ${lead.email}`);
      
      res.json({ 
        success: true, 
        message: "Thank you! Your Arizona Homebuyer Credit Guide is on its way!",
        leadId: lead.id 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          success: false, 
          message: "Please fill in all required fields correctly.",
          errors: error.errors 
        });
      } else {
        res.status(500).json({ 
          success: false, 
          message: "Something went wrong. Please try again." 
        });
      }
    }
  });

  // Get all leads (admin endpoint)
  app.get("/api/leads", async (req, res) => {
    try {
      const allLeads = await storage.getAllLeads();
      // Filter out temporary quiz-only records
      const realLeads = allLeads.filter(lead => 
        !lead.email.includes('quiz-') && 
        !lead.email.includes('@temp.com') &&
        lead.firstName !== 'Quiz Response'
      );
      res.json(realLeads);
    } catch (error) {
      console.error("Failed to fetch leads:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to fetch leads",
        error: error.message
      });
    }
  });

  // Admin page to view leads - more private URL with access key
  app.get("/adminlist", (req, res) => {
    // Simple access key protection
    const accessKey = req.query.key;
    if (accessKey !== "ahf2025secure") {
      res.status(404).send("Page not found");
      return;
    }
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Arizona Home First - Admin</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          table { border-collapse: collapse; width: 100%; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
          .quiz-answers { font-size: 12px; }
        </style>
      </head>
      <body>
        <h1>Arizona Home First - Lead Management</h1>
        <div id="leads-container">
          <p>Loading leads...</p>
        </div>
        
        <script>
          async function loadLeads() {
            try {
              const response = await fetch('/api/leads');
              const leads = await response.json();
              
              if (Array.isArray(leads)) {
                const container = document.getElementById('leads-container');
                
                if (leads.length === 0) {
                  container.innerHTML = '<p>No leads found yet.</p>';
                  return;
                }
                
                let html = '<div style="margin-bottom: 20px;">';
                html += '<a href="/adminlist/export?key=ahf2025secure" download="arizona-home-first-leads.csv" style="background: #1a73e8; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-right: 10px;">Download CSV Export</a>';
                html += '<a href="/adminlist/campaigns?key=ahf2025secure" style="background: #34a853; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Email Campaigns</a>';
                html += '</div>';
                html += '<table><tr><th>Date</th><th>Name</th><th>Email</th><th>Phone</th><th>Down Payment Need</th><th>Timeline</th><th>Quiz Answers</th></tr>';
                
                leads.forEach(lead => {
                  const date = new Date(lead.createdAt).toLocaleDateString();
                  const quizAnswers = lead.quizAnswers ? JSON.stringify(lead.quizAnswers, null, 2) : 'None';
                  
                  html += \`<tr>
                    <td>\${date}</td>
                    <td>\${lead.firstName} \${lead.lastName}</td>
                    <td>\${lead.email}</td>
                    <td>\${lead.phone}</td>
                    <td>\${lead.downPaymentNeed}</td>
                    <td>\${lead.timeline || 'Not specified'}</td>
                    <td class="quiz-answers"><pre>\${quizAnswers}</pre></td>
                  </tr>\`;
                });
                
                html += '</table>';
                container.innerHTML = html;
              } else {
                document.getElementById('leads-container').innerHTML = '<p>Error loading leads: ' + JSON.stringify(leads) + '</p>';
              }
            } catch (error) {
              document.getElementById('leads-container').innerHTML = '<p>Error: ' + error.message + '</p>';
            }
          }
          
          loadLeads();
          // Refresh every 30 seconds
          setInterval(loadLeads, 30000);
        </script>
      </body>
      </html>
    `);
  });

  // CSV Export endpoint with access key protection
  app.get("/adminlist/export", async (req, res) => {
    // Simple access key protection
    const accessKey = req.query.key;
    if (accessKey !== "ahf2025secure") {
      res.status(404).send("Page not found");
      return;
    }
    try {
      const allLeads = await storage.getAllLeads();
      // Filter out temporary quiz-only records
      const realLeads = allLeads.filter(lead => 
        !lead.email.includes('quiz-') && 
        !lead.email.includes('@temp.com') &&
        lead.firstName !== 'Quiz Response'
      );
      
      // Create CSV headers
      let csv = "Date,Name,Email,Phone,Down Payment Need,Timeline,First Time Buyer,Credit Score,Income,Price Range,Quiz Down Payment Need\n";
      
      // Add lead data
      realLeads.forEach(lead => {
        const date = new Date(lead.createdAt).toLocaleDateString();
        const name = `${lead.firstName} ${lead.lastName}`;
        const quiz = lead.quizAnswers || {};
        
        csv += `"${date}","${name}","${lead.email}","${lead.phone}","${lead.downPaymentNeed}","${lead.timeline || ''}","${quiz.firstTimeBuyer || ''}","${quiz.creditScore || ''}","${quiz.income || ''}","${quiz.priceRange || ''}","${quiz.downPaymentNeed || ''}"\n`;
      });
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="arizona-home-first-leads.csv"');
      res.send(csv);
    } catch (error) {
      console.error("Export error:", error);
      res.status(500).send("Error generating export");
    }
  });

  // Quiz submission endpoint - now just validates and returns eligibility
  app.post("/api/quiz", async (req, res) => {
    try {
      const quizData = quizAnswerSchema.parse(req.body);
      
      // Calculate eligibility based on answers
      const isEligible = calculateEligibility(quizData);
      
      console.log(`Quiz submitted - Eligible: ${isEligible}`);
      
      res.json({
        success: true,
        eligible: isEligible,
        quizData: quizData, // Return quiz data to frontend for use in lead submission
        message: isEligible 
          ? "Great News! Based on your answers, you may qualify for up to $10,000 in homebuyer credits."
          : "Thank you for your interest. Our team will contact you to discuss available options."
      });
    } catch (error) {
      console.error("Quiz submission error:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to process quiz results" 
      });
    }
  });

  // Analytics API endpoint
  app.get("/api/analytics", async (req, res) => {
    try {
      const stats = await sendGridAnalytics.getGlobalStats(
        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        new Date().toISOString().split('T')[0]
      );
      
      if (stats) {
        const metrics = sendGridAnalytics.calculateMetrics(stats);
        res.json({
          success: true,
          stats,
          metrics
        });
      } else {
        res.json({
          success: false,
          message: "Unable to fetch analytics data"
        });
      }
    } catch (error) {
      res.json({
        success: false,
        message: "Analytics unavailable",
        error: error.message
      });
    }
  });

  // Twilio call instructions endpoint (for manual reference)
  app.get("/api/twilio/instructions/:leadId", (req, res) => {
    try {
      const leadId = req.params.leadId;
      const lead = storage.getLeadById(leadId);
      
      if (!lead) {
        return res.status(404).json({ error: "Lead not found" });
      }

      const instructions = getLeadCallInstructions({
        firstName: lead.firstName,
        lastName: lead.lastName,
        phone: lead.phone,
        email: lead.email,
        timestamp: lead.submittedAt.toISOString()
      });

      res.json({
        success: true,
        leadId,
        instructions
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to generate instructions" });
    }
  });

  // Test call center integration endpoint
  app.post("/api/test/callcenter", async (req, res) => {
    try {
      console.log('Testing call center integration...');
      await testCallCenterIntegration();
      res.json({ success: true, message: "Call center test completed - check console logs" });
    } catch (error) {
      console.error('Call center test failed:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Bulk push existing leads to call center
  app.post("/api/callcenter/bulk-push", async (req, res) => {
    try {
      const allLeads = await storage.getAllLeads();
      
      console.log(`Found ${allLeads.length} leads to push to call center`);
      
      await bulkPushLeadsToCallCenter(allLeads);
      
      res.json({ 
        success: true, 
        message: `Successfully initiated bulk push of ${allLeads.length} leads to call center`,
        pushedLeads: allLeads.length
      });
    } catch (error) {
      console.error('Bulk push failed:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Scheduler status API endpoint
  app.get("/api/scheduler/status", (req, res) => {
    try {
      const allScheduled = emailScheduler.getAllScheduledEmails();
      let totalScheduled = 0;
      let totalSent = 0;
      let totalPending = 0;

      allScheduled.forEach(lead => {
        lead.emails.forEach(email => {
          totalScheduled++;
          if (email.sent) {
            totalSent++;
          } else {
            totalPending++;
          }
        });
      });

      res.json({
        success: true,
        totalScheduled,
        totalSent,
        totalPending,
        activeLeads: allScheduled.length
      });
    } catch (error) {
      res.json({
        success: false,
        message: "Unable to get scheduler status",
        error: error.message
      });
    }
  });

  // Email campaigns management page
  app.get("/adminlist/campaigns", (req, res) => {
    // Simple access key protection
    const accessKey = req.query.key;
    if (accessKey !== "ahf2025secure") {
      res.status(404).send("Page not found");
      return;
    }
    
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Arizona Home First - Email Campaigns</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
          .header { background: #f5f5f5; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
          .campaign { border: 1px solid #ddd; margin: 10px 0; padding: 15px; border-radius: 5px; }
          .campaign h3 { color: #1a73e8; margin-top: 0; }
          .timeline { color: #666; font-size: 14px; }
          .content-preview { background: #f9f9f9; padding: 10px; margin: 10px 0; border-left: 4px solid #1a73e8; }
          .back-link { color: #1a73e8; text-decoration: none; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Arizona Home First - Email Campaign System</h1>
          <p><a href="/adminlist?key=ahf2025secure" class="back-link">← Back to Lead Dashboard</a></p>
          <p><strong>Status:</strong> ✅ Drip Campaign Active - 48 emails over 24 months</p>
          <p><strong>System:</strong> Welcome email sent immediately when leads register, followed by biweekly homebuying tips</p>
        </div>
        
        <div class="campaign">
          <h3>📧 Campaign Overview</h3>
          <p><strong>Total Emails:</strong> 48 campaigns (24 months, every 2 weeks)</p>
          <p><strong>Topics Covered:</strong></p>
          <ul>
            <li>Welcome & Introduction (Week 0)</li>
            <li>Arizona Market Updates (Week 2)</li>
            <li>Pre-approval Process (Week 4)</li>
            <li>Hidden Costs & Budgeting (Week 6)</li>
            <li>Neighborhood Guides (Week 8)</li>
            <li>Arizona Home Features (Week 10)</li>
            <li>Offer Strategies (Week 12)</li>
            <li>Home Inspections (Week 14)</li>
            <li>Closing Process (Week 16)</li>
            <li>New Home Setup (Week 18)</li>
            <li>Building Equity (Week 20)</li>
            <li>Tax Benefits (Week 22)</li>
            <li>Seasonal Maintenance (Week 24)</li>
            <li>Outdoor Living (Week 26)</li>
            <li>Energy Efficiency (Week 28)</li>
            <li>...and 33 more topics through Week 96</li>
          </ul>
        </div>
        
        <div class="campaign">
          <h3>🎯 Campaign Goals</h3>
          <ul>
            <li>Stay top-of-mind with prospects over 24 months</li>
            <li>Provide valuable Arizona-specific homebuying education</li>
            <li>Build trust through consistent, helpful content</li>
            <li>Position Arizona Home First as the local expert</li>
            <li>Generate referrals and repeat business</li>
          </ul>
        </div>
        
        <div class="campaign">
          <h3>📊 Campaign Performance</h3>
          <div id="analytics-container">
            <p>Loading analytics...</p>
          </div>
        </div>
        
        <div class="campaign">
          <h3>🔧 System Details</h3>
          <p><strong>Email Service:</strong> SendGrid</p>
          <p><strong>From Address:</strong> info@arizonahomefirst.org</p>
          <p><strong>Reply Address:</strong> estebanholman@gmail.com</p>
          <p><strong>Personalization:</strong> {{firstName}} variables</p>
          <p><strong>Content Format:</strong> Text and HTML versions</p>
        </div>
        
        <div class="campaign">
          <h3>✅ System Status</h3>
          <div id="system-status">
            <p>Loading system status...</p>
          </div>
        </div>

        <script>
          async function loadAnalytics() {
            try {
              const analyticsResponse = await fetch('/api/analytics');
              const analytics = await analyticsResponse.json();
              
              const statusResponse = await fetch('/api/scheduler/status');
              const status = await statusResponse.json();
              
              // Update analytics section
              const analyticsContainer = document.getElementById('analytics-container');
              if (analytics.success && analytics.stats) {
                const stats = analytics.stats;
                analyticsContainer.innerHTML = \`
                  <p><strong>Last 30 Days Performance:</strong></p>
                  <ul>
                    <li>Total Emails Sent: \${stats.delivered + stats.bounces}</li>
                    <li>Delivery Rate: \${analytics.metrics.deliveryRate}%</li>
                    <li>Open Rate: \${analytics.metrics.openRate}%</li>
                    <li>Click Rate: \${analytics.metrics.clickRate}%</li>
                    <li>Bounce Rate: \${analytics.metrics.bounceRate}%</li>
                  </ul>
                  <p><em>Data from SendGrid Analytics API</em></p>
                \`;
              } else {
                analyticsContainer.innerHTML = '<p>Analytics data unavailable. Check SendGrid API configuration.</p>';
              }
              
              // Update system status
              const statusContainer = document.getElementById('system-status');
              if (status.success) {
                statusContainer.innerHTML = \`
                  <p><strong>✅ Scheduling System:</strong> Active - checking every hour</p>
                  <p><strong>📧 Welcome Emails:</strong> Sent immediately on registration</p>
                  <p><strong>⏰ Scheduled Campaigns:</strong> \${status.totalScheduled} emails queued</p>
                  <p><strong>📬 Delivered Campaigns:</strong> \${status.totalSent} emails sent</p>
                  <p><strong>⏳ Pending Campaigns:</strong> \${status.totalPending} emails pending</p>
                \`;
              } else {
                statusContainer.innerHTML = '<p>Unable to load system status</p>';
              }
              
            } catch (error) {
              console.error('Failed to load analytics:', error);
              document.getElementById('analytics-container').innerHTML = '<p>Failed to load analytics data</p>';
              document.getElementById('system-status').innerHTML = '<p>Failed to load system status</p>';
            }
          }
          
          loadAnalytics();
          // Refresh every 5 minutes
          setInterval(loadAnalytics, 5 * 60 * 1000);
        </script>
      </body>
      </html>
    `);
  });

  const httpServer = createServer(app);
  return httpServer;
}

function calculateEligibility(quizData: any): boolean {
  // Simple eligibility logic - can be enhanced
  const creditScore = quizData.creditScore;
  const income = quizData.income;
  
  // Basic qualification criteria
  if (creditScore === 'below-620' || income === 'below-50k') {
    return false;
  }
  
  return true;
}
