class LoaderController {
  constructor(selector) {
    this.selector = selector;
  }

  enable() {
    document.querySelector(this.selector).classList.add('active');
  }

  disable() {
    document.querySelector(this.selector).classList.remove('active');
  }
}
