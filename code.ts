// code.ts

figma.showUI(__html__, { width: 360, height: 420 });

async function swapStyles(sourcePrefix: string, targetPrefix: string) {
  try {
    console.log('🚀 [Material Swap] Plugin started');
    console.log(`🔄 Swapping from "${sourcePrefix}" to "${targetPrefix}"`);

    // 1) Load styles
    console.log('🔍 Loading paint styles…');
    const paintStyles = await figma.getLocalPaintStylesAsync();
    console.log(`✅ Loaded ${paintStyles.length} paint styles`);

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
    console.log(`📦 Will process ${nodes.length} node(s)`);

    // 3) Swap styles on each node
    let swapCount = 0;
    for (const node of nodes) {
      for (const prop of ['fillStyleId', 'strokeStyleId'] as const) {
        const styleId = (node as any)[prop] as string | undefined;
        if (!styleId) continue;

        // Use the async version
        const style = await figma.getStyleByIdAsync(styleId);
        if (!style || !style.name.startsWith(sourcePrefix)) continue;

        const targetName = style.name.replace(sourcePrefix, targetPrefix);
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
          console.warn(`   ⚠️ No target style for "${style.name}" (expected "${targetName}")`);
        }
      }
    }

    console.log(`🎉 Done! Total swaps: ${swapCount}`);
    figma.notify(`Swapped ${swapCount} style binding(s).`);
    
    // Send results back to UI
    figma.ui.postMessage({
      type: 'swap-complete',
      count: swapCount
    });
    
    // Don't close the plugin automatically
    // figma.closePlugin();
    
    return swapCount;
  } catch (err) {
    figma.notify('Material Swap: Error occurred, see console.');
    console.error('Material Swap Error:', err);
    return 0;
  }
}

// Listen for messages from the UI
figma.ui.onmessage = async (msg) => {
  if (msg.type === 'swap-styles') {
    const { sourcePrefix, targetPrefix } = msg;
    await swapStyles(sourcePrefix, targetPrefix);
  } else if (msg.type === 'cancel') {
    figma.closePlugin();
  }
};
