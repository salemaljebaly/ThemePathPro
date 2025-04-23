/**
 * ThemePathPro - Figma Plugin
 * @author Salem Aljebaly
 * @github https://github.com/salemaljebaly
 */

import { validateAndCleanPath, doesStyleWithPrefixExist } from './utils/pathUtils';

/**
 * Main function to swap styles based on provided prefixes
 */
async function swapStyles(sourcePrefix: string, targetPrefix: string) {
  try {
    console.log('🚀 [Material Swap] Plugin started');
    
    // Validate and clean paths
    const cleanSourcePrefix = validateAndCleanPath(sourcePrefix);
    const cleanTargetPrefix = validateAndCleanPath(targetPrefix);
    
    // Log any changes made to the paths
    if (cleanSourcePrefix !== sourcePrefix) {
      console.log(`ℹ️ Source path normalized: "${sourcePrefix}" → "${cleanSourcePrefix}"`);
      
      // Notify UI of the path correction
      figma.ui.postMessage({
        type: 'path-corrected',
        sourcePrefix: cleanSourcePrefix,
        targetPrefix: cleanTargetPrefix
      });
    }
    
    console.log(`🔄 Swapping from "${cleanSourcePrefix}" to "${cleanTargetPrefix}"`);

    // 1) Load styles
    console.log('🔍 Loading paint styles…');
    const paintStyles = await figma.getLocalPaintStylesAsync();
    console.log(`✅ Loaded ${paintStyles.length} paint styles`);
    
    // Validate that styles with the given prefixes exist
    const sourceStylesExist = doesStyleWithPrefixExist(cleanSourcePrefix, paintStyles);
    if (!sourceStylesExist) {
      const errorMessage = `No styles found with prefix "${cleanSourcePrefix}"`;
      console.error(`❌ ${errorMessage}`);
      figma.notify(`Error: ${errorMessage}`, { error: true });
      
      figma.ui.postMessage({
        type: 'error',
        message: errorMessage
      });
      
      return 0;
    }
    
    // Check if target styles exist (this is a warning, not an error)
    const targetStylesExist = doesStyleWithPrefixExist(cleanTargetPrefix, paintStyles);
    if (!targetStylesExist) {
      const warningMessage = `Warning: No styles found with target prefix "${cleanTargetPrefix}". New styles may not be found.`;
      console.warn(`⚠️ ${warningMessage}`);
      figma.notify(warningMessage, { timeout: 5000 });
      
      figma.ui.postMessage({
        type: 'warning',
        message: warningMessage
      });
    }

    // 2) Determine scope: selection vs whole page
    const sel = figma.currentPage.selection;
    let nodes: SceneNode[];
    if (sel.length) {
      // Flatten selection + all descendants
      nodes = sel.reduce<SceneNode[]>((all, node) => {
        if ('findAll' in node) {
          const children = (node as SceneNode & { findAll: Function })
            .findAll(() => true) as SceneNode[];
          return all.concat(children);
        }
        return all.concat(node);
      }, []);
    } else {
      // Entire page: any node that can have fillStyleId or strokeStyleId
      nodes = figma.currentPage.findAll(node =>
        'fillStyleId' in node || 'strokeStyleId' in node
      ) as SceneNode[];
    }
    
    if (nodes.length === 0) {
      const errorMessage = 'No applicable nodes found. Please select at least one node or ensure the page contains nodes with styles.';
      console.error(`❌ ${errorMessage}`);
      
      figma.ui.postMessage({
        type: 'error',
        message: errorMessage
      });
      
      return 0;
    }
    
    console.log(`📦 Will process ${nodes.length} node(s)`);

    // 3) Swap styles on each node
    let swapCount = 0;
    let errorCount = 0;
    for (const node of nodes) {
      for (const prop of ['fillStyleId', 'strokeStyleId'] as const) {
        const styleId = (node as any)[prop] as string | undefined;
        if (!styleId) continue;

        try {
          // Use the async version
          const style = await figma.getStyleByIdAsync(styleId);
          if (!style || !style.name.startsWith(cleanSourcePrefix)) continue;

          const targetName = style.name.replace(cleanSourcePrefix, cleanTargetPrefix);
          const targetStyle = paintStyles.find(s => s.name === targetName);
          if (targetStyle) {
            // Use async setters
            if (prop === 'fillStyleId' && 'setFillStyleIdAsync' in node) {
              await (node as any).setFillStyleIdAsync(targetStyle.id);
            } else if (prop === 'strokeStyleId' && 'setStrokeStyleIdAsync' in node) {
              await (node as any).setStrokeStyleIdAsync(targetStyle.id);
            }
            swapCount++;
            console.log(`   ✅ [${node.type}:${node.id}] ${style.name} → ${targetName}`);
          } else {
            errorCount++;
            const missingMessage = `No target style for "${style.name}" (expected "${targetName}")`;
            console.warn(`   ⚠️ ${missingMessage}`);
          }
        } catch (err) {
          errorCount++;
          console.error(`   ❌ Error processing node [${node.type}:${node.id}]:`, err);
        }
      }
    }

    console.log(`🎉 Done! Total swaps: ${swapCount}, Errors/Warnings: ${errorCount}`);
    figma.notify(`Swapped ${swapCount} style binding(s). ${errorCount > 0 ? `(${errorCount} errors/warnings)` : ''}`);
    
    // Send results back to UI
    figma.ui.postMessage({
      type: 'swap-complete',
      count: swapCount,
      errorCount
    });
    
    return swapCount;
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error('Material Swap Error:', err);
    figma.notify(`Material Swap: Error occurred - ${errorMessage}`, { error: true });
    
    figma.ui.postMessage({
      type: 'error',
      message: errorMessage
    });
    
    return 0;
  }
}

// Initialize plugin with UI
figma.showUI(__html__, { width: 360, height: 450 });

// Listen for messages from the UI
figma.ui.onmessage = async (msg) => {
  if (msg.type === 'swap-styles') {
    const { sourcePrefix, targetPrefix } = msg;
    await swapStyles(sourcePrefix, targetPrefix);
  } else if (msg.type === 'cancel') {
    figma.closePlugin();
  }
};
