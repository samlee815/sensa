// Tiny event bus: fires once the preloader (or a page transition) has revealed the page.
type Fn = () => void;
let ready = false;
const subs = new Set<Fn>();

export function markReady() {
  ready = true;
  subs.forEach((f) => f());
  subs.clear();
}

export function onReady(f: Fn) {
  if (ready) {
    f();
    return () => {};
  }
  subs.add(f);
  return () => {
    subs.delete(f);
  };
}
