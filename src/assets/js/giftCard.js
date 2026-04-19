/**
 * AlemSpa Gift Card Purchase Flow
 * Handles service selection, form interaction, and Stripe Checkout redirect
 */

(function () {
    'use strict';

    // ─── State ───────────────────────────────────────────────────────────────────
    let selectedService = null;

    // ─── DOM refs ────────────────────────────────────────────────────────────────
    const formSection   = document.getElementById('gc-form-section');
    const form          = document.getElementById('gc-form');
    const selectedName  = document.getElementById('gc-selected-name');
    const selectedPrice = document.getElementById('gc-selected-price');
    const changeBtn     = document.getElementById('gc-change-btn');
    const submitBtn     = document.getElementById('gc-submit');
    const errorBox      = document.getElementById('gc-error');
    const datePicker    = document.getElementById('gc-date-picker');
    const deliveryInput = document.getElementById('delivery_date');
    const giftMessage   = document.getElementById('gift_message');
    const charRemaining = document.getElementById('gc-char-remaining');

    // ─── Service card selection ───────────────────────────────────────────────────
    document.querySelectorAll('.gc-select-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
            const card = btn.closest('.gc-card-inner');
            selectService(card);
        });
    });

    // Also allow clicking anywhere on the card
    document.querySelectorAll('.gc-card-inner').forEach(function (card) {
        card.addEventListener('click', function (e) {
            if (e.target.tagName !== 'BUTTON') {
                selectService(card);
            }
        });
    });

    function selectService(card) {
        // Deselect previous
        document.querySelectorAll('.gc-card-inner').forEach(function (c) {
            c.classList.remove('gc-selected');
            var btn = c.querySelector('.gc-select-btn');
            if (btn) btn.textContent = 'Select This Gift';
        });

        // Select new
        card.classList.add('gc-selected');
        var btn = card.querySelector('.gc-select-btn');
        if (btn) btn.textContent = '✓ Selected';

        selectedService = {
            key:         card.dataset.serviceKey,
            priceId:     card.dataset.priceId,
            name:        card.dataset.serviceName,
            priceDisplay: card.dataset.priceDisplay,
            amount:      card.dataset.amount
        };

        // Update summary bar
        selectedName.textContent  = selectedService.name;
        selectedPrice.textContent = selectedService.priceDisplay;

        // Show form
        formSection.classList.add('gc-form-visible');
        formSection.removeAttribute('aria-hidden');

        // Scroll to form
        setTimeout(function () {
            formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);

        clearError();
    }

    // ─── Change selection ────────────────────────────────────────────────────────
    changeBtn.addEventListener('click', function () {
        formSection.classList.remove('gc-form-visible');
        formSection.setAttribute('aria-hidden', 'true');
        document.querySelectorAll('.gc-card-inner').forEach(function (c) {
            c.classList.remove('gc-selected');
            var b = c.querySelector('.gc-select-btn');
            if (b) b.textContent = 'Select This Gift';
        });
        selectedService = null;

        // Scroll back up to cards
        document.getElementById('gc-services').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    // ─── Delivery type toggle ─────────────────────────────────────────────────────
    document.querySelectorAll('input[name="delivery_type"]').forEach(function (radio) {
        radio.addEventListener('change', function () {
            if (this.value === 'scheduled') {
                datePicker.classList.add('gc-date-visible');
                datePicker.removeAttribute('aria-hidden');
                deliveryInput.required = true;
                // Set minimum date to tomorrow
                var tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                deliveryInput.min = tomorrow.toISOString().split('T')[0];
            } else {
                datePicker.classList.remove('gc-date-visible');
                datePicker.setAttribute('aria-hidden', 'true');
                deliveryInput.required = false;
                deliveryInput.value = '';
            }
        });
    });

    // ─── Character counter ───────────────────────────────────────────────────────
    if (giftMessage && charRemaining) {
        giftMessage.addEventListener('input', function () {
            var remaining = 500 - this.value.length;
            charRemaining.textContent = remaining;
            charRemaining.style.color = remaining < 50 ? '#e53e3e' : '';
        });
    }

    // ─── Form submission ─────────────────────────────────────────────────────────
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        clearError();

        if (!selectedService) {
            showError('Please select a service before proceeding.');
            return;
        }

        // Validate required fields
        var requiredFields = form.querySelectorAll('[required]');
        var valid = true;
        requiredFields.forEach(function (field) {
            field.classList.remove('gc-input-error');
            if (!field.value.trim() && field.type !== 'checkbox') {
                field.classList.add('gc-input-error');
                valid = false;
            }
            if (field.type === 'checkbox' && !field.checked) {
                valid = false;
            }
        });

        if (!valid) {
            showError('Please fill in all required fields and accept the terms.');
            // Scroll to first error
            var firstError = form.querySelector('.gc-input-error');
            if (firstError) {
                firstError.focus();
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }

        // Email format validation
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        var buyerEmail     = document.getElementById('buyer_email').value.trim();
        var recipientEmail = document.getElementById('recipient_email').value.trim();

        if (!emailRegex.test(buyerEmail)) {
            showError('Please enter a valid email address for the buyer.');
            document.getElementById('buyer_email').classList.add('gc-input-error');
            return;
        }

        if (!emailRegex.test(recipientEmail)) {
            showError('Please enter a valid email address for the recipient.');
            document.getElementById('recipient_email').classList.add('gc-input-error');
            return;
        }

        // Determine delivery date
        var deliveryType = document.querySelector('input[name="delivery_type"]:checked').value;
        var deliveryDate = '';
        if (deliveryType === 'scheduled' && deliveryInput.value) {
            // Set to 9am Eastern on chosen date
            deliveryDate = deliveryInput.value + 'T09:00:00';
        }

        // Build payload
        var payload = {
            service_key:     selectedService.key,
            price_id:        selectedService.priceId,
            buyer_name:      document.getElementById('buyer_name').value.trim(),
            buyer_email:     buyerEmail,
            recipient_name:  document.getElementById('recipient_name').value.trim(),
            recipient_email: recipientEmail,
            gift_message:    giftMessage ? giftMessage.value.trim() : '',
            delivery_date:   deliveryDate
        };

        // Disable button and show loading state
        submitBtn.disabled = true;
        submitBtn.classList.add('gc-loading');

        // Call Netlify function
        fetch('/.netlify/functions/create-gift-checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
            .then(function (res) {
                return res.json().then(function (data) {
                    return { ok: res.ok, data: data };
                });
            })
            .then(function (result) {
                if (!result.ok || !result.data.url) {
                    throw new Error(result.data.error || 'Something went wrong. Please try again.');
                }
                // Redirect to Stripe Checkout
                window.location.href = result.data.url;
            })
            .catch(function (err) {
                showError(err.message || 'Unable to process your request. Please try again.');
                submitBtn.disabled = false;
                submitBtn.classList.remove('gc-loading');
            });
    });

    // ─── Helpers ─────────────────────────────────────────────────────────────────
    function showError(msg) {
        errorBox.textContent = msg;
        errorBox.classList.add('gc-error-visible');
        errorBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    function clearError() {
        errorBox.textContent = '';
        errorBox.classList.remove('gc-error-visible');
        document.querySelectorAll('.gc-input-error').forEach(function (el) {
            el.classList.remove('gc-input-error');
        });
    }

})();