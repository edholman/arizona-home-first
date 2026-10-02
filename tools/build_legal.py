"""Generate privacy.html, terms.html, CNAME, robots.txt, sitemap.xml for arizonahomefirst.org.
Run from the repo root: python tools/build_legal.py
"""
HEAD = '''<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>%(title)s | Arizona Home First</title>
  <meta name="description" content="%(desc)s">
  <link rel="canonical" href="https://arizonahomefirst.org/%(slug)s">
  <link rel="icon" type="image/png" sizes="192x192" href="/assets/favicon-192.png?v=1">
  <link rel="icon" href="/favicon.ico?v=1" sizes="48x48">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/assets/site.css?v=1">
  <style>.legal h2{text-align:left;font-size:1.3rem;margin-top:2rem}.legal{padding:3rem 0 4rem}.legal p,.legal li{color:#3b4449}</style>
</head>
<body>
<header class="site-header"><div class="wrap"><a class="brand" href="/"><img class="brand-mark" src="/assets/favicon-192.png?v=1" alt="" width="34" height="34"><b class="brand-name">Arizona Home <span>First</span></b></a></div></header>
<main class="legal"><div class="wrap narrow">
<h1>%(title)s</h1>
<p class="fine">Last updated September 30, 2026</p>
'''
FOOT = '''</div></main>
<footer><div class="wrap"><div class="footer-links"><a href="/">Home</a><a href="/privacy.html">Privacy Policy</a><a href="/terms.html">Terms</a></div>
<div class="disclosures"><p>Arizona Home First is a private homebuyer program and is not a government agency. Real estate services are provided by independent, licensed real estate agents in our partner network. Mortgage lending is provided by Loan Factory, Inc., NMLS #320841. Equal Housing Opportunity.</p><p>&copy; 2026 Arizona Home First</p></div></div></footer>
</body>
</html>
'''

PRIVACY = '''
<p>This Privacy Policy explains how Arizona Home First ("we," "us," or "our") collects, uses, and shares information when you use arizonahomefirst.org or communicate with us, including by text message.</p>

<h2>Information we collect</h2>
<ul>
<li><strong>Information you provide:</strong> your name, phone number, email address, and answers you give in our eligibility quiz or forms, such as your timeline, price range, estimated credit range, and income range.</li>
<li><strong>Consent records:</strong> whether you agreed to receive calls and texts, the wording you agreed to, and when.</li>
<li><strong>Technical and marketing data:</strong> the page you submitted from, advertising and campaign identifiers (such as click IDs and UTM tags), and general device and usage information collected through cookies and similar tools.</li>
<li><strong>Site analytics:</strong> we use analytics tools, including Microsoft Clarity and Google, to understand how visitors use our site, such as clicks, scrolling, and quiz steps. These tools may use cookies and may record anonymized session activity; information you type into forms is masked and not recorded by these tools.</li>
</ul>

<h2>How we use your information</h2>
<ul>
<li>To respond to your inquiry and connect you with a licensed real estate agent in our partner network and with our program lender.</li>
<li>To contact you by phone, text, or email about your home purchase, as you requested.</li>
<li>To measure and improve our website and advertising.</li>
<li>To comply with legal and regulatory requirements.</li>
</ul>

<h2>How we share your information</h2>
<p>We share your information only as needed to help with your home purchase: with licensed real estate agents in our partner network, with our program lender, Loan Factory, Inc., and with service providers who help us operate, such as text messaging and customer relationship management platforms. We may also share information when required by law. <strong>We do not sell your personal information.</strong></p>

<h2>Text messaging</h2>
<p>If you opt in, you agree to receive calls and text messages from Arizona Home First, its partner real estate agents, and Loan Factory, Inc. about your home purchase, which may include messages sent using automated technology. Consent is not a condition of purchase. Message frequency varies. Message and data rates may apply. Reply <strong>STOP</strong> at any time to opt out, or <strong>HELP</strong> for help.</p>
<p>No mobile information will be shared with third parties or affiliates for their own marketing or promotional purposes. Text messaging opt-in data and consent will not be shared with any third parties, except with the partner agents, program lender, and service providers described above to respond to your request.</p>

<h2>Your choices</h2>
<ul>
<li>Opt out of texts by replying STOP, and of emails by using the unsubscribe link.</li>
<li>Request access to or deletion of your information by contacting us, subject to legal and recordkeeping obligations.</li>
</ul>

<h2>Security</h2>
<p>We use reasonable safeguards to protect your information. No method of transmission or storage is completely secure.</p>

<h2>Changes</h2>
<p>We may update this policy from time to time. The date at the top shows when it was last updated.</p>
'''

TERMS = '''
<p>By using arizonahomefirst.org, you agree to these terms.</p>

<h2>About the program</h2>
<p>Arizona Home First is a private homebuyer program that connects buyers with licensed real estate agents and a licensed mortgage lender. It is not a government agency or government assistance program. We are not a lender and do not make loans; mortgage lending is provided by Loan Factory, Inc., NMLS #320841.</p>

<h2>No guarantee of credits or approval</h2>
<p>Eligibility quiz results and calculator figures are estimates for illustration only and are not an offer, commitment to lend, or guarantee of any credit. Credits are subject to lender approval, loan program guidelines and limits on credits, the terms of your written agreement with your real estate agent, and must be disclosed on your closing statement. Not all buyers will qualify.</p>

<h2>Your choice of providers</h2>
<p>You are always free to choose your own real estate agent and lender. When a licensed professional acts as both your agent and loan officer, you will receive a written dual capacity disclosure and agreement before proceeding.</p>

<h2>Text messaging</h2>
<p>By opting in, you agree to receive calls and text messages as described in our <a href="/privacy.html">Privacy Policy</a>. Reply STOP to opt out or HELP for help. Message and data rates may apply. Message frequency varies.</p>

<h2>No professional advice</h2>
<p>Information on this site is general and is not legal, tax, or financial advice. Consult licensed professionals about your situation.</p>

<h2>Limitation of liability</h2>
<p>This site is provided "as is." To the fullest extent permitted by law, Arizona Home First is not liable for any damages arising from your use of the site.</p>

<h2>Changes</h2>
<p>We may update these terms at any time. Continued use of the site means you accept the updated terms.</p>
'''

pages = [
    ('privacy.html', HEAD % dict(title='Privacy Policy', desc='How Arizona Home First collects, uses, and protects your information, including text messaging.', slug='privacy.html') + PRIVACY + FOOT),
    ('terms.html', HEAD % dict(title='Terms of Use', desc='Terms for using the Arizona Home First website and program.', slug='terms.html') + TERMS + FOOT),
]
for name, content in pages:
    assert all(ord(c) < 128 for c in content) and chr(0x2014) not in content and chr(0x2013) not in content
    open(name, 'w', encoding='ascii', newline='\n').write(content)

open('CNAME', 'w', newline='\n').write('arizonahomefirst.org\n')
open('robots.txt', 'w', newline='\n').write('User-agent: *\nAllow: /\n\nSitemap: https://arizonahomefirst.org/sitemap.xml\n')
open('sitemap.xml', 'w', newline='\n').write('''<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://arizonahomefirst.org/</loc><lastmod>2026-09-30</lastmod><priority>1.0</priority></url>
  <url><loc>https://arizonahomefirst.org/privacy.html</loc><lastmod>2026-09-30</lastmod><priority>0.3</priority></url>
  <url><loc>https://arizonahomefirst.org/terms.html</loc><lastmod>2026-09-30</lastmod><priority>0.3</priority></url>
</urlset>
''')
print('privacy.html, terms.html, CNAME, robots.txt, sitemap.xml written')
