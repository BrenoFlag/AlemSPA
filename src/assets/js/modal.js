(() => {
    document.addEventListener('DOMContentLoaded', () => {
        const modal = document.getElementById('cs-modal-1605');
        if (!modal) return;

        const closeButton = document.getElementById('cs-close-1605');
        const submitButton = document.getElementById('cs-submit-1605');

        const openModal = () => {
            modal.classList.add('cs-loaded');
            modal.classList.remove('cs-closed');
            modal.style.zIndex = 12000;
        };

        const closeModal = (zIndexValue = -1000) => {
            modal.classList.add('cs-closed');
            modal.classList.remove('cs-loaded');
            modal.style.zIndex = zIndexValue;
        };

        setTimeout(() => {
            openModal();
        }, 25000);

        if (closeButton) {
            closeButton.addEventListener('click', () => {
                closeModal();
            });
        }

        if (submitButton) {
            submitButton.addEventListener('click', () => {
                // Your submit button logic here (e.g., form submission)
            });
        }
    });
})();
