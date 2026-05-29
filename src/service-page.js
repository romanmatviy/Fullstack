// Service page JS — contact form submit
document.addEventListener('DOMContentLoaded', function () {
  // FAQ toggle
  document.querySelectorAll('.faq-item summary').forEach(summary => {
    summary.addEventListener('click', function () {
      const item = this.closest('details');
      document.querySelectorAll('.faq-item').forEach(el => {
        if (el !== item) el.removeAttribute('open');
      });
    });
  });

  // Contact form
  function ensureStatusEl(form) {
    let s = form.querySelector('.form-status');
    if (!s) { s = document.createElement('div'); s.className = 'form-status'; form.appendChild(s); }
    return s;
  }
  async function submitForm(form) {
    const status = ensureStatusEl(form);
    const btn = form.querySelector('button[type="submit"]');
    const prev = btn ? btn.textContent : '';
    if (btn) { btn.disabled = true; btn.textContent = 'Надсилання...'; }
    status.textContent = ''; status.classList.remove('success', 'error');
    try {
      const data = new FormData(form);
      data.append('source', window.location.href);
      const res = await fetch('https://bot.programist.top/api/contact.php', { method: 'POST', body: data });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.ok) throw new Error(json.error || 'Сталася помилка. Спробуйте пізніше.');
      status.textContent = json.message || 'Повідомлення надіслано!';
      status.classList.add('success');
      form.reset();
    } catch (err) {
      status.textContent = err.message || 'Сталася помилка. Спробуйте пізніше.';
      status.classList.add('error');
    } finally {
      if (btn) { btn.disabled = false; btn.textContent = prev; }
    }
  }
  document.querySelectorAll('form.contact-form').forEach(form => {
    form.addEventListener('submit', e => { e.preventDefault(); submitForm(form); });
  });
});
