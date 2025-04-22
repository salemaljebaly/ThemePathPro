/**
 * Utility functions for handling style paths
 * @author Salem Aljebaly
 */

/**
 * Validate style path format
 * @param path The style path to validate
 * @returns A cleaned path ensuring proper format
 */
export function validateAndCleanPath(path: string): string {
  // Trim whitespace
  let cleanPath = path.trim();
  
  // Remove duplicate slashes
  while (cleanPath.includes('//')) {
    cleanPath = cleanPath.replace('//', '/');
  }
  
  // Ensure path ends with a single slash
  if (!cleanPath.endsWith('/')) {
    cleanPath += '/';
  }
  
  return cleanPath;
}

/**
 * Check if a style with the given prefix exists
 * @param prefix The style prefix to check
 * @param styles Array of paint styles
 * @returns Boolean indicating if at least one style with the prefix exists
 */
export function doesStyleWithPrefixExist(prefix: string, styles: PaintStyle[]): boolean {
  return styles.some(style => style.name.startsWith(prefix));
}
