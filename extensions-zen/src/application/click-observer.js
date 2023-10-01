class ClickObserver {
    constructor(callback, closeCallback) {
        this.init();
        this.callback = callback;
    }
    init() {
        document.addEventListener('click', this.handleClickEvent);
    }
    handleClickEvent(event) {
        setTimeout(() => {
            this.callback(event);
        }, 300);
    }
}
