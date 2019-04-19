export default class CabinetBase {
    protected rootDom: HTMLElement;
    protected onSaveStatusChange: (status: ShimoSDK.Common.CollaborationStatus) => {};

    constructor(rootDom: HTMLElement, onSaveStatusChange: (status: ShimoSDK.Common.CollaborationStatus) => {}) {
        this.rootDom = rootDom;
        this.onSaveStatusChange = onSaveStatusChange;
    }

    public getDom(domId: string, root?: HTMLElement, elementType = "div") {
        let sdkDom = document.getElementById(domId);
        if (!sdkDom) {
            sdkDom = document.createElement(elementType);
            sdkDom.setAttribute("id", domId);
            root ? root.appendChild(sdkDom) : this.rootDom.appendChild(sdkDom);
        }
        return sdkDom;
    }

    protected insertAfter(referenceNode: HTMLElement, newNode: HTMLElement) {
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }
}
