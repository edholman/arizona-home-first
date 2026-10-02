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

  /* ---------- eligibility quiz ---------- */
  var QUESTIONS = [
    { key: 'first_time', q: 'Are you a first time homebuyer in Arizona?',
      opts: [['yes', 'Yes, this will be my first home'], ['no', 'No, I have owned a home before']] },
    { key: 'credit', q: 'What is your estimated credit score?',
      opts: [['740+', '740 or higher (Excellent)'], ['680-739', '680 to 739 (Good)'], ['620-679', '620 to 679 (Fair)'], ['below-620', 'Below 620']] },
    { key: 'income', q: 'What is your household annual income?',
      opts: [['100k+', '$100,000 or more'], ['70k-99k', '$70,000 to $99,999'], ['50k-69k', '$50,000 to $69,999'], ['below-50k', 'Below $50,000']] },
    { key: 'price_range', q: 'What is your target home price?',
      opts: [['400k+', '$400,000 or more'], ['300k-399k', '$300,000 to $399,999'], ['200k-299k', '$200,000 to $299,999'], ['below-200k', 'Below $200,000']] },
    { key: 'timeline', q: 'When are you hoping to buy?',
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
        '<div class="quiz-step-label">Question ' + (step + 1) + ' of ' + QUESTIONS.length + '</div>' +
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
      // same qualifying logic as the original program: credit 620+ and income $50k+
      var likely = answers.credit !== 'below-620' && answers.income !== 'below-50k';
      body.innerHTML = likely
        ? '<div class="quiz-result"><div class="badge">&#10003;</div><h3>Great news! You may qualify.</h3>' +
          '<p>Based on your answers, you may qualify for up to <strong>$10,000 in homebuyer assistance</strong>. ' +
          'Join the waitlist to reserve your spot, and a program specialist will reach out to confirm your eligibility.</p>' +
          '<a class="btn btn-primary" href="#get-started">Join the Waitlist</a></div>'
        : '<div class="quiz-result maybe"><div class="badge">&#8594;</div><h3>Thanks for checking!</h3>' +
          '<p>Some of your answers fall outside our current guidelines, but options open up often. ' +
          'Join our waitlist and we will reach out as options become available for your situation.</p>' +
          '<a class="btn btn-primary" href="#get-started">Join the Waitlist</a></div>';
      track('quiz_complete', { quiz_result: likely ? 'likely' : 'needs_review' });
      // Quiz done: every "Check If You Qualify" button now moves them forward to the waitlist form instead of back to the quiz.
      Array.prototype.forEach.call(document.querySelectorAll('a[href="#eligibility"]'), function (a) {
        a.setAttribute('href', '#get-started');
        if (/check/i.test(a.textContent)) a.textContent = 'Join the Waitlist';
      });
      var cta = body.querySelector('.btn-primary');
      if (cta) cta.addEventListener('click', function () { track('waitlist_click', { from: 'quiz_result' }); });
      // hand the answers to the lead form
      var form = document.querySelector('form.lead-form');
      if (form) {
        var set = function (name, val) { var el = form.querySelector('[name="' + name + '"]'); if (el) el.value = val; };
        set('price_range', LABEL['price_range:' + answers.price_range] || '');
        set('timeline', answers.timeline || '');
        var summary = 'Quiz: ' + [
          'first time buyer: ' + (answers.first_time === 'yes' ? 'yes' : 'no'),
          'credit ' + (LABEL['credit:' + answers.credit] || ''),
          'income ' + (LABEL['income:' + answers.income] || ''),
          'target ' + (LABEL['price_range:' + answers.price_range] || ''),
          'result: ' + (likely ? 'likely qualifies' : 'needs review')].join('; ');
        set('message', summary);
        var box = document.getElementById('quiz-summary');
        if (box) { box.textContent = likely ? 'Your quiz results: you may qualify for up to $10,000 in homebuyer assistance.' : 'Your quiz results are saved with your spot on the waitlist.'; box.hidden = false; }
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
