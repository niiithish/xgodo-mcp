# automation-reference-agent-actions-touch

**Source:** https://xgodo.com/docs/automation/reference/agent/actions/touch

**Scraped:** 2025-01-31T13:43:40.000Z

---

# Touch Actions

Actions

Touch gestures for device interaction

Access these methods through `agent.actions`. All touch methods are asynchronous and return Promises.

### `tap()`

TypeScriptCopy

```
tap(x: number, y: number): Promise<void>
```

Performs a single tap at the specified screen coordinates.

#### Parameters

| Name | Type | Description |
| --- | --- | --- |
| `x` | `number` | X coordinate on screen |
| `y` | `number` | Y coordinate on screen |

#### Returns

`Promise<void>`Resolves when tap is complete

#### Examples

Simple tap

TypeScriptCopy

```
await agent.actions.tap(100, 200);
```

Tap center of a node

TypeScriptCopy

```
const node = screen.findTextOne("Submit");
if (node) {
  const { left, top, right, bottom } = node.boundsInScreen;
  await agent.actions.tap((left + right) / 2, (top + bottom) / 2);
}
```

### `swipe()`

TypeScriptCopy

```
swipe(x1: number, y1: number, x2: number, y2: number, duration: number): Promise<void>
```

Performs a swipe gesture from one point to another.

#### Parameters

| Name | Type | Description |
| --- | --- | --- |
| `x1` | `number` | Starting X coordinate |
| `y1` | `number` | Starting Y coordinate |
| `x2` | `number` | Ending X coordinate |
| `y2` | `number` | Ending Y coordinate |
| `duration` | `number` | Duration in milliseconds |

#### Returns

`Promise<void>`Resolves when swipe is complete

#### Examples

Swipe up

TypeScriptCopy

```
await agent.actions.swipe(500, 1500, 500, 500, 300);
```

Swipe right

TypeScriptCopy

```
await agent.actions.swipe(100, 500, 900, 500, 200);
```

### `hold()`

TypeScriptCopy

```
hold(x: number, y: number, duration: number): Promise<void>
```

Performs a long press at the specified coordinates.

#### Parameters

| Name | Type | Description |
| --- | --- | --- |
| `x` | `number` | X coordinate |
| `y` | `number` | Y coordinate |
| `duration` | `number` | Hold duration in milliseconds |

#### Returns

`Promise<void>`Resolves when hold is complete

#### Examples

TypeScriptCopy

```
await agent.actions.hold(500, 500, 1000); // Hold for 1 second
```

### `doubleTap()`

TypeScriptCopy

```
doubleTap(x: number, y: number, interval: number): Promise<void>
```

Performs a double tap at the specified coordinates.

#### Parameters

| Name | Type | Description |
| --- | --- | --- |
| `x` | `number` | X coordinate |
| `y` | `number` | Y coordinate |
| `interval` | `number` | Interval between taps in milliseconds |

#### Returns

`Promise<void>`Resolves when double tap is complete

#### Examples

TypeScriptCopy

```
await agent.actions.doubleTap(500, 500, 100);
```

### `multiTap()`

TypeScriptCopy

```
multiTap(sequence: MultiTapSequenceItem[]): Promise<void>
```

Performs multiple taps in sequence with configurable delays.

#### Parameters

| Name | Type | Description |
| --- | --- | --- |
| `sequence` | `MultiTapSequenceItem[]` | Array of {x, y, delay} objects where delay is ms to wait after each tap |

#### Returns

`Promise<void>`Resolves when all taps are complete

#### Examples

TypeScriptCopy

```
await agent.actions.multiTap([\
  { x: 100, y: 200, delay: 100 },\
  { x: 300, y: 400, delay: 100 },\
  { x: 500, y: 600, delay: 0 }\
]);
```

### `swipePoly()`

TypeScriptCopy

```
swipePoly(startX: number, startY: number, sequence: {x: number, y: number}[], duration: number, bezier?: boolean): Promise<void>
```

Performs a multi-point swipe through a sequence of coordinates.

#### Parameters

| Name | Type | Description |
| --- | --- | --- |
| `startX` | `number` | Starting X coordinate |
| `startY` | `number` | Starting Y coordinate |
| `sequence` | `{x: number, y: number}[]` | Array of points to swipe through |
| `duration` | `number` | Total duration in milliseconds |
| `bezier?` | `boolean` | Use bezier curve interpolation |

#### Returns

`Promise<void>`Resolves when swipe is complete

#### Examples

TypeScriptCopy

```
// Draw a zigzag pattern
await agent.actions.swipePoly(100, 500, [\
  { x: 300, y: 400 },\
  { x: 500, y: 600 },\
  { x: 700, y: 400 }\
], 500);
```