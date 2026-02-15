// Type definitions for the Xgodo Automation Agent API
// Complete type definitions based on official documentation

declare global {
    /** Sleep for a specified duration in milliseconds */
    function sleep(ms: number): Promise<void>;
    /** Sleep for a random duration between min and max milliseconds */
    function sleep(minMs: number, maxMs: number): Promise<void>;

    /** The automation agent API */
    const agent: Agent;

    /** Get all nodes from a screen content tree */
    function getAllNodes(screenContent: AndroidNode | null | undefined): AndroidNode[];
    
    /** Build the path from root to target node */
    function buildNodePath(rootNode: AndroidNode | null | undefined, targetNode: AndroidNode | null | undefined): AndroidNode[];
    
    /** Find all nodes with matching viewId */
    function findNodesById(rootNode: AndroidNode | null | undefined, id: string): AndroidNode[];
    
    /** Find all nodes containing specified text */
    function findNodesByText(rootNode: AndroidNode | null | undefined, text: string): AndroidNode[];
    
    /** Find parent of target node */
    function findParentOf(rootNode: AndroidNode | null | undefined, targetNode: AndroidNode | null | undefined): AndroidNode | null;

    /** Screenshot recording quality enum */
    enum ScreenshotRecord {
        HIGH_QUALITY,
        LOW_QUALITY,
        NONE
    }
}

/** Main Agent interface */
interface Agent {
    /** Actions to interact with the device */
    actions: AgentActions;
    /** Utility functions */
    utils: AgentUtils;
    /** Control functions for automation flow */
    control: AgentControl;
    /** Constants used in automation */
    constants: AgentConstants;
    /** Device and automation info */
    info: AgentInfo;
    /** Display overlay functions */
    display: AgentDisplay;
    /** Arguments passed to the automation */
    arguments: AgentArguments;
    /** Record usage statistics */
    recordUsage(type: string, usage: number): void;
    /** Email utilities */
    email: AgentEmail;
    /** Notification utilities */
    notifications: AgentNotifications;
}

/** Arguments passed to automation */
interface AgentArguments {
    automationParameters: Record<string, any>;
    jobVariables: Record<string, any>;
}

/** Device Actions */
interface AgentActions {
    // --- Touch Gestures ---
    /** Tap at specific coordinates */
    tap(x: number, y: number): Promise<void>;
    /** Double tap at specific coordinates */
    doubleTap(x: number, y: number, interval?: number): Promise<void>;
    /** Perform multiple taps in sequence */
    multiTap(sequence: MultiTapSequenceItem[]): Promise<void>;
    /** Hold/long press at specific coordinates */
    hold(x: number, y: number, duration: number): Promise<void>;
    /** Perform a swipe gesture */
    swipe(x1: number, y1: number, x2: number, y2: number, duration: number): Promise<void>;
    /** Perform a multi-point swipe */
    swipePoly(startX: number, startY: number, sequence: Point[], duration: number, bezier?: boolean): Promise<void>;

    // --- Navigation & System ---
    /** Go to the home screen */
    goHome(): Promise<void>;
    /** Go back */
    goBack(): Promise<void>;
    /** Open Recents menu */
    recents(): Promise<void>;
    /** Interact with the D-Pad (Android 13+) */
    dpad(direction: "up" | "down" | "left" | "right" | "center"): Promise<void>;

    // --- Text Input ---
    /** Type text into the focused input */
    writeText(text: string): Promise<void>;
    /** Copy text to clipboard */
    copyText(text: string): Promise<void>;
    /** Paste text from clipboard */
    paste(): Promise<void>;
    /** Get clipboard content */
    reverseCopy(): Promise<ClipboardContent>;
    /** Hide the keyboard */
    hideKeyboard(): Promise<void>;
    /** Input a specific key event (Android 13+) */
    inputKey(keyCode: number, duration?: number, state?: "down" | "up" | null): Promise<void>;

    // --- App Management ---
    /** Launch an Android app by package name */
    launchApp(packageName: string, clearExisting?: boolean): Promise<void>;
    /** Launch an Android intent */
    launchIntent(intentName: string, packageName: string | null, data: string | null, type: string | null, extras: object | null, flags: number, component: "activity" | "service" | "broadcast", isDataLocal?: boolean): Promise<void>;
    /** List installed apps */
    listApps(): Promise<Record<string, string>>;
    /** Browse a URL */
    browse(url: string, clearExistingData?: boolean): Promise<void>;

    // --- Screen Content & Analysis ---
    /** Get the current screen content/accessibility tree */
    screenContent(): Promise<AndroidNode>;
    /** Get screen content from all displays */
    allScreensContent(): Promise<AndroidNode[]>;
    /** Take a screenshot */
    screenshot(maxWidth: number, maxHeight: number, quality: number, cropX1?: number, cropY1?: number, cropX2?: number, cropY2?: number): Promise<ScreenshotResult>;
    /** Perform an accessibility action on a node */
    nodeAction(node: AndroidNode | object, actionInt: number, data?: object, fieldsToIgnore?: string[]): Promise<{actionPerformed: boolean}>;
    /** Show a system notification */
    showNotification(title: string, message: string): Promise<void>;

