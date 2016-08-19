function inherit(child, parent) {
    const parentPrototypeCopy = Object.create(parent.prototype);
    parentPrototypeCopy.constructor = child;
    child.prototype = parentPrototypeCopy;
}

export { inherit };

