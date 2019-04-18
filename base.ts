export default class CabinetBase {
    protected rootDom: HTMLElement;

    constructor(rootDom: HTMLElement) {
        this.rootDom = rootDom;
    }

    public getDom(domId: string) {
        let sdkDom = document.getElementById(domId);
        if (!sdkDom) {
            sdkDom = document.createElement("div");
            sdkDom.setAttribute("id", domId);
            this.rootDom.appendChild(sdkDom);
        }
        return sdkDom;
    }

    protected insertAfter(referenceNode: HTMLElement, newNode: HTMLElement) {
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }
}
