# automation-reference-helpers

**Source:** https://xgodo.com/docs/automation/reference/helpers

**Scraped:** 2025-01-31T19:38:00.000Z

---

# Helper Functions

Functions

Standalone utility functions for working with AndroidNode trees

These global helper functions provide additional ways to work with the accessibility tree. They are available alongside the methods on AndroidNode instances.

Overview

TypeScriptCopy

```
// All helper functions are globally available
declare function getAllNodes(rootNode: AndroidNode | null | undefined): AndroidNode[];
declare function buildNodePath(rootNode: AndroidNode | null | undefined, targetNode: AndroidNode | null | undefined): AndroidNode[];
declare function findNodesById(rootNode: AndroidNode | null | undefined, id: string): AndroidNode[];
declare function findNodesByText(rootNode: AndroidNode | null | undefined, text: string): AndroidNode[];
declare function findParentOf(rootNode: AndroidNode | null | undefined, targetNode: AndroidNode | null | undefined): AndroidNode | null;
```

## Functions

### `getAllNodes()`

TypeScriptCopy

```
getAllNodes(rootNode: AndroidNode | null | undefined): AndroidNode[]
```

Returns all nodes in the tree as a flat array. Equivalent to calling rootNode.allNodes() but handles null/undefined input safely.

#### Parameters

| Name | Type | Description |
| --- | --- | --- |
| `rootNode` | `AndroidNode | null | undefined` | Root node of the tree to flatten |

#### Returns

`AndroidNode[]`Flat array of all nodes in the tree, or empty array if input is null/undefined

#### Examples

TypeScriptCopy

```
const screen = await agent.actions.screenContent();
const allNodes = getAllNodes(screen);

// Count nodes by type
const buttonCount = allNodes.filter(n =>
  n.className === "android.widget.Button"
).length;

console.log("Total nodes:", allNodes.length);
console.log("Buttons:", buttonCount);
```

Safe handling of null

TypeScriptCopy

```
// Returns empty array instead of throwing
const nodes = getAllNodes(null); // []
```

### `buildNodePath()`

TypeScriptCopy

```
buildNodePath(rootNode: AndroidNode | null | undefined, targetNode: AndroidNode | null | undefined): AndroidNode[]
```

Builds the path from the root node to the target node as an array of nodes. Useful for understanding the hierarchy or debugging.

#### Parameters

| Name | Type | Description |
| --- | --- | --- |
| `rootNode` | `AndroidNode | null | undefined` | Root of the tree |
| `targetNode` | `AndroidNode | null | undefined` | Target node to find path to |

#### Returns

`AndroidNode[]`Array of nodes from root to target, or empty array if path not found

#### Examples

TypeScriptCopy

```
const screen = await agent.actions.screenContent();
const button = screen.findTextOne("Submit");

if (button) {
  const path = buildNodePath(screen, button);

  // Print the hierarchy
  console.log("Path to button:");
  path.forEach((node, i) => {
    const indent = "  ".repeat(i);
    console.log(indent + (node.className || "unknown"));
  });
}
```

Debug node location

TypeScriptCopy

```
const target = screen.findByIdOne("com.example:id/hidden_button");
if (target) {
  const path = buildNodePath(screen, target);
  console.log("Button is", path.length, "levels deep");
  console.log("Parent classes:", path.map(n => n.className).join(" > "));
}
```

### `findNodesById()`

TypeScriptCopy

```
findNodesById(rootNode: AndroidNode | null | undefined, id: string): AndroidNode[]
```

Finds all nodes with the matching viewId. Equivalent to rootNode.findById(id) but handles null/undefined input.

#### Parameters

| Name | Type | Description |
| --- | --- | --- |
| `rootNode` | `AndroidNode | null | undefined` | Root of the tree to search |
| `id` | `string` | View ID to search for (e.g., 'com.example:id/button') |

#### Returns

`AndroidNode[]`Array of matching nodes, or empty array if none found

#### Examples

TypeScriptCopy

```
const screen = await agent.actions.screenContent();
const buttons = findNodesById(screen, "com.example:id/action_button");

console.log("Found", buttons.length, "action buttons");

for (const button of buttons) {
  console.log("Button text:", button.text);
}
```

### `findNodesByText()`

TypeScriptCopy

```
findNodesByText(rootNode: AndroidNode | null | undefined, text: string): AndroidNode[]
```

Finds all nodes containing the specified text in their text, description, or hintText properties. Case-insensitive search.

#### Parameters

| Name | Type | Description |
| --- | --- | --- |
| `rootNode` | `AndroidNode | null | undefined` | Root of the tree to search |
| `text` | `string` | Text to search for |

#### Returns

`AndroidNode[]`Array of matching nodes, or empty array if none found

#### Examples

TypeScriptCopy

```
const screen = await agent.actions.screenContent();
const submitNodes = findNodesByText(screen, "Submit");

// Find all nodes mentioning "error"
const errorNodes = findNodesByText(screen, "error");
if (errorNodes.length > 0) {
  console.log("Found error message:", errorNodes[0].text);
}
```

### `findParentOf()`

TypeScriptCopy

```
findParentOf(rootNode: AndroidNode | null | undefined, targetNode: AndroidNode | null | undefined): AndroidNode | null
```

Finds the parent of the target node within the tree. Alternative to accessing targetNode.parent directly, with null-safe handling.

#### Parameters

| Name | Type | Description |
| --- | --- | --- |
| `rootNode` | `AndroidNode | null | undefined` | Root of the tree |
| `targetNode` | `AndroidNode | null | undefined` | Node to find parent of |

#### Returns

`AndroidNode | null`Parent node, or null if not found or target is root

#### Examples

TypeScriptCopy

```
const screen = await agent.actions.screenContent();
const button = screen.findTextOne("Submit");

if (button) {
  const parent = findParentOf(screen, button);
  if (parent) {
    console.log("Parent class:", parent.className);
    console.log("Parent has", parent.children.length, "children");
  }
}
```

Find containing form

TypeScriptCopy

```
const input = screen.findAdvanced(f => f.isEditText());
if (input) {
  let current = input;
  let parent = findParentOf(screen, current);

  // Walk up to find a form container
  while (parent) {
    if (parent.viewId?.includes("form")) {
      console.log("Found form container:", parent.viewId);
      break;
    }
    current = parent;
    parent = findParentOf(screen, current);
  }
}
```

## When to Use Helper Functions vs Methods

### Use Helper Functions When:

- The root node might be null or undefined
- You want consistent null-safe behavior
- You prefer a functional programming style
- Working with nodes from potentially failed operations

### Use Instance Methods When:

- You have a guaranteed non-null AndroidNode
- You're chaining operations fluently
- You need the advanced filter builder pattern
- Writing more concise code

Comparison

TypeScriptCopy

```
// Using helper function (null-safe)
const allNodes = getAllNodes(screen);
const byId = findNodesById(screen, "com.example:id/btn");
const byText = findNodesByText(screen, "Submit");

// Using instance methods (requires non-null node)
const allNodes2 = screen.allNodes();
const byId2 = screen.findById("com.example:id/btn");
const byText2 = screen.findText("Submit");

// Instance methods also provide advanced filtering
const filtered = screen.filterAdvanced(f => f.isButton().isClickable());
```