    // --- File Operations ---
    /** Save a file to the device */
    saveFile(fileName: string, data: string, base64?: boolean): Promise<void>;

    // --- Network ---
    /** Toggle airplane mode */
    airplane(): Promise<void>;

    // --- OCR ---
    /** Recognize text in an image using OCR */
    recognizeText(imageBase64: string): Promise<TextJSON>;
}

/** Agent Utilities */
interface AgentUtils {
    // --- Helper Utilities ---
    /** Perform a random click within bounds */
    randomClick(x1: number, y1: number, x2: number, y2: number): void;
    /** Perform a random swipe gesture */
    randomSwipe(x1: number, y1: number, x2: number, y2: number, direction: "up" | "down" | "left" | "right"): void;
    /** Check if server is reachable */
    isServerReachable(): Promise<{ reachable: true } | { reachable: false; error: string }>;
    /** Wait for a node to appear on screen */
    waitForNode(condition: (node: AndroidNode) => boolean, durationMs?: number, intervalMs?: number): Promise<boolean>;
    /** Wait for a node to disappear from screen */
    waitForNodeGone(condition: (node: AndroidNode) => boolean, durationMs?: number, intervalMs?: number): Promise<boolean>;

    // --- Event Callbacks ---
    /** Set a callback for network events */
    setNetworkCallback(callback: ((networkAvailable: boolean) => void) | null): void;
    /** Toast callback */
    toastCallback: ((packageName: string, data: { message: string }) => void) | null;

    // --- Job Management ---
    /** Job reporting utilities */
    job: JobUtils;
    
    // --- Step Tracking ---
    /** Out of steps reporting utilities */
    outOfSteps: OutOfStepsUtils;
    
    // --- File Operations ---
    /** File utilities */
    files: AgentFiles;

    // --- Automation Variables ---
    /** Get automation variables */
    getAutomationVariables(): Promise<{ success: false; error: string } | { success: true; automation_variables: any }>;
    /** Set automation variables */
    setAutomationVariables(variables: object): Promise<{ success: false; error: string } | { success: true; automation_variables: any }>;
}

/** Agent Info */
interface AgentInfo {
    /** Get device info */
    getDeviceInfo(): DeviceInfo;
    /** Get automation info */
    getAutomationInfo(): AutomationInfo;
}

/** Agent Control */
interface AgentControl {
    /** Stop the current automation */
    stopCurrentAutomation(): void;
}

/** Agent Display */
interface AgentDisplay {
    /** Display an HTML overlay on screen */
    displayHTMLCode(htmlCode: string, x1: number, y1: number, x2: number, y2: number, opacity: number): void;
    /** Hide the HTML overlay */
    hideHTMLCode(): void;
}

/** Agent Constants */
interface AgentConstants {
    // Basic Actions
    ACTION_FOCUS: number;
    ACTION_CLEAR_FOCUS: number;
    ACTION_SELECT: number;
    ACTION_CLEAR_SELECTION: number;
    ACTION_CLICK: number;
    ACTION_LONG_CLICK: number;
    ACTION_ACCESSIBILITY_FOCUS: number;
    ACTION_CLEAR_ACCESSIBILITY_FOCUS: number;
    
    // Navigation Actions
    ACTION_NEXT_AT_MOVEMENT_GRANULARITY: number;
    ACTION_PREVIOUS_AT_MOVEMENT_GRANULARITY: number;
    ACTION_NEXT_HTML_ELEMENT: number;
    ACTION_PREVIOUS_HTML_ELEMENT: number;
    
    // Scroll Actions
    ACTION_SCROLL_FORWARD: number;
    ACTION_SCROLL_BACKWARD: number;
    ACTION_SCROLL_UP: number;
    ACTION_SCROLL_DOWN: number;
    ACTION_SCROLL_LEFT: number;
    ACTION_SCROLL_RIGHT: number;
    ACTION_SCROLL_TO_POSITION: number;
    ACTION_SCROLL_IN_DIRECTION: number;
    ACTION_PAGE_UP: number;
    ACTION_PAGE_DOWN: number;
    ACTION_PAGE_LEFT: number;
    ACTION_PAGE_RIGHT: number;
    
    // Editing Actions
    ACTION_CUT: number;
    ACTION_COPY: number;
    ACTION_PASTE: number;
    ACTION_SET_SELECTION: number;
    ACTION_SET_TEXT: number;
    
    // Expand/Collapse Actions
    ACTION_EXPAND: number;
    ACTION_COLLAPSE: number;
    ACTION_DISMISS: number;
    
