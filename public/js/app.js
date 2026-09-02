const toggle = document.querySelector('[data-menu-toggle]');
const sidebar = document.getElementById('sidebar');
const backdrop = document.querySelector('[data-menu-close]');

function closeMenu() {
  sidebar?.classList.remove('open');
  backdrop?.classList.remove('visible');
}

toggle?.addEventListener('click', () => {
  sidebar?.classList.toggle('open');
  backdrop?.classList.toggle('visible');
});

backdrop?.addEventListener('click', closeMenu);

document.querySelectorAll('form[data-confirm]').forEach((form) => {
  form.addEventListener('submit', (event) => {
    const message = form.getAttribute('data-confirm');
    if (message && !window.confirm(message)) {
      event.preventDefault();
    }
  });
});
