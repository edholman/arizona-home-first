/* Arizona Home First: eligibility quiz + savings calculator */
(function () {
  'use strict';

  /* ---------- funnel tracking (Microsoft Clarity + dataLayer + Google tag) ---------- */
  // Each step becomes a Clarity event (filter recordings by it) and a dataLayer/gtag event.
  function track(name, props) {
    props = props || {};
    try { if (typeof window.clarity === 'function') { window.clarity('event', name); Object.keys(props).forEach(function (k) { window.clarity('set', k, String(props[k])); }); } } catch (e) { /* ignore */ }
    try { (window.dataLayer = window.dataLayer || []).push(Object.assign({ event: 'azhf_' + name }, props)); } catch (e) { /* ignore */ }
    try { if (typeof window.gtag === 'function') window.gtag('event', 'azhf_' + name, props); } catch (e) { /* ignore */ }
  }
  window.azhfTrack = track;

  // Tag each session as paid (Google/Microsoft ad click) or organic, so Clarity recordings can be filtered by it.
  (function () {
    var q = new URLSearchParams(window.location.search);
    var paid = q.get('gclid') || q.get('gbraid') || q.get('wbraid') || q.get('msclkid') || /cpc|paid|ppc/i.test(q.get('utm_medium') || '');
    var ref = document.referrer, source = paid ? 'paid' : (ref ? (/google|bing|yahoo|duckduckgo/i.test(ref) ? 'organic_search' : 'referral') : 'direct');
    try { if (typeof window.clarity === 'function') window.clarity('set', 'traffic', source); } catch (e) { /* ignore */ }
    try { (window.dataLayer = window.dataLayer || []).push({ event: 'azhf_traffic', traffic: source }); } catch (e) { /* ignore */ }
  })();
  var once = {};
  function trackOnce(name, props) { if (!once[name]) { once[name] = true; track(name, props); } }

  /* ---------- eligibility screening ---------- */
  // Serious, lender-style questions. Everyone sees a result, but only after they enter their name and number.
  var QUESTIONS = [
    { key: 'owned_3yr', q: 'Have you owned a home, anywhere, in the past 3 years?',
      opts: [['no', 'No'], ['yes', 'Yes']] },
    { key: 'primary', q: 'Will this home be your primary residence?',
      opts: [['yes', 'Yes, I will live in it'], ['no', 'No, it is an investment or second home']] },
    { key: 'agent', q: 'Have you signed a buyer agreement with a real estate agent?',
      opts: [['no', 'No'], ['yes', 'Yes, I have signed one']] },
    { key: 'county', q: 'Where in Arizona are you buying?',
      opts: [['Maricopa', 'Maricopa County'], ['Pinal', 'Pinal County'], ['Pima', 'Pima County'], ['Other AZ', 'Another Arizona county']] },
    { key: 'credit', q: 'What is your estimated credit score?',
      opts: [['740+', '740 or higher'], ['680-739', '680 to 739'], ['620-679', '620 to 679'], ['580-619', '580 to 619'], ['below-580', 'Below 580']] },
    { key: 'derog', q: 'Any foreclosure, short sale, or bankruptcy in the past 3 years?',
      opts: [['no', 'No'], ['yes', 'Yes']] },
    { key: 'employment', q: 'Do you have 2 years of steady income history?',
      opts: [['w2', 'Yes, employed (W-2)'], ['self', 'Yes, self-employed or 1099'], ['less', 'Less than 2 years']] },
    { key: 'income', q: 'Is your total household income above $155,000 a year?',
      opts: [['no', 'No'], ['yes', 'Yes']] },
    { key: 'savings', q: 'Do you have at least 3.5% of the price saved, or a family member who can gift it?',
      opts: [['saved', 'Yes, saved'], ['gift', 'Yes, with a family gift'], ['no', 'Not yet']] },
    { key: 'timeline', q: 'When do you plan to buy?',
      opts: [['As soon as possible', 'As soon as possible'], ['Within 3 months', 'Within 3 months'], ['3 to 6 months', '3 to 6 months'], ['6 months or more', '6 months or more']] }
  ];
  var LABEL = {};
  QUESTIONS.forEach(function (q) { q.opts.forEach(function (o) { LABEL[q.key + ':' + o[0]] = o[1]; }); });

  var quiz = document.getElementById('quiz');
  if (quiz) {
    var answers = {}, step = 0;
    var bar = quiz.querySelector('.quiz-progress span');
    var body = quiz.querySelector('.quiz-body');

    function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

    function render() {
      bar.style.width = ((step + 1) / (QUESTIONS.length + 1) * 100) + '%';
      var q = QUESTIONS[step];
      body.innerHTML =
        '<div class="quiz-step-label">Eligibility screening &middot; Step ' + (step + 1) + ' of ' + QUESTIONS.length + '</div>' +
        '<h3>' + esc(q.q) + '</h3><div class="quiz-options">' +
        q.opts.map(function (o) { return '<button type="button" class="quiz-option" data-v="' + esc(o[0]) + '">' + esc(o[1]) + '</button>'; }).join('') +
        '</div>' + (step > 0 ? '<button type="button" class="quiz-back">&larr; Back</button>' : '');
      Array.prototype.forEach.call(body.querySelectorAll('.quiz-option'), function (b) {
        b.addEventListener('click', function () {
          if (step === 0) trackOnce('quiz_start');
          track('quiz_answer', { quiz_step: step + 1, quiz_question: q.key });
          answers[q.key] = b.getAttribute('data-v'); step++; step < QUESTIONS.length ? render() : finish();
        });
      });
      var back = body.querySelector('.quiz-back');
      if (back) back.addEventListener('click', function () { track('quiz_back', { quiz_step: step + 1 }); step--; render(); });
    }

    function finish() {
      bar.style.width = '100%';
      // Answers that need a specialist's look before we say "may qualify"
      var review = answers.owned_3yr === 'yes' || answers.primary === 'no' || answers.agent === 'yes';
      body.innerHTML =
        '<div class="quiz-result gate"><h3>Your screening is complete.</h3>' +
        '<p>Enter your name and mobile number to see your results and reserve your spot.</p>' +
        '<div class="quiz-form-slot"></div></div>';
      track('quiz_complete', { quiz_result: review ? 'needs_review' : 'likely' });

      // Move the form into the result, trimmed to name + phone + consent
      var card = document.querySelector('#get-started .lead-card');
      var slot = body.querySelector('.quiz-form-slot');
      if (card && slot) {
        var holder = document.createElement('div');
        holder.className = 'form-moved-note';
        holder.innerHTML = '<a class="btn btn-primary" href="#eligibility">See My Results</a>';
        card.parentNode.insertBefore(holder, card);
        slot.appendChild(card);
        card.classList.add('in-quiz');
        ['timeline', 'email'].forEach(function (n) {
          var el = card.querySelector('[name="' + n + '"]');
          if (!el) return;
          var wrap = el.closest('.span2') || el;
          wrap.style.display = 'none';
          var lbl = card.querySelector('label[for="' + el.id + '"]'); if (lbl) lbl.style.display = 'none';
        });
        var btn = card.querySelector('button[type="submit"]'); if (btn) btn.textContent = 'See My Results';
        var ok = card.querySelector('.lead-success');
        if (ok) ok.innerHTML = review
          ? '<strong>Thanks, your screening has been received.</strong><p>Some of your answers need a quick review. A program specialist will contact you shortly to go over your options.</p>'
          : '<strong>You may qualify for up to $10,000 in homebuyer assistance.</strong><p>Your spot is reserved. A program specialist will contact you shortly to confirm your eligibility and next steps.</p>';
      }
      if (quiz.getBoundingClientRect().top < 0) quiz.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Every qualify / waitlist button now goes to the form in the result
      Array.prototype.forEach.call(document.querySelectorAll('a[href="#eligibility"], a[href="#get-started"]'), function (a) {
        a.setAttribute('href', '#eligibility');
        if (/check|join|reserve/i.test(a.textContent)) a.textContent = 'See My Results';
      });
      // Hand every answer to the lead form so the CRM sees the full screening
      var form = document.querySelector('form.lead-form');
      if (form) {
        var set = function (name, val) { var el = form.querySelector('[name="' + name + '"]'); if (el) el.value = val; };
        set('timeline', answers.timeline || '');
        set('price_range', '');
        var summary = 'Screening: ' + QUESTIONS.map(function (q) {
          return q.key + ' ' + (LABEL[q.key + ':' + answers[q.key]] || '');
        }).join('; ') + '; result: ' + (review ? 'needs review' : 'may qualify');
        set('message', summary);
      }
    }
    render();
  }

  /* ---------- savings calculator ---------- */
  var price = document.getElementById('calc-price'), down = document.getElementById('calc-down');
  if (price && down) {
    var money = function (n) { return '$' + Math.round(n).toLocaleString('en-US'); };
    var calc = function () {
      var p = parseFloat(String(price.value).replace(/[^0-9.]/g, '')) || 0;
      var loan = p * (1 - (parseFloat(down.value) || 0) / 100);
      var lender = loan * 0.01, agent = p * 0.01;
      document.getElementById('calc-loan').textContent = money(loan);
      document.getElementById('calc-lender').textContent = money(lender);
      document.getElementById('calc-agent').textContent = money(agent);
      document.getElementById('calc-total').textContent = money(lender + agent);
    };
    price.addEventListener('input', function () { trackOnce('calculator_used'); calc(); });
    down.addEventListener('change', function () { trackOnce('calculator_used'); calc(); });
    price.addEventListener('blur', function () { var p = parseFloat(String(price.value).replace(/[^0-9.]/g, '')); if (p) price.value = Math.round(p).toLocaleString('en-US'); });
    calc();
  }

  /* ---------- form start + other waitlist buttons ---------- */
  document.addEventListener('focusin', function (e) {
    if (e.target.closest && e.target.closest('form.lead-form')) trackOnce('form_start');
  });
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href="#get-started"], a[href="#contact"]');
    if (a && !a.closest('#quiz')) track('waitlist_click', { from: 'page_button' });
  });
})();