    // Advanced Actions
    ACTION_SHOW_ON_SCREEN: number;
    ACTION_SET_PROGRESS: number;
    ACTION_CONTEXT_CLICK: number;
    ACTION_SHOW_TOOLTIP: number;
    ACTION_HIDE_TOOLTIP: number;
    ACTION_PRESS_AND_HOLD: number;
    ACTION_IME_ENTER: number;
    ACTION_SHOW_TEXT_SUGGESTIONS: number;
    ACTION_MOVE_WINDOW: number;
    
    // Drag Actions
    ACTION_DRAG_START: number;
    ACTION_DRAG_DROP: number;
    ACTION_DRAG_CANCEL: number;
    
    // Argument Constants
    ACTION_ARGUMENT_MOVEMENT_GRANULARITY_INT: string;
    ACTION_ARGUMENT_HTML_ELEMENT_STRING: string;
    ACTION_ARGUMENT_EXTEND_SELECTION_BOOLEAN: string;
    ACTION_ARGUMENT_SELECTION_START_INT: string;
    ACTION_ARGUMENT_SELECTION_END_INT: string;
    ACTION_ARGUMENT_SET_TEXT_CHARSEQUENCE: string;
    ACTION_ARGUMENT_MOVE_WINDOW_X: string;
    ACTION_ARGUMENT_MOVE_WINDOW_Y: string;
    ACTION_ARGUMENT_ACCESSIBLE_CLICKABLE_SPAN: string;
    ARGUMENT_PRESS_AND_HOLD_DURATION_MILLIS_INT: string;
    ARGUMENT_DIRECTION_INT: string;
    ARGUMENT_SCROLL_AMOUNT_FLOAT: string;
}

/** Agent Email */
interface AgentEmail {
    // Email operations via IMAP
    [key: string]: any;
}

/** Agent Notifications */
interface AgentNotifications {
    // Notification handling
    [key: string]: any;
}

/** Job Utils */
interface JobUtils {
    submitTask(status: "running" | "success" | "failed" | "declined", data: Record<string, any>, finish: boolean, files: TaskFile[]): Promise<TaskResult>;
    useAnotherTask(): Promise<{ job_task_id: string; job_proof: string } | null>;
    getCurrentTask(): Promise<{ success: false; error: string } | { success: true; parent_task_id: string; job_proof: any; timeout: number }>;
}

/** Out of Steps Utils */
interface OutOfStepsUtils {
    storeScreen(screen: AndroidNode, stage: string, screenState: string, remainingSteps: number, screenshotRecord: ScreenshotRecord): Promise<void>;
    submit(type: "outOfSteps" | "timeout" | "debug"): Promise<{ success: false; error: string } | { success: true; id: string }>;
}

/** Agent Files */
interface AgentFiles {
    exists(path: string): boolean;
    getSize(filePath: string): number;
    readFullFileBase64(filePath: string): string;
    readFullFile(filePath: string): string;
    openStream(filePath: string): string;
    readChunk(streamId: string, chunkSize: number): number[];
    closeStream(streamId: string): void;
    list(dirPath: string): FileInfo[];
    getPathInfo(path: string): DirectoryInfo | FilePathInfo | PathNotFoundInfo;
    getStorageRoot(): string;
    getHashes(filePath: string): FileHashes | FileHashError;
    base64ToBytes(base64: string): Uint8Array;
    bytesToBlob(bytes: number[] | Uint8Array, mimeType?: string): Blob | null;
    readFileAsBlob(filePath: string, mimeType?: string): Blob | null;
}

// --- Supporting Types ---

/** Point for swipe gestures */
interface Point {
    x: number;
    y: number;
}

/** Multi-tap sequence item */
interface MultiTapSequenceItem {
    x: number;
    y: number;
    delay: number;
}

/** Bounds rectangle for node position on screen */
interface BoundsRect {
    left: number;
    top: number;
    right: number;
    bottom: number;
}

/** Android accessibility node - represents a UI element */
interface AndroidNode {
    // Basic Properties
    className: string;
    packageName: string;
    viewId?: string;
    text?: string;
    description?: string;
    hintText?: string;
    
    // State Properties
    isClickable: boolean;
    isEditable: boolean;
    isEnabled: boolean;
    isFocusable: boolean;
    isFocused: boolean;
    isLongClickable: boolean;
    isPassword: boolean;
    isScrollable: boolean;
    isSelected: boolean;
    isVisibleToUser: boolean;
    isCheckable: boolean;
    isChecked: boolean;
    
    // Bounds
    boundsInScreen: BoundsRect;
    
    // Hierarchy
    children: AndroidNode[];
    parent?: AndroidNode;
    
    // Actions
    actions: number[];
    
