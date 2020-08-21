import UITab from './component/UITab';
import UIPanelTab from './component/UIPanelTab';
import UIIconToolbar from './component/UIIconToolbar';
import UITool from './component/UITool';
import Item from './component/Item';
import { IconToolbarAction, ItemSelectorAction, TabAction, TabPanelAction, ToolAction } from './UIProperties';

/**
 * The <i>CustomEvent</i> interface. TODO: Document.
 *
 * @author Jab
 */
export interface CustomEvent {
  eventType: string;
  forced: boolean;
}

/**
 * The <i>ItemSelectorEvent</i> interface. TODO: Document.
 *
 * @author Jab
 */
export interface ItemSelectorEvent extends CustomEvent {
  item: Item;
  action: ItemSelectorAction;
}

export interface UIIconToolbarEvent extends CustomEvent {
}

export interface UIIconToolbarEvent {
  toolBar: UIIconToolbar;
  tool: UITool;
  action: IconToolbarAction;
}

/**
 * The <i>UITabEvent</i> interface. TODO: Document.
 *
 * @author Jab
 */
export interface UITabEvent extends CustomEvent {
  tab: UITab;
  action: TabAction;
}

/**
 * The <i>ItemSelectorEvent</i> interface. TODO: Document.
 *
 * @author Jab
 */
export interface ItemSelectorEvent extends CustomEvent {
  item: Item;
  action: ItemSelectorAction;
}

/**
 * The <i>UIPanelEvent</i> interface. TODO: Document.
 *
 * @author Jab
 */
export interface UIPanelEvent extends CustomEvent {
  tabPanel: UIPanelTab;
  action: TabPanelAction;
}

export interface UIToolEvent extends CustomEvent {
  tool: UITool;
  action: ToolAction;
}

export interface UIIconToolbarEvent {
  toolBar: UIIconToolbar;
  tool: UITool;
  action: IconToolbarAction;
}
