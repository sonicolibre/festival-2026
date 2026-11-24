const form = document.querySelector('#newsletter');
const formMessage = document.querySelector('.form-message');
const submitButton = form.querySelector('button[type="submit"]');

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  formMessage.textContent = '';
  formMessage.removeAttribute('data-state');
  submitButton.disabled = true;
  form.setAttribute('aria-busy', 'true');

  const formData = new FormData(form);
  const fields = Object.fromEntries(formData.entries());

  try {
    const response = await fetch('https://formsubmit.co/ajax/sonicolibre7@gmail.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(fields),
    });

    const result = await response.json();
    const succeeded = result.success === true || result.success === 'true';
    if (!response.ok || !succeeded) {
      throw new Error(result.message || 'No pudimos enviar tu dirección.');
    }

    form.reset();
    formMessage.dataset.state = 'success';
    formMessage.textContent = '¡Listo! Te avisaremos por correo.';
  } catch (error) {
    formMessage.dataset.state = 'error';
    formMessage.textContent = 'No se pudo enviar. Revisá tu conexión e intentá otra vez.';
  } finally {
    submitButton.disabled = false;
    form.removeAttribute('aria-busy');
  }
});

const cursor = document.querySelector('.cursor');
const finePointer = window.matchMedia('(pointer: fine) and (min-width: 761px)');

if (finePointer.matches) {
  document.body.classList.add('has-custom-cursor');
  let pointerX = -30;
  let pointerY = -30;
  let cursorX = pointerX;
  let cursorY = pointerY;
  let frameRequested = false;

  function moveCursor() {
    cursorX += (pointerX - cursorX) * 0.28;
    cursorY += (pointerY - cursorY) * 0.28;
    cursor.style.transform = `translate(${cursorX}px, ${cursorY}px) translate(-50%, -50%)`;
    if (Math.abs(pointerX - cursorX) > 0.15 || Math.abs(pointerY - cursorY) > 0.15) {
      requestAnimationFrame(moveCursor);
    } else {
      frameRequested = false;
    }
  }

  window.addEventListener('pointermove', (event) => {
    pointerX = event.clientX;
    pointerY = event.clientY;
    cursor.classList.add('is-visible');
    if (!frameRequested) {
      frameRequested = true;
      requestAnimationFrame(moveCursor);
    }
  }, { passive: true });

  document.addEventListener('pointerleave', () => cursor.classList.remove('is-visible'));
  document.addEventListener('pointerenter', () => cursor.classList.add('is-visible'));

  document.querySelectorAll('button, input, a, .act').forEach((element) => {
    element.addEventListener('pointerenter', () => cursor.classList.add('is-hovering'));
    element.addEventListener('pointerleave', () => cursor.classList.remove('is-hovering'));
  });
}
