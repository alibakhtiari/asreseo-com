// Shared AJAX handler for marketing forms (consultation, contact, etc.).
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
      const phone = form.querySelector('input[name="phone"]');
      if (phone) {
        phone.value = phone.value.trim();
      }
      if (!form.reportValidity()) return;
      const status = statusEl(form);
      if (phone && phone.value && !/^\+?[\d\s\-().]{7,25}$/.test(phone.value)) {
        status.textContent = 'Please enter a valid phone number.';
        status.hidden = false;
        phone.focus();
        return;
      }
      const btn = form.querySelector('[data-submit-btn]') || form.querySelector('button[type="submit"], button:not([type])');
      const label = btn ? btn.innerHTML : '';
      if (btn) { btn.setAttribute('disabled', ''); btn.innerHTML = 'Submitting…'; }
      status.hidden = true;
      let ok;
      let serverMessage = '';
      try {
        const res = await fetch(form.getAttribute('action') || '/api/send-email', {
          method: 'post',
          body: new FormData(form),
        });
        const result = await res.json().catch(() => ({}));
        ok = res.ok && !result.error;
        serverMessage = result.error || '';
      } catch {
        ok = false;
      }
      if (ok) {
        status.textContent = 'Your inquiry has been submitted successfully. We will be in touch shortly.';
        status.hidden = false;
        form.reset();
      } else {
        status.textContent =
          serverMessage || 'An error occurred. Please try again or reach out to info@asreseo.com.';
        status.hidden = false;
      }
      // Always re-enable the button, success or failure.
      if (btn) { btn.removeAttribute('disabled'); btn.innerHTML = label; }
    });
  }
  document.querySelectorAll('form[data-ajax-form]').forEach(bind);
})();
