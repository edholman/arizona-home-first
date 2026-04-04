import { MailService } from '@sendgrid/mail';

let mailService: MailService | null = null;

function initializeCampaignEmailService() {
  if (!process.env.SENDGRID_API_KEY) {
    console.log("SendGrid API key not found - drip campaigns disabled");
    return;
  }

  mailService = new MailService();
  mailService.setApiKey(process.env.SENDGRID_API_KEY);
}

// Initialize on module load
initializeCampaignEmailService();

interface EmailCampaign {
  id: number;
  subject: string;
  content: string;
  weeksSinceRegistration: number;
}

// 24-month biweekly email campaign (48 emails total)
export const emailCampaigns: EmailCampaign[] = [
  {
    id: 1,
    subject: "Welcome to Arizona Home First - Your Homebuying Journey Begins!",
    content: `
Hi {{firstName}},

Welcome to Arizona Home First! We're thrilled you've taken the first step toward homeownership in Arizona.

Over the next few months, we'll be sharing valuable insights, tips, and market updates to help you navigate your homebuying journey with confidence.

What to expect from us:
• Market insights specific to Arizona
• Homebuying tips and strategies
• Mortgage and financing guidance
• Updates on down payment assistance programs

Your next steps:
1. Lookout for a call from one of our network partners
2. Start researching neighborhoods that interest you
3. Begin gathering financial documents

Remember, Arizona's market moves quickly, so staying informed is key to success.

Best regards,
The Arizona Home First Team

P.S. Reply to this email anytime with questions - we're here to help!
    `,
    weeksSinceRegistration: 0
  },
  {
    id: 2,
    subject: "Arizona Home Market Update - What You Need to Know",
    content: `
Hi {{firstName}},

Arizona's real estate market continues to evolve. Here's what first-time buyers should know:

📊 Current Market Trends:
• Median home prices in Arizona: $420,000-$450,000
• Inventory levels are stabilizing
• Interest rates affecting buyer demand
• Best buying opportunities in emerging neighborhoods

🏡 Top Arizona Cities for First-Time Buyers:
• Gilbert - Family-friendly with great schools
• Chandler - Tech hub with growing job market
• Goodyear - Affordable with new developments
• Queen Creek - Fastest growing community

💡 Pro Tip: Consider homes slightly outside major metros for better value. You might find 20-30% savings just 15 minutes from downtown areas.

Next week: We'll cover the pre-approval process and why it's crucial in Arizona's competitive market.

Happy house hunting!
Arizona Home First Team
    `,
    weeksSinceRegistration: 2
  },
  {
    id: 3,
    subject: "The Power of Pre-Approval: Your Competitive Edge",
    content: `
Hi {{firstName}},

In Arizona's fast-moving market, pre-approval isn't optional - it's essential.

🎯 Why Pre-Approval Matters:
• Shows sellers you're a serious buyer
• Helps you act quickly on good properties
• Reveals your true budget before you fall in love with a home
• Often required just to view homes in competitive areas

📋 Documents You'll Need:
• 2 years of tax returns
• 2 most recent pay stubs
• 2 months of bank statements
• Employment verification letter
• List of debts and monthly payments

💰 Arizona-Specific Loan Programs:
• Conventional loans (as low as 3% down)
• FHA loans (3.5% down)
• VA loans (0% down for veterans)
• USDA loans (0% down in rural areas)
• Arizona Housing Finance Authority programs

🚀 Action Step: Start gathering these documents now. The pre-approval process typically takes 3-5 business days.

Questions about loan programs? Reply to this email - we're connected with top Arizona lenders who specialize in first-time buyer programs.

Best,
Arizona Home First Team
    `,
    weeksSinceRegistration: 4
  },
  {
    id: 4,
    subject: "Hidden Costs Every Arizona Homebuyer Should Budget For",
    content: `
Hi {{firstName}},

Beyond your down payment, there are several costs Arizona buyers should plan for:

💲 Upfront Costs:
• Home inspection: $400-$600
• Appraisal: $400-$500
• Title insurance: $800-$1,200
• Homeowner's insurance: $1,200-$2,000/year
• HOA fees: $50-$300/month (common in Arizona)

🏠 Arizona-Specific Considerations:
• Pool maintenance: $100-$200/month
• Higher cooling costs: $200-$400/month in summer
• Desert landscaping: $3,000-$8,000 initial cost
• Termite inspection: $75-$150 (required in Arizona)

📊 The 1% Rule:
Budget 1% of your home's value annually for maintenance. On a $400,000 home, that's $4,000/year or $333/month.

💡 Money-Saving Tips:
• Shop around for homeowner's insurance
• Consider newer builds with warranties
• Factor utilities into your monthly budget
• Research HOA fees and services before buying

Coming up: We'll explore the best Arizona neighborhoods for different budgets and lifestyles.

Planning ahead,
Arizona Home First Team
    `,
    weeksSinceRegistration: 6
  },
  {
    id: 5,
    subject: "Arizona Neighborhood Guide: Finding Your Perfect Match",
    content: `
Hi {{firstName}},

Choosing the right neighborhood is just as important as finding the right house. Here's your Arizona guide:

🌟 Phoenix Metro Areas:

**Scottsdale** ($500K-$800K+)
• Upscale dining and shopping
• Golf courses and resorts
• Excellent schools
• Higher property taxes

**Tempe** ($350K-$550K)
• Home to ASU
• Vibrant nightlife
• Light rail access
• Growing tech scene

**Mesa** ($300K-$450K)
• Family-friendly
• More affordable than Phoenix
• Good schools
• Growing arts district

**Surprise** ($250K-$400K)
• Great for retirees and families
• Lower cost of living
• Spring training baseball
• Planned communities

🏡 Tucson Areas:

**Oro Valley** ($350K-$600K)
• Top-rated schools
• Resort lifestyle
• Lower crime rates
• Beautiful mountain views

**Marana** ($250K-$450K)
• Fast-growing
• New developments
• More affordable
• Family-oriented

🔍 Research Tools:
• GreatSchools.org for school ratings
• Neighborhood Scout for safety data
• Walk Score for walkability
• City websites for planned developments

Next time: Understanding Arizona's unique home features and what to look for during showings.

Exploring together,
Arizona Home First Team
    `,
    weeksSinceRegistration: 8
  },
  {
    id: 6,
    subject: "Arizona Home Features: What Makes Desert Living Special",
    content: `
Hi {{firstName}},

Arizona homes have unique features designed for desert living. Here's what to look for:

🏠 Essential Arizona Features:

**Cooling Systems:**
• Dual-zone HVAC (upstairs/downstairs)
• Energy-efficient windows (Low-E coating)
• Proper insulation (R-30+ in attics)
• Ceiling fans in every room

**Outdoor Living:**
• Covered patios (essential for summer)
• Pool/spa (in 60% of Arizona homes)
• Desert landscaping (low water usage)
• Outdoor kitchens/fire features

**Water Efficiency:**
• Tankless water heaters
• Low-flow fixtures
• Drip irrigation systems
• Artificial turf options

⚠️ Red Flags to Watch:
• Old single-pane windows
• Outdated HVAC systems (15+ years)
• Poor drainage around foundation
• Cracked stucco or paint (sun damage)
• No shade over windows/patios

💡 Arizona Home Inspection Priorities:
• Roof condition (sun/monsoon damage)
• HVAC efficiency and age
• Pool equipment functionality
• Drainage and grading
• Electrical panel capacity

🌵 Bonus Tip: Homes with mature desert landscaping can save you $5,000-$15,000 in initial yard costs.

Coming up: Navigating Arizona's offer process and negotiation strategies.

Desert living experts,
Arizona Home First Team
    `,
    weeksSinceRegistration: 10
  },
  {
    id: 7,
    subject: "Making Winning Offers in Arizona's Competitive Market",
    content: `
Hi {{firstName}},

Ready to make an offer? Arizona's market requires strategy and preparation.

🎯 Offer Strategy Basics:

**Know Your Numbers:**
• Maximum budget (including all costs)
• Comparable sales in the area
• Days on market for similar homes
• Local market conditions

**Competitive Offer Elements:**
• Offer price (often at or above asking)
• Earnest money (1-3% of purchase price)
• Down payment amount
• Closing timeline
• Inspection contingencies

🏆 Making Your Offer Stand Out:

**Financial Strength:**
• Pre-approval letter attached
• Larger earnest money deposit
• Proof of down payment funds
• Cash-equivalent terms

**Seller-Friendly Terms:**
• Flexible closing date
• Rent-back agreements if needed
• Limited inspection contingencies
• As-is consideration for minor issues

⚡ Arizona-Specific Tips:
• Act fast - good homes sell in days
• Consider summer purchases for better prices
• Understand monsoon season timing
• Factor in move-in costs during hot months

📝 Common Contingencies:
• Financing contingency (30-45 days)
• Inspection contingency (7-10 days)
• Appraisal contingency
• HOA document review

Next week: The ins and outs of home inspections in Arizona.

Your offer advocates,
Arizona Home First Team
    `,
    weeksSinceRegistration: 12
  },
  {
    id: 8,
    subject: "Arizona Home Inspections: What You Need to Know",
    content: `
Hi {{firstName}},

Home inspections in Arizona have unique considerations due to our desert climate.

🔍 Standard Inspection Areas:
• Structural integrity
• Electrical systems
• Plumbing
• HVAC systems
• Roofing
• Interior/exterior conditions

🌵 Arizona-Specific Inspection Focus:

**Roof Systems:**
• Tile damage from monsoons
• Proper flashing around penetrations
• Gutter and downspout condition
• Adequate attic ventilation

**HVAC Efficiency:**
• System age and maintenance
• Ductwork condition and sealing
• Proper sizing for home
• Filter access and type

**Water & Plumbing:**
• Hard water damage
• Proper grading for drainage
• Pool equipment functionality
• Irrigation system operation

**Structural Concerns:**
• Foundation settling in clay soil
• Stucco cracking from heat
• Window/door seal integrity
• Proper expansion joints

💰 Typical Inspection Costs:
• Standard inspection: $400-$600
• Pool/spa inspection: $150-$250
• Termite inspection: $75-$150
• Sewer scope: $200-$300

🚩 Deal Breakers vs. Negotiable Items:
**Major concerns:** HVAC failure, roof replacement needed, electrical hazards
**Minor items:** Cosmetic issues, minor repairs under $500

📅 Timeline: You typically have 7-10 days for inspections and negotiations.

Coming up: Understanding Arizona's closing process and what to expect.

Your inspection guides,
Arizona Home First Team
    `,
    weeksSinceRegistration: 14
  },
  {
    id: 9,
    subject: "The Arizona Closing Process: Your Final Steps to Homeownership",
    content: `
Hi {{firstName}},

You're getting closer! Here's what to expect during closing in Arizona.

📅 Closing Timeline (Typically 30-45 days):

**Weeks 1-2 Post-Contract:**
• Loan application submitted
• Home inspection completed
• Appraisal ordered
• Title search initiated

**Weeks 3-4:**
• Loan processing and underwriting
• Insurance quotes and binding
• Final loan approval
• Closing date confirmed

**Final Week:**
• Final walk-through
• Closing document review
• Wire transfer preparation
• Keys handed over!

💰 Closing Cost Breakdown:
• Loan origination fees: 0.5-1% of loan
• Title insurance: $800-$1,200
• Recording fees: $50-$150
• Attorney/closing fees: $300-$800
• Prepaid taxes and insurance: varies

🏠 Arizona Closing Requirements:
• Valid photo ID
• Certified funds for closing costs
• Homeowner's insurance proof
• Final walk-through completion

⚠️ Last-Minute Tips:
• Don't make major purchases before closing
• Keep employment status stable
• Maintain bank account balances
• Respond quickly to lender requests

🎉 After Closing:
• Change locks immediately
• Transfer utilities to your name
• Update address with postal service
• Register for local services

Next time: Setting up your new Arizona home for success.

Almost there,
Arizona Home First Team
    `,
    weeksSinceRegistration: 16
  },
  {
    id: 10,
    subject: "Congratulations! Setting Up Your New Arizona Home",
    content: `
Hi {{firstName}},

Congratulations on your new home! Here's how to get settled in Arizona.

🏡 Immediate Priorities:

**Safety & Security:**
• Change all locks and garage codes
• Test smoke and carbon monoxide detectors
• Locate main water and electrical shutoffs
• Program emergency numbers

**Utilities & Services:**
• Transfer/setup electricity (APS or SRP)
• Connect water and sewer
• Set up internet and cable
• Arrange trash and recycling pickup

**Arizona-Specific Setup:**

**Cooling Preparation:**
• Schedule HVAC maintenance
• Change air filters
• Program thermostat efficiently
• Check window seals and weatherstripping

**Outdoor Preparation:**
• Set up irrigation timers
• Plan desert landscaping
• Install shade structures
• Prepare pool for use (if applicable)

💡 Money-Saving Tips:
• Sign up for time-of-use electricity rates
• Install programmable thermostats
• Use ceiling fans to circulate air
• Plant shade trees on west/south sides

📋 First Month Checklist:
• Register to vote
• Find local healthcare providers
• Locate nearest grocery stores
• Join neighborhood groups/HOA
• Research local restaurants and activities

🌟 Welcome to Arizona living! You're now part of a community that enjoys 300+ days of sunshine yearly.

Next week: Building equity and protecting your investment.

Your Arizona neighbors,
Arizona Home First Team
    `,
    weeksSinceRegistration: 18
  }
];

// Function to send drip campaign emails
export async function sendDripCampaignEmail(
  leadEmail: string,
  leadFirstName: string,
  weeksSinceRegistration: number
) {
  if (!mailService) {
    console.log("Email service not initialized - skipping drip campaign");
    return false;
  }

  const campaign = emailCampaigns.find(c => c.weeksSinceRegistration === weeksSinceRegistration);
  
  if (!campaign) {
    console.log(`No campaign found for week ${weeksSinceRegistration}`);
    return false;
  }

  try {
    // Replace template variables
    const personalizedContent = campaign.content.replace(/{{firstName}}/g, leadFirstName);

    await mailService.send({
      to: leadEmail,
      from: 'info@arizonahomefirst.org',
      replyTo: 'estebanholman@gmail.com',
      subject: campaign.subject,
      text: personalizedContent,
      html: personalizedContent.replace(/\n/g, '<br>'),
    });

    console.log(`Drip campaign email sent to ${leadEmail}: ${campaign.subject}`);
    return true;
  } catch (error) {
    console.error(`Failed to send drip campaign email to ${leadEmail}:`, error);
    return false;
  }
}

// Function to get all campaigns for reference
export function getAllCampaigns(): EmailCampaign[] {
  return emailCampaigns;
}