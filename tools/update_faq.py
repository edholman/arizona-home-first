"""Replace the FAQ (visible + FAQPage schema) with positive, benefit-led questions.
Run from the repo root: python tools/update_faq.py
"""
import json, re

FAQ = [
    ('How much assistance can I get?',
     'Qualified buyers may receive up to $10,000 or more, depending on the home price and loan. For example, a $510,000 home works out to about $10,000 and a $400,000 home to about $7,860. Use the calculator above to see your number.'),
    ('Who qualifies?',
     'The program is built for first time homebuyers in Arizona. Buyers with a credit score of 620 or higher and steady income are often a great fit. Take the one minute quiz to see where you stand.'),
    ('Can I combine it with other assistance programs?',
     'Yes. Our assistance can be stacked with popular Arizona down payment assistance programs like HOME Plus and Home in Five, so you can cover more of your upfront costs.'),
    ('What can I use the assistance for?',
     'Your assistance is applied at closing to lower the cash you need to buy, covering things like closing costs and prepaid items, or it can be used to buy down your interest rate for a lower monthly payment.'),
    ('How fast will I hear back?',
     'Usually within minutes. After you submit your info, a licensed professional will text you to go over your options. If you reach out after 9 PM, expect a message first thing in the morning.'),
    ('Does checking my eligibility affect my credit?',
     'No. Checking your eligibility is free and has no impact on your credit score.'),
]

p = 'index.html'
s = open(p, encoding='ascii').read()

schema = {'@context': 'https://schema.org', '@type': 'FAQPage',
          'mainEntity': [{'@type': 'Question', 'name': q, 'acceptedAnswer': {'@type': 'Answer', 'text': a}} for q, a in FAQ]}
blocks = list(re.finditer(r'  <script type="application/ld\+json">\n(.*?)\n  </script>', s, re.S))
faq_block = [m for m in blocks if '"FAQPage"' in m.group(1)]
assert len(faq_block) == 1
m = faq_block[0]
s = s[:m.start(1)] + '\n'.join('  ' + line for line in json.dumps(schema, indent=2).split('\n')) + s[m.end(1):]

a = s.index('    <h2>Frequently Asked Questions</h2>\n')
b = s.index('  </div>\n</section>', a)
visible = '    <h2>Frequently Asked Questions</h2>\n' + ''.join(
    '    <details><summary>%s</summary><p>%s</p></details>\n' % (q, a_) for q, a_ in FAQ)
s = s[:a] + visible + s[b:]

old_h2 = '<h2>How Your Closing Cost Credits Work</h2>'
assert s.count(old_h2) == 1
s = s.replace(old_h2, '<h2>How Your Homebuyer Assistance Works</h2>')

old_fn = 'amounts vary by home price, loan, and program guidelines. Not all buyers will qualify.</p>'
assert s.count(old_fn) == 1
s = s.replace(old_fn, 'amounts vary by home price, loan, and program guidelines. Assistance is applied toward closing costs, prepaid items, or a rate buydown within loan program limits and is not applied toward the down payment. Not all buyers will qualify.</p>')

assert all(ord(c) < 128 for c in s) and chr(0x2014) not in s and chr(0x2013) not in s
for blk in re.findall(r'<script type="application/ld\+json">(.*?)</script>', s, re.S):
    json.loads(blk)
open(p, 'w', encoding='ascii', newline='\n').write(s)
print('FAQ replaced with %d positive questions; section retitled; footer covers down payment use' % len(FAQ))
