import type { Lead, QuizAnswers } from "@shared/schema";

interface CallCenterLeadData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  city: string;
  state: string;
  notes?: string;
  source: string;
}

const CALL_CENTER_API_URL = "https://services.leadconnectorhq.com/hooks/CMnQw2d8rjfJTFai6MYC/webhook-trigger/ea068905-1ee1-40f4-9391-58a271f8f3b6";
const LEAD_SOURCE = "Arizona-Home-First";

export async function postToCallCenter(leadData: Lead): Promise<boolean> {
  try {
    // Split name into first and last, handle undefined cases
    const nameParts = leadData.name.trim().split(' ');
    const firstName = nameParts[0] || "undefined";
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : "undefined";

    const callCenterPayload: CallCenterLeadData = {
      firstName,
      lastName,
      email: leadData.email,
      phoneNumber: leadData.phone,
      city: "Phoenix", // Default to Phoenix since it's Arizona focused
      state: "AZ",
      notes: leadData.timeline ? `Timeline: ${leadData.timeline}` : "Timeline: Not specified",
      source: "Arizona Home First"
    };

    console.log('Posting lead to call center:', {
      leadId: leadData.id,
      name: leadData.name,
      payload: callCenterPayload
    });

    const response = await fetch(CALL_CENTER_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(callCenterPayload)
    });

    const responseText = await response.text();
    
    if (!response.ok) {
      throw new Error(`Call center API error: ${response.status} ${response.statusText}`);
    }

    // Check if response is JSON or HTML
    if (responseText.includes('<!DOCTYPE html>')) {
      console.log('Call center API returned HTML - endpoint may be incorrect or app not running');
      console.log('Response preview:', responseText.substring(0, 200) + '...');
      return false;
    }

    try {
      const result = JSON.parse(responseText);
      console.log('Call center integration SUCCESS:', result);
      return true;
    } catch (parseError) {
      console.log('Call center integration - unexpected response format:', responseText.substring(0, 200));
      return false;
    }

  } catch (error) {
    console.error('Call center integration ERROR:', error);
    return false;
  }
}

// Bulk push existing leads to call center
export async function bulkPushLeadsToCallCenter(leads: Lead[]): Promise<void> {
  console.log(`Starting bulk push of ${leads.length} leads to call center...`);
  
  for (const lead of leads) {
    console.log(`Pushing lead: ${lead.name} (${lead.email})`);
    const success = await postToCallCenter(lead);
    
    if (success) {
      console.log(`✅ Successfully pushed: ${lead.name}`);
    } else {
      console.log(`❌ Failed to push: ${lead.name}`);
    }
    
    // Small delay between requests to avoid overwhelming the API
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('Bulk push completed!');
}

// Test function for manual testing
export async function testCallCenterIntegration(): Promise<void> {
  const testLead: Lead = {
    id: "test-lead-123",
    name: "John Smith",
    email: "john.smith@email.com",
    phone: "6025551234",
    timeline: "3-6 months",
    quizAnswers: {
      firstTimeBuyer: "Yes",
      creditScore: "Good (670-739)",
      income: "$50,000 - $75,000",
      priceRange: "$300,000 - $400,000",
      downPaymentNeed: "5-10%"
    },
    createdAt: new Date()
  };

  console.log('Testing call center integration...');
  const success = await postToCallCenter(testLead);
  console.log('Test result:', success ? 'SUCCESS' : 'FAILED');
}