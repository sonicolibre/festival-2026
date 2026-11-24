const flyerModal = document.querySelector('#flyer-modal');
const flyerClose = document.querySelector('.flyer-modal-close');
const flyerReopen = document.querySelector('#flyer-reopen');
const wordmark = document.querySelector('.wordmark');
const returnToTopOnReloadKey = 'sonico-return-to-top-on-reload';

if (wordmark) {
  wordmark.addEventListener('click', (event) => {
    event.preventDefault();
    try {
      sessionStorage.setItem(returnToTopOnReloadKey, '1');
    } catch {}
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.location.reload();
  });

  try {
    if (sessionStorage.getItem(returnToTopOnReloadKey) === '1') {
      sessionStorage.removeItem(returnToTopOnReloadKey);
      if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
      window.addEventListener('pageshow', () => window.scrollTo(0, 0), { once: true });
    }
  } catch {}
}

if (flyerModal) {
  // Upgrade the initially visible dialog to a native modal.
  flyerModal.removeAttribute('open');
  flyerModal.showModal();

  flyerClose.addEventListener('click', () => flyerModal.close());
  flyerModal.addEventListener('close', () => {
    flyerReopen.hidden = false;
  });
  flyerReopen.addEventListener('click', () => {
    flyerReopen.hidden = true;
    flyerModal.showModal();
  });

  flyerModal.addEventListener('click', (event) => {
    if (event.target === flyerModal) flyerModal.close();
  });
}

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
