import { arrayMove } from '@dnd-kit/sortable';

import { Section, Sections, SectionType } from 'types/types';
import type { FlattenedItem } from './types';

function getDragDepth(offset: number, indentationWidth: number) {
  return Math.round(offset / indentationWidth);
}

export function getProjection(
  items: FlattenedItem[],
  activeId: string,
  overId: string,
  dragOffset: number,
  indentationWidth: number
) {
  const overItemIndex = items.findIndex(({ id }) => id === overId);
  const activeItemIndex = items.findIndex(({ id }) => id === activeId);
  const activeItem = items[activeItemIndex];
  const newItems = arrayMove(items, activeItemIndex, overItemIndex);
  const previousItem = newItems[overItemIndex - 1];
  const nextItem = newItems[overItemIndex + 1];
  const dragDepth = getDragDepth(dragOffset, indentationWidth);
  const projectedDepth = activeItem.depth + dragDepth;
  const maxDepth = getMaxDepth({
    previousItem,
  });
  const minDepth = getMinDepth({ nextItem });
  let depth = projectedDepth;

  if (projectedDepth >= maxDepth) {
    depth = maxDepth;
  } else if (projectedDepth < minDepth) {
    depth = minDepth;
  }

  return { depth, maxDepth, minDepth, parentId: getParentId() };

  function getParentId() {
    if (depth === 0 || !previousItem) {
      return null;
    }

    if (depth === previousItem.depth) {
      return previousItem.parentId;
    }

    if (depth > previousItem.depth) {
      return previousItem.id;
    }

    const newParent = newItems
      .slice(0, overItemIndex)
      .reverse()
      .find((item) => item.depth === depth)?.parentId;

    return newParent ?? null;
  }
}

function getMaxDepth({ previousItem }: { previousItem: FlattenedItem }) {
  if (previousItem) {
    return previousItem.canHaveChildren
      ? previousItem.depth + 1
      : previousItem.depth;
  }

  return 0;
}

function getMinDepth({ nextItem }: { nextItem: FlattenedItem }) {
  if (nextItem) {
    return nextItem.depth;
  }

  return 0;
}

function flatten(
  items: Sections,
  parentId: string | null = null,
  depth = 0
): FlattenedItem[] {
  return items.reduce<FlattenedItem[]>((acc, item, index) => {
    return [
      ...acc,
      { ...item, parentId, depth, index },
      ...flatten(item.children, item.id, depth + 1),
    ];
  }, []);
}

export function flattenTree(items: Sections): FlattenedItem[] {
  return flatten(items);
}

export function buildTree(flattenedItems: FlattenedItem[]): Sections {
  const root: Section = {
    id: 'root',
    children: [],
    canHaveChildren: true,
    content: '',
    type: SectionType.folder,
  };
  const nodes: Record<string, Section> = { [root.id]: root };
  const items = flattenedItems.map((item) => ({ ...item, children: [] }));

  for (const item of items) {
    const { id, children, canHaveChildren, content, type } = item;
    const parentId = item.parentId ?? root.id;
    const parent = nodes[parentId] ?? findItem(items, parentId);

    nodes[id] = { id, children, canHaveChildren, content, type };
    parent.children.push(item);
  }

  return root.children;
}

export function findItem(items: Sections, itemId: string) {
  return items.find(({ id }) => id === itemId);
}

export function findItemDeep(
  items: Sections,
  itemId: string
): Section | undefined {
  for (const item of items) {
    const { id, children } = item;

    if (id === itemId) {
      return item;
    }

    if (children.length) {
      const child = findItemDeep(children, itemId);

      if (child) {
        return child;
      }
    }
  }

  return undefined;
}

export function removeItem(items: Sections, id: string) {
  const newItems = [] as Sections;

  for (let item of items) {
    if (item.id === id) {
      continue;
    }
    let newItem = { ...item };
    if (item.children.length) {
      newItem.children = removeItem(item.children, id);
    }

    newItems.push(newItem);
  }

  return newItems;
}

export const updateSectionContentDeep = (
  content: Sections,
  id: string,
  newContent: string
): Sections => {
  const newItems = [] as Sections;
  for (let item of content) {
    if (item.id === id) {
      newItems.push({ ...item, content: newContent });
      continue;
    }
    let newItem = { ...item };
    if (item.children.length) {
      newItem.children = updateSectionContentDeep(
        item.children,
        id,
        newContent
      );
    }
    newItems.push(newItem);
  }

  return newItems;
};

export const changeItemId = (
  items: Sections,
  id: string,
  newId: string
): { success: boolean; items: Sections } => {
  if (findItemDeep(items, newId)) {
    return {
      success: false,
      items,
    };
  }
  const newItems = [] as Sections;
  for (let item of items) {
    if (item.id === id) {
      newItems.push({ ...item, id: newId });
      continue;
    }
    let newItem = { ...item };
    if (item.children.length) {
      const { items } = changeItemId(item.children, id, newId);
      newItem.children = items;
    }
    newItems.push(newItem);
  }
  return { success: true, items: newItems };
};

export const addSectionAt = (
  val: Section,
  content: Sections,
  atId: string
): Sections => {
  const newItems = [] as Sections;
  for (let item of content) {
    let newItem = { ...item };
    if (item.children.length) {
      newItem.children = addSectionAt(val, item.children, atId);
    }
    if (item.id === atId && newItem.canHaveChildren) {
      if(newItem.children.length === 0) {
        newItem.children = [];
      }
      newItem.children.push({...val});
      newItem.collapsed = false;
    }
    newItems.push(newItem);
  }
  return newItems;
};

export const duplicateSection = (id: string, content: Sections) => {
  const newItems = [] as Sections;
  for (let item of content) {
    let newItem = { ...item };
    if (item.children.length) {
      newItem.children = duplicateSection(id, item.children);
    }
    newItems.push(newItem);
    if (item.id === id) {
      let i = 1;
      let duplicateId = `${id}${i}`;
      while (findItemDeep(content, duplicateId) !== undefined) {
        duplicateId = `${id}${i}`;
        i += 1;
      }
      newItems.push({ ...newItem, id: duplicateId });
    }
  }
  return newItems;
};

export function setProperty<T extends keyof Section>(
  items: Sections,
  id: string,
  property: T,
  setter: (value: Section[T]) => Section[T]
) {
  const newItems = [] as Sections;
  for (let item of items) {
    if (item.id === id) {
      let newItem = { ...item };
      newItem[property] = setter(newItem[property]);
      newItems.push(newItem);
      continue;
    }

    if (item.children.length) {
      item.children = setProperty(item.children, id, property, setter);
    }
    newItems.push(item);
  }

  return newItems;
}

function countChildren(items: Sections, count = 0): number {
  return items.reduce((acc, { children }) => {
    if (children.length) {
      return countChildren(children, acc + 1);
    }

    return acc + 1;
  }, count);
}

export function getChildCount(items: Sections, id: string) {
  if (!id) {
    return 0;
  }

  const item = findItemDeep(items, id);

  return item ? countChildren(item.children) : 0;
}

export function removeChildrenOf(items: FlattenedItem[], ids: string[]) {
  const excludeParentIds = [...ids];

  return items.filter((item) => {
    if (item.parentId && excludeParentIds.includes(item.parentId)) {
      if (item.children.length) {
        excludeParentIds.push(item.id);
      }
      return false;
    }

    return true;
  });
}
