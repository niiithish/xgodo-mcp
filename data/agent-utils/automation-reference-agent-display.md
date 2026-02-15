# automation-reference-agent-display

**Source:** https://xgodo.com/docs/automation/reference/agent/display

**Scraped:** 2025-01-31T19:38:00.000Z

---

# AgentDisplay

Interface

Display HTML overlays on screen

Access display methods through`agent.display`. Allows you to render HTML content as an overlay on the device screen.

AgentDisplay Interface

TypeScriptCopy

```
interface AgentDisplay {
  displayHTMLCode(htmlCode: string, x1: number, y1: number, x2: number, y2: number, opacity: number): void;
  hideHTMLCode(): void;
}
```

## Methods

### `displayHTMLCode()`

TypeScriptCopy

```
displayHTMLCode(htmlCode: string, x1: number, y1: number, x2: number, y2: number, opacity: number): void
```

Displays an HTML overlay on the screen within the specified rectangle.

#### Parameters

| Name | Type | Description |
| --- | --- | --- |
| `htmlCode` | `string` | HTML content to render |
| `x1` | `number` | Left boundary of the overlay |
| `y1` | `number` | Top boundary of the overlay |
| `x2` | `number` | Right boundary of the overlay |
| `y2` | `number` | Bottom boundary of the overlay |
| `opacity` | `number` | Opacity (0.0 to 1.0) |

#### Examples

Show status message

TypeScriptCopy

```
agent.display.displayHTMLCode(
  '<div style="background: #000; color: #fff; padding: 20px; border-radius: 10px;">' +
    '<h2>Processing...</h2>' +
    '<p>Please wait while the automation runs.</p>' +
  '</div>',
  100, 400, 980, 600, 0.9
);
```

Show progress

TypeScriptCopy

```
function showProgress(percent) {
  agent.display.displayHTMLCode(
    `<div style="padding: 20px; background: rgba(0,0,0,0.8); color: white;">
      <div>Progress: ${percent}%</div>
      <div style="background: #333; height: 20px; border-radius: 10px;">
        <div style="background: #4CAF50; height: 100%; width: ${percent}%; border-radius: 10px;"></div>
      </div>
    </div>`,
    50, 100, 1030, 200, 1.0
  );
}
```

Full-screen overlay

TypeScriptCopy

```
const device = agent.info.getDeviceInfo();
agent.display.displayHTMLCode(
  '<div style="display:flex;align-items:center;justify-content:center;height:100%;background:rgba(0,0,0,0.7);color:white;font-size:24px;">Loading...</div>',
  0, 0, device.width, device.height, 1.0
);
```

### `hideHTMLCode()`

TypeScriptCopy

```
hideHTMLCode(): void
```

Hides any currently displayed HTML overlay.

#### Examples

TypeScriptCopy

```
// Show overlay
agent.display.displayHTMLCode("<div>Working...</div>", 100, 100, 500, 200, 0.8);

// Do some work
await performTask();

// Hide overlay when done
agent.display.hideHTMLCode();
```

## Use Cases

### Status Display

Show the current status of the automation to the user, especially for long-running tasks.

### Progress Indicators

Display progress bars or percentage completion for multi-step processes.

### Error Messages

Show error messages or warnings that require user attention.

### Debug Information

Display debug info during development to understand automation behavior.

### Tip

HTML overlays are rendered on top of the screen content but don't intercept touch events. The overlay is purely visual and won't affect automation interactions with the underlying UI.