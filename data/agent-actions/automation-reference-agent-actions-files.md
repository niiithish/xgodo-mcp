# automation-reference-agent-actions-files

**Source:** https://xgodo.com/docs/automation/reference/agent/actions/files

**Scraped:** 2025-01-31T19:19:00.000Z

---

# File Actions

Actions

Save files to the device

Access these methods through `agent.actions`. Save data to files on the device.

**Note:** For reading files and advanced file operations, see [Utils > Files](https://xgodo.com/docs/automation/reference/agent/utils/files).

### `saveFile()`

TypeScriptCopy

```
saveFile(fileName: string, data: string, base64?: boolean): Promise<void>
```

Saves data to a file in the Downloads folder.

#### Parameters

| Name | Type | Description |
| --- | --- | --- |
| `fileName` | `string` | Name of the file to create |
| `data` | `string` | Content to save |
| `base64?` | `boolean` | If true, data is base64-encoded binary(default: `false`) |

#### Returns

`Promise<void>`Resolves when file is saved

#### Examples

Save text file

TypeScriptCopy

```
await agent.actions.saveFile("output.txt", "Hello World");
```

Save JSON data

TypeScriptCopy

```
const data = { name: "John", age: 30 };
await agent.actions.saveFile("data.json", JSON.stringify(data, null, 2));
```

Save binary file (base64)

TypeScriptCopy

```
// Save a screenshot
const { screenshot } = await agent.actions.screenshot(1080, 1920, 80);
if (screenshot) {
  await agent.actions.saveFile("screenshot.jpg", screenshot, true);
}
```

Save CSV export

TypeScriptCopy

```
const rows = [\
  ["Name", "Email", "Status"],\
  ["John", "john@example.com", "Active"],\
  ["Jane", "jane@example.com", "Inactive"]\
];
const csv = rows.map(row => row.join(",")).join("\n");
await agent.actions.saveFile("export.csv", csv);
```

Complete Example: Export Automation Results

TypeScriptCopy

```
async function exportResults(results: any[]) {
  // Save as JSON
  await agent.actions.saveFile(
    "results.json",
    JSON.stringify(results, null, 2)
  );

  // Save as CSV
  const headers = Object.keys(results[0]);
  const csvRows = [\
    headers.join(","),\
    ...results.map(r => headers.map(h => r[h]).join(","))\
  ];
  await agent.actions.saveFile("results.csv", csvRows.join("\n"));

  // Take a confirmation screenshot
  const { screenshot } = await agent.actions.screenshot(1080, 1920, 80);
  if (screenshot) {
    await agent.actions.saveFile("confirmation.jpg", screenshot, true);
  }

  console.log("Results exported to Downloads folder");
}
```