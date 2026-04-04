// Twilio integration for delayed lead calling
export interface TwilioLeadData {
  name: string;
  phone: string;
  email: string;
  timestamp: string;
}

export async function scheduleDelayedCall(leadData: TwilioLeadData, delayMinutes: number = 3): Promise<boolean> {
  try {
    // Schedule the call to happen after the delay
    setTimeout(() => {
      sendLeadToTwilio(leadData);
    }, delayMinutes * 60 * 1000); // Convert minutes to milliseconds
    
    console.log(`📞 Twilio call scheduled for ${delayMinutes} minutes from now for lead: ${leadData.name}`);
    return true;
  } catch (error) {
    console.error('Error scheduling delayed call:', error);
    return false;
  }
}

async function sendLeadToTwilio(leadData: TwilioLeadData): Promise<boolean> {
  try {
    // This will post to your Twilio webhook/service for connect call
    const twilioPayload = {
      lead_name: leadData.name,
      lead_phone: leadData.phone,
      lead_email: leadData.email,
      submitted_at: leadData.timestamp,
      source: "Arizona Home First",
      action: "connect_call",
      agent_phone: "(480) 526-4115", // Your business phone - Twilio calls this first
      flow_type: "warm_transfer" // Call agent first, then connect to lead
    };

    console.log('Lead data ready for Twilio:', twilioPayload);
    
    // Use Twilio REST API to make call to your phone
    const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID || 'process.env.TWILIO_ACCOUNT_SID';
    const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN || 'process.env.TWILIO_AUTH_TOKEN';
    const twimlBinUrl = process.env.TWIML_BIN_URL || 'https://handler.twilio.com/twiml/EH7a28527fff5abade957720bdf6525fe8';

    if (!twilioAccountSid) {
      console.log('⚠️  TWILIO_ACCOUNT_SID not set. Add your Twilio Account SID to environment variables.');
      console.log('For now, logging call instructions in console:');
      return false;
    }

    // Make Twilio API call to initiate call to YOUR phone
    const callUrl = twimlBinUrl + '?' + new URLSearchParams({
      LeadName: leadData.name,
      LeadPhone: leadData.phone,
      TwilioNumber: '4805269721'
    }).toString();

    const callPayload = {
      To: '+15208411628', // Your personal phone
      From: '+14805269721', // Your Twilio number  
      Url: callUrl,
      Method: 'GET'
    };

    const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Calls.json`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${twilioAccountSid}:${twilioAuthToken}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(callPayload).toString()
    });

    if (response.ok) {
      console.log(`✅ Twilio call initiated to (520) 841-1628 for lead: ${leadData.name}`);
      return true;
    } else {
      const error = await response.text();
      console.error('❌ Twilio API call failed:', response.status, error);
      return false;
    }

    return false;
  } catch (error) {
    console.error('Twilio integration error:', error);
    return false;
  }
}

// For manual testing/triggering
export function getLeadCallInstructions(leadData: TwilioLeadData): string {
  const firstName = leadData.name.split(' ')[0];
  return `
DELAYED LEAD CALL INSTRUCTIONS (3 MINUTES):

Lead Details:
- Name: ${leadData.name}
- Phone: ${leadData.phone}
- Email: ${leadData.email}
- Submitted: ${leadData.timestamp}
- Source: Arizona Home First Quiz

Twilio Call Flow (Auto-Dial in 3 minutes):
1. Twilio calls YOUR phone first: (520) 841-1628
2. When you answer, play: "New Arizona Home First lead: ${leadData.name}. Connecting you now."
3. After 3 seconds, Twilio automatically calls the lead: ${leadData.phone}
4. When lead answers, you're connected with Twilio number as caller ID
5. Lead sees incoming call from Twilio number, not your personal number

Call Script Opening:
"Hi ${firstName}, this is [Your Name] from Arizona Home First. I see you just completed our eligibility quiz for down payment assistance. I have some great news about your qualification status. Do you have 2 minutes to discuss your home buying goals?"

Twilio Payload Sent:
${JSON.stringify({
  lead_name: leadData.name,
  lead_phone: leadData.phone,
  lead_email: leadData.email,
  submitted_at: leadData.timestamp,
  source: "Arizona Home First",
  action: "connect_call",
  agent_phone: "(520) 841-1628",
  flow_type: "warm_transfer"
}, null, 2)}

Updated TwiML Bin Code (Auto-Dial After Name):

<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <!-- Announce lead info and auto-dial -->
  <Say voice="alice">New Arizona Home First lead: {{LeadName}} at {{LeadPhone}}. Connecting you now.</Say>
  <Pause length="2"/>
  
  <Dial callerId="+14805269721" timeout="30">
    <Number>{{LeadPhone}}</Number>
  </Dial>
  
  <Say voice="alice">Call completed.</Say>
</Response>
  
  <!-- Wait for your confirmation -->
  <Gather numDigits="1" timeout="15">
    <Say voice="alice">Press any key to call the lead now.</Say>
  </Gather>
  
  <!-- Step 2: Now dial the lead with your Twilio number as caller ID -->
  <Say voice="alice">Calling lead now.</Say>
  <Dial callerId="+14805269721" timeout="30">
    <Number>+1{{LeadPhone}}</Number>
  </Dial>
  
  <!-- If lead doesn't answer -->
  <Say voice="alice">Call completed.</Say>
</Response>

Setup:
1. Replace your existing TwiML Bin content with ONE of the above options
2. Configure (480) 526-9721 webhook to trigger when your system POSTs lead data
3. System calls your phone (520) 841-1628 first, then connects lead
  `;
}