export {};
// Progressive enhancement: one native modal menu and one contextual persistent CTA.
const toggle = document.getElementById('menu-toggle-btn') as HTMLButtonElement | null;
const menu = document.getElementById('mobile-menu') as HTMLDialogElement | null;
const closeButton = document.getElementById('close-mobile-menu');
const sticky = document.querySelector<HTMLElement>('.mobile-sticky');
const hero = document.querySelector<HTMLElement>('.hero, .inner-hero, .plain-hero');
const mobileNavigation = matchMedia('(max-width: 1060px)');
const smallScreen = matchMedia('(max-width: 767px)');
const primaryAreas = [...document.querySelectorAll<HTMLElement>('.final-cta, #pertanyaan')];
const intersects = (element: Element) => {
  const r = element.getBoundingClientRect();
  return r.top < innerHeight && r.bottom > 0;
};
function updateSticky() {
  if (!sticky) return;
  const active = document.activeElement;
  const editing = active instanceof HTMLElement && active.matches('input, select, textarea, [contenteditable=true]');
  const keyboard = Boolean(visualViewport && visualViewport.height < innerHeight * .75);
  const overlay = Boolean(document.querySelector('dialog[open]'));
  const headerHeight = document.querySelector('.site-header')?.getBoundingClientRect().height || 0;
  const pastHero = Boolean(hero && hero.getBoundingClientRect().bottom <= headerHeight);
  sticky.hidden = !smallScreen.matches || !pastHero || editing || keyboard || overlay || primaryAreas.some(intersects);
}
function closeMenu(restoreFocus = true) {
  if (!menu || !toggle) return;
  const wasOpen = menu.open;
  if (wasOpen) menu.close();
  delete document.documentElement.dataset.mobileMenu;
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-label', 'Buka menu');
  if (wasOpen && restoreFocus && mobileNavigation.matches) toggle.focus({preventScroll:true});
  updateSticky();
}
if (menu && toggle) {
  toggle.addEventListener('click', () => {
    if (menu.open) { closeMenu(); return; }
    if (!mobileNavigation.matches) return;
    menu.showModal();
    document.documentElement.dataset.mobileMenu = 'open';
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Tutup menu');
    menu.querySelector<HTMLAnchorElement>('nav a')?.focus();
    updateSticky();
  });
  menu.addEventListener('keydown', event => {
    if (event.key !== 'Tab') return;
    const controls = [...menu.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')].filter(e => e.getClientRects().length);
    const first = controls[0], last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
    if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
  });
  closeButton?.addEventListener('click' , () => closeMenu());
  menu.addEventListener('cancel', event => { event.preventDefault(); closeMenu(); });
  menu.addEventListener('close', () => closeMenu());
  menu.addEventListener('click', event => {
    if (event.target !== menu) return;
    const r = menu.getBoundingClientRect();
    if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) closeMenu();
  });
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => closeMenu(false)));
  mobileNavigation.addEventListener('change', () => closeMenu(false));
  addEventListener('pagehide', () => closeMenu(false));
  addEventListener('pageshow', () => closeMenu(false));
}
const observer = new IntersectionObserver(updateSticky, {threshold:[0,1]});
if (hero) observer.observe(hero);
primaryAreas.forEach(area => observer.observe(area));
// Dialog state also covers the photo lightbox, without a second overlay controller.
document.querySelectorAll('dialog').forEach(dialog => new MutationObserver(updateSticky).observe(dialog,{attributes:true,attributeFilter:['open']}));
addEventListener('scroll', updateSticky, {passive:true});
addEventListener('resize', updateSticky, {passive:true});
visualViewport?.addEventListener('resize', updateSticky);
smallScreen.addEventListener('change', updateSticky);
document.addEventListener('focusin', updateSticky);
document.addEventListener('focusout', () => requestAnimationFrame(updateSticky));
updateSticky();
