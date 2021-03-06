import UIImageEditor from './ImageEditor';
import ImageEdit from './ImageEdit';
import ImageEditorAction from './ImageEditorAction';
import ImageEditorEvent from './ImageEditorEvent';

/**
 * The <i>ImageEditManager</i> class. TODO: Document.
 *
 * @author Jab
 */
export default class ImageEditManager {
  static readonly EDITOR_HISTORY_LIMIT = 32;
  readonly imageEditor: UIImageEditor;
  edits: ImageEdit[][] = [];
  editsToPush: ImageEdit[] = [];
  private index = -1;

  /** @param tileEditor The project instance. */
  constructor(tileEditor: UIImageEditor) {
    this.imageEditor = tileEditor;
  }

  /**
   * Executes edits, filing them into the history of the editor.
   *
   * @param {TileEdit[]} edits The edits to execute.
   */
  append(edits: ImageEdit[]): void {
    if (edits.length === 0) {
      return;
    }
    for (let index = 0; index < edits.length; index++) {
      const next = edits[index];
      if (next != null) {
        this.editsToPush.push(next);
        next.do(this);
      }
    }
  }

  push(): void {
    if (this.edits.length === 0) {
      this.index = -1;
    } else if (this.edits.length == ImageEditManager.EDITOR_HISTORY_LIMIT) {
      this.edits.shift();
    } else {
      // If an action is done after previous are undone, remove the actions
      //   in-front of it before proceeding.
      while (this.edits.length > this.index + 1) {
        this.edits.pop();
      }
    }
    console.debug('pushed ' + this.editsToPush.length + ' edit(s).');
    if (this.editsToPush.length !== 0) {
      this.edits.push(this.editsToPush);
      this.editsToPush = [];
      this.index++;
    }

    this.imageEditor.dispatch(<ImageEditorEvent> {
      forced: true,
      eventType: 'ImageEditorEvent',
      action: ImageEditorAction.EDIT
    });

    this.imageEditor.renderer.clearDraw();
  }

  clear(): void {
    this.edits.length = 0;
    this.index = -1;
  }

  reset(): void {
    for (let index = this.editsToPush.length - 1; index >= 0; index--) {
      const next = this.editsToPush[index];
      if (next == null) {
        continue;
      }
      next.undo(this);
    }
    this.editsToPush.length = 0;
  }

  /**
   * Redoes the history of the project.
   *
   * @throws Error Thrown if the history is already at the latest edit.<br/>
   * <b>NOTE</b>: Use {@link ImageEditManager#canRedo() canRedo()} to check if redo is possible.
   */
  redo(): void {
    // Make sure that the edit history isn't set at the latest edit.
    if (this.index >= this.edits.length - 1) {
      throw new Error('Cannot redo. The project\'s edit history is already at the most recent edit.');
    }
    this.index++;
    const edits = this.edits[this.index];
    for (let index = 0; index < edits.length; index++) {
      try {
        edits[index].do(this);
      } catch (e) {
        console.error('Failed to redo edit.');
        console.error(e);
      }
    }

    this.imageEditor.dispatch(<ImageEditorEvent> {
      forced: false,
      eventType: 'ImageEditorEvent',
      action: ImageEditorAction.REDO
    });
  }

  /**
   * Undoes the history of the project.
   *
   * @throws Error Thrown if the history is already at the earliest edit.<br/>
   * <b>NOTE</b>: Use {@link ImageEditManager#canUndo() canUndo()} to check if undo is possible.
   */
  undo(): void {
    if (this.index < 0) {
      throw new Error('Cannot undo. The project\'s edit history is already reached.');
    }
    const edits = this.edits[this.index];
    for (let index = edits.length - 1; index >= 0; index--) {
      try {
        edits[index].undo(this);
      } catch (e) {
        console.error('Failed to undo edit.');
        console.error(e);
      }
    }
    this.index--;

    this.imageEditor.dispatch(<ImageEditorEvent> {
      forced: false,
      eventType: 'ImageEditorEvent',
      action: ImageEditorAction.UNDO
    });
  }

  /**
   * @return Returns true if the editor can undo edits.
   */
  canUndo(): boolean {
    return this.index > -1;
  }

  /**
   * @return Returns true if the editor can redo edits.
   */
  canRedo(): boolean {
    return this.index < this.edits.length - 1;
  }
}
