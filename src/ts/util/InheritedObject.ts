import { Inheritable } from './Inheritable';

/**
 * The <i>InheritedObject</i> class. TODO: Document.
 *
 * @author Jab
 */
export abstract class InheritedObject<I extends InheritedObject<I>> implements Inheritable {

    private children: I[];
    private parent: I;

    /**
     * Main constructor.
     */
    protected constructor() {
        this.children = [];
    }

    /////////////////
    // PARENT CODE //
    /////////////////

    // @Override
    hasParent(): boolean {
        return this.parent != null;
    }

    // @Override
    isParent(object: I): boolean {
        return this.parent != null && this.parent === object;
    }

    // @Override
    getParent(): I {
        return this.parent;
    }

    // @Override
    setParent(object: I): void {

        if (this.parent != null) {

            // Make sure the object is not already the parent.
            if (this.parent === object) {
                throw new Error(
                    "The object '"
                    + object
                    + "' is already the parent of the object '"
                    + this
                    + "'."
                );
            }

            // Perform a secondary check to prevent infinite recursion.
            if (this.parent.isChild(<any> this)) {
                this.parent.removeChild(<any> this);
            }
        }

        this.parent = object;
    }

    ///////////////////
    // CHILDREN CODE //
    ///////////////////

    // @Override
    hasChildren(): boolean {
        return this.children.length != 0;
    }

    // @Override
    isChild(object: I): boolean {

        // Make sure the object given is not null.
        if (object == null) {
            throw new Error("The object given is null or undefined.");
        }

        // Make sure that the object has children before iterating.
        if (this.hasChildren()) {

            // Go through each child to see if one matches the object given.
            for (let key in this.children) {

                // Grab the next child in the array.
                let value = this.children[key];

                // If the object equals the next child, then we have
                //   a match.
                if (value === object) {
                    return true;
                }
            }
        }

        // If we reached this line, no child matches the one given.
        return false;
    }

    // @Override
    addChild(object: I): void {

        // Make sure the object given is not null.
        if (object == null) {
            throw new Error("The object given is null or undefined.");
        }

        // Make sure the object is not already a child.
        if (this.isChild(object)) {
            throw new Error(
                "The object '"
                + object
                + "' is already a child of the object '"
                + this
                + "'."
            );
        }

        // Perform a secondary check to prevent infinite recursion.
        if (!object.isParent(<any> this)) {
            object.setParent(<any> this);
        }

        // Add the child as the next index in the array.
        this.children.push(object);

    }

    removeChildren(): I[] {
        let copy = this.copyChildren();
        this.children.length = 0;
        return copy;
    }

    // @Override
    removeChild(object: I): number {

        // Make sure the object given is not null.
        if (object == null) {
            throw new Error("The object given is null or undefined.");
        }

        // Make sure the object is a child.
        if (!this.isChild(object)) {
            throw new Error(
                "The object '"
                + object
                + "' is not a child of the object '"
                + this
                + "'."
            );
        }

        // Perform a secondary check to prevent infinite recursion.
        if (object.isParent(<any> this)) {
            object.setParent(null);
        }

        // Create the new array to replace the children array.
        let newChildren: I[] = [];

        let _index = -1;

        // Go through each child and check for a match.
        for (let index = 0; index < this.children.length; index++) {

            let value = this.children[index];

            // If the child matches, skip adding it to the new array.
            if (value === object) {
                _index = index;
                continue;
            }

            newChildren.push(value);

        }

        // Set the new children array.
        this.children = newChildren;

        return _index;
    }

    // @Override
    getChildren(): I[] {
        return this.children;
    }

    private copyChildren(): I[] {

        // Make sure the element has children to index.
        if (!this.hasChildren()) {
            return [];
        }

        // Copy the children.
        let array = [];
        for (let index = 0; index < this.children.length; index++) {
            array.push(this.children[index]);
        }

        return array;
    }
}