    // Collection Info
    collectionItemInfo?: {
        rowIndex: number;
        columnIndex: number;
        rowSpan: number;
        columnSpan: number;
        isSelected: boolean;
    };
    
    // Methods
    performAction(action: number, data?: object): Promise<{actionPerformed: boolean}>;
    randomClick(): void;
    randomSwipe(direction: "up" | "down" | "left" | "right"): void;
}

/** Screen content interface for querying the UI tree */
interface ScreenContent {
    find(predicate: (node: AndroidNode) => boolean): AndroidNode | undefined;
    findAdvanced(filterFn: (filter: FilterBuilder) => FilterBuilder | boolean): AndroidNode | undefined;
    filterAdvanced(filterFn: (filter: FilterBuilder) => FilterBuilder | boolean): AndroidNode[];
    findTextOne(text: string): AndroidNode | undefined;
    findById(id: string): AndroidNode[];
    findByIdOne(id: string): AndroidNode | undefined;
    allNodes(): AndroidNode[];
    randomSwipe(direction: "up" | "down" | "left" | "right"): Promise<void>;
}

/** Filter builder for advanced node queries */
interface FilterBuilder {
    hasText(text: string): FilterBuilder;
    hasDescription(desc: string): FilterBuilder;
    hasViewId(id: string): FilterBuilder;
    hasClassName(className: string): FilterBuilder;
    hasPackageName(packageName: string): FilterBuilder;
    isClickable(): FilterBuilder;
    isEditable(): FilterBuilder;
    isEnabled(): FilterBuilder;
    isFocusable(): FilterBuilder;
    isFocused(): FilterBuilder;
    isLongClickable(): FilterBuilder;
    isPassword(): FilterBuilder;
    isScrollable(): FilterBuilder;
    isSelected(): FilterBuilder;
    isVisibleToUser(): FilterBuilder;
    isCheckable(): FilterBuilder;
    isChecked(): FilterBuilder;
}

/** Clipboard content */
interface ClipboardContent {
    text: string;
    data?: any;
    files?: {
        uri: string;
        mimeType: string;
        name: string;
        dataBase64: string;
    }[];
}

/** Screenshot result */
interface ScreenshotResult {
    screenshot: string | null;
    compressedWidth: number;
    compressedHeight: number;
    originalWidth: number;
    originalHeight: number;
}

/** Task file for job submission */
interface TaskFile {
    name: string;
    extension: string;
    base64Data: string;
}

/** Task result */
interface TaskResult {
    success: boolean;
    error?: string;
}

/** File info */
interface FileInfo {
    name: string;
    path: string;
    isDirectory: boolean;
    isFile: boolean;
    size: number;
    lastModified: number;
}

/** Directory info */
interface DirectoryInfo {
    exists: true;
    path: string;
    name: string;
    isDirectory: true;
    isFile: false;
    lastModified: number;
    canRead: boolean;
    canWrite: boolean;
    fileCount: number;
    directoryCount: number;
    totalItems: number;
}

/** File path info */
interface FilePathInfo {
    exists: true;
    path: string;
    name: string;
    isDirectory: false;
    isFile: true;
    lastModified: number;
    canRead: boolean;
    canWrite: boolean;
    size: number;
}

/** Path not found info */
interface PathNotFoundInfo {
    exists: false;
    error?: string;
}

/** File hashes */
interface FileHashes {
    md5: string;
    sha1: string;
    sha256: string;
    size: number;
}

/** File hash error */
interface FileHashError {
    error: string;
}

/** Upload temp file result */
interface UploadTempFileResult {
    success: true;
    message: string;
    data: {
        filename: string;
        originalName: string;
        size: number;
        url: string;
        expiresAt: string;
    };
}

/** Automation info */
interface AutomationInfo {
    name: string;
    description: string;
    launchId: string;
    agent?: {
        id: string;
        commitId: string;
        token: string;
        jobTaskId: string;
    };
    serverBaseUrl: string;
    timeout?: number;
}

/** Device info */
interface DeviceInfo {
    id: string;
    brand: string;
    model: string;
    sdkVersion: number;
    processor: string;
    numberOfCores: number;
    ramMb: number;
    country: string;
    isEmulator: boolean;
    width: number;
    height: number;
}

/** OCR Text JSON */
interface TextJSON {
    text: string;
    blocks?: OCRTextBlock[];
}

/** OCR Text Block */
interface OCRTextBlock {
    text: string;
    boundingBox: OCRBoundingBox;
    lines: OCRLine[];
}

/** OCR Line */
interface OCRLine {
    text: string;
    boundingBox: OCRBoundingBox;
    elements: OCRElement[];
}

/** OCR Element */
interface OCRElement {
    text: string;
    boundingBox: OCRBoundingBox;
}

/** OCR Bounding Box */
interface OCRBoundingBox {
    left: number;
    top: number;
    right: number;
    bottom: number;
}

export { };