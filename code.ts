// code.ts

const lightPrefix = 'M3/sys/dark/';
const darkPrefix  = 'M3/sys/light/';

async function swapStyles() {
  try {
    console.log('🚀 [Material Swap] Plugin started');

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

    // 3) Swap light→dark on each node
    let swapCount = 0;
    for (const node of nodes) {
      for (const prop of ['fillStyleId', 'strokeStyleId'] as const) {
        const styleId = (node as any)[prop] as string | undefined;
        if (!styleId) continue;

        // Use the async version
        const style = await figma.getStyleByIdAsync(styleId);
        if (!style || !style.name.startsWith(lightPrefix)) continue;

        const darkName = style.name.replace(lightPrefix, darkPrefix);
        const darkStyle = paintStyles.find(s => s.name === darkName);
        if (darkStyle) {
          // Use async setters
          if (prop === 'fillStyleId' && 'setFillStyleIdAsync' in node) {
            await (node as any).setFillStyleIdAsync(darkStyle.id);
          } else if (prop === 'strokeStyleId' && 'setStrokeStyleIdAsync' in node) {
            await (node as any).setStrokeStyleIdAsync(darkStyle.id);
          }
          swapCount++;
          console.log(`   ✅ [${node.type}:${node.id}] ${style.name} → ${darkName}`);
        } else {
          console.warn(`   ⚠️ No dark style for "${style.name}" (expected "${darkName}")`);
        }
      }
    }

    console.log(`🎉 Done! Total swaps: ${swapCount}`);
    figma.notify(`Swapped ${swapCount} style binding(s) to dark.`);
    figma.closePlugin();
  } catch (err) {
    figma.notify('Material Swap: Error occurred, see console.');
    console.error('Material Swap Error:', err);
    figma.closePlugin();
  }
}

swapStyles();
