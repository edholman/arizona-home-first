/* Arizona Home First: eligibility quiz + savings calculator */
(function () {
  'use strict';

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
        b.addEventListener('click', function () { answers[q.key] = b.getAttribute('data-v'); step++; step < QUESTIONS.length ? render() : finish(); });
      });
      var back = body.querySelector('.quiz-back');
      if (back) back.addEventListener('click', function () { step--; render(); });
    }

    function finish() {
      bar.style.width = '100%';
      // same qualifying logic as the original program: credit 620+ and income $50k+
      var likely = answers.credit !== 'below-620' && answers.income !== 'below-50k';
      body.innerHTML = likely
        ? '<div class="quiz-result"><div class="badge">&#10003;</div><h3>Good news! You may qualify.</h3>' +
          '<p>Based on your answers, you may qualify for up to <strong>2% in combined credits</strong> toward your closing costs. ' +
          'Tell us where to reach you and a licensed professional will review your options.</p>' +
          '<a class="btn btn-primary" href="#get-started">See My Options</a></div>'
        : '<div class="quiz-result maybe"><div class="badge">&#8594;</div><h3>You may still have options.</h3>' +
          '<p>Some answers fall outside our standard guidelines, but many buyers improve their position quickly with the right plan. ' +
          'Leave your info and we will reach out with next steps.</p>' +
          '<a class="btn btn-primary" href="#get-started">Get My Next Steps</a></div>';
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
        if (box) { box.textContent = 'Your quiz answers will be included: ' + (likely ? 'you may qualify for up to 2% in credits.' : 'we will review your options.'); box.hidden = false; }
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
    price.addEventListener('input', calc); down.addEventListener('change', calc);
    price.addEventListener('blur', function () { var p = parseFloat(String(price.value).replace(/[^0-9.]/g, '')); if (p) price.value = Math.round(p).toLocaleString('en-US'); });
    calc();
  }
})();
