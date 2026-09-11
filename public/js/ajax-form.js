// Shared AJAX handler for marketing forms (consultation, ...).
// Binds <form data-ajax-form action="/api/send-email">, validates natively
// (required / pattern) plus Iranian mobile shape, then POSTs FormData.
(function () {
  function statusEl(form) {
    let el = form.querySelector('[data-form-status]');
    if (!el) {
      el = document.createElement('p');
      el.setAttribute('data-form-status', '');
      el.setAttribute('role', 'status');
      el.className = 'text-sm font-medium';
      el.hidden = true;
      form.prepend(el);
    }
    return el;
  }
  function bind(form) {
    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;
      const phone = form.querySelector('input[name="phone"]');
      const status = statusEl(form);
      if (phone && !/^09\d{9}$/.test(phone.value.replace(/[\s-]/g, ''))) {
        status.textContent = 'شماره موبایل معتبر نیست (مثال: 09123456789).';
        status.hidden = false;
        phone.focus();
        return;
      }
      const btn = form.querySelector('[data-submit-btn]') || form.querySelector('button[type="submit"], button:not([type])');
      const label = btn ? btn.innerHTML : '';
      if (btn) { btn.setAttribute('disabled', ''); btn.innerHTML = 'در حال ارسال…'; }
      status.hidden = true;
      try {
        const res = await fetch(form.getAttribute('action') || '/api/send-email', {
          method: 'post',
          body: new FormData(form),
        });
        if (!res.ok) throw new Error('bad-status');
        status.textContent = 'درخواست شما با موفقیت ثبت شد. به‌زودی تماس می‌گیریم.';
        status.hidden = false;
        form.reset();
      } catch {
        status.textContent = 'خطایی رخ داد. لطفاً دوباره تلاش کنید یا تماس بگیرید.';
        status.hidden = false;
      } finally {
        if (btn) { btn.removeAttribute('disabled'); btn.innerHTML = label; }
      }
    });
  }
  document.querySelectorAll('form[data-ajax-form]').forEach(bind);
})();
