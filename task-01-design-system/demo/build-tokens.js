const fs = require('fs');
const path = require('path');

// Determine input and output paths
let tokensPath = path.resolve(process.cwd(), 'demo/tokens.json');
let outputPath = path.resolve(process.cwd(), 'demo/tokens.css');

if (!fs.existsSync(tokensPath)) {
  tokensPath = path.resolve(__dirname, 'tokens.json');
  outputPath = path.resolve(__dirname, 'tokens.css');
}

// Allow CLI argument overrides if provided
if (process.argv[2]) {
  tokensPath = path.resolve(process.argv[2]);
}
if (process.argv[3]) {
  outputPath = path.resolve(process.argv[3]);
}

console.log(`Reading tokens from: ${tokensPath}`);
const tokens = JSON.parse(fs.readFileSync(tokensPath, 'utf8'));

// Helper: convert 8-digit hex (#rrggbbaa) to 6-digit hex or rgba
function formatColor(hex) {
  if (typeof hex !== 'string') return hex;
  const trimmed = hex.trim();
  if (trimmed.startsWith('#') && trimmed.length === 9) {
    const alphaHex = trimmed.slice(7, 9).toLowerCase();
    if (alphaHex === 'ff') {
      return trimmed.slice(0, 7).toLowerCase();
    }
    const r = parseInt(trimmed.slice(1, 3), 16);
    const g = parseInt(trimmed.slice(3, 5), 16);
    const b = parseInt(trimmed.slice(5, 7), 16);
    const a = Math.round((parseInt(alphaHex, 16) / 255) * 100) / 100;
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  }
  return trimmed.toLowerCase();
}

// 1. Primitive Palette Variables (--palette-primary-40)
const primitiveVars = [];
const palettes = tokens.primitives?.['color palettes'] || {};

for (const [paletteName, tones] of Object.entries(palettes)) {
  const paletteSlug = paletteName.toLowerCase().trim().replace(/\s+/g, '-');
  
  // Sort tones numerically
  const sortedToneKeys = Object.keys(tones).sort((a, b) => {
    const numA = parseInt(a.match(/\d+$/)?.[0] || '0', 10);
    const numB = parseInt(b.match(/\d+$/)?.[0] || '0', 10);
    return numA - numB;
  });

  for (const toneKey of sortedToneKeys) {
    const toneMatch = toneKey.match(/\d+$/);
    const toneNum = toneMatch ? toneMatch[0] : toneKey;
    const varName = `--palette-${paletteSlug}-${toneNum}`;
    const rawVal = tones[toneKey]?.value || '';
    const formattedVal = formatColor(rawVal);
    primitiveVars.push({ name: varName, value: formattedVal });
  }
}

// 2. Color Role Variables (Must REFERENCE primitives, NEVER copy raw hex)
const roleVars = [];
const colorRoles = tokens['color roles'] || {};

for (const [roleName, roleObj] of Object.entries(colorRoles)) {
  const roleSlug = roleName.toLowerCase().trim().replace(/\s+/g, '-');
  const roleVarName = `--color-${roleSlug}`;
  
  const rawRef = (roleObj.value || '').replace(/^\{|\}$/g, '').trim();
  const prefix = 'primitives.color palettes.';
  
  let refVar = '';
  if (rawRef.startsWith(prefix)) {
    const rest = rawRef.slice(prefix.length);
    const lastDot = rest.lastIndexOf('.');
    const refPalette = rest.slice(0, lastDot);
    const refToneKey = rest.slice(lastDot + 1);
    const refPaletteSlug = refPalette.toLowerCase().trim().replace(/\s+/g, '-');
    const refToneMatch = refToneKey.match(/\d+$/);
    const refTone = refToneMatch ? refToneMatch[0] : refToneKey;
    refVar = `--palette-${refPaletteSlug}-${refTone}`;
  } else {
    throw new Error(`Unrecognized reference format for role "${roleName}": ${roleObj.value}`);
  }

  // Ensure reference points to an existing primitive variable
  const exists = primitiveVars.some(p => p.name === refVar);
  if (!exists) {
    console.warn(`Warning: Primitive variable ${refVar} not found for role ${roleName}`);
  }

  roleVars.push({ name: roleVarName, value: `var(${refVar})` });
}

// 3. Typography Variables (all 15 styles)
const typographyVars = [];
const typographyStyles = [
  'display large', 'display medium', 'display small',
  'headline large', 'headline medium', 'headline small',
  'title large', 'title medium', 'title small',
  'body large', 'body medium', 'body small',
  'label large', 'label medium', 'label small'
];

const typoData = tokens.typography || {};

for (const styleName of typographyStyles) {
  const styleObj = typoData[styleName];
  if (!styleObj) {
    console.warn(`Warning: Typography style "${styleName}" not found in tokens.json`);
    continue;
  }
  const slug = styleName.toLowerCase().trim().replace(/\s+/g, '-');
  
  const fontFamilyVal = styleObj.fontFamily?.value || 'Source Sans 3';
  const fontFamily = fontFamilyVal.includes(',') ? fontFamilyVal : `'${fontFamilyVal}', sans-serif`;
  const size = styleObj.fontSize ? `${styleObj.fontSize.value}px` : '';
  const weight = styleObj.fontWeight ? styleObj.fontWeight.value : 400;
  const lineHeight = styleObj.lineHeight ? `${styleObj.lineHeight.value}px` : '';
  const letterSpacing = styleObj.letterSpacing ? `${styleObj.letterSpacing.value}px` : '0px';

  typographyVars.push({ name: `--type-${slug}-font-family`, value: fontFamily });
  typographyVars.push({ name: `--type-${slug}-size`, value: size });
  typographyVars.push({ name: `--type-${slug}-weight`, value: weight });
  typographyVars.push({ name: `--type-${slug}-line-height`, value: lineHeight });
  typographyVars.push({ name: `--type-${slug}-letter-spacing`, value: letterSpacing });
}

// 4. Shadow Variables
const shadowVars = [];
const effects = tokens.effect || {};

const shadowMappings = [
  { key: 'soft shadow', varName: '--shadow-soft' },
  { key: 'medium shadow', varName: '--shadow-medium' },
  { key: 'hard shadow', varName: '--shadow-hard' }
];

for (const { key, varName } of shadowMappings) {
  const effectObj = effects[key];
  if (effectObj && effectObj.value) {
    const val = effectObj.value;
    const x = val.offsetX !== undefined ? `${val.offsetX}px` : '0px';
    const y = val.offsetY !== undefined ? `${val.offsetY}px` : '0px';
    const blur = val.radius !== undefined ? `${val.radius}px` : '0px';
    const spread = val.spread !== undefined ? `${val.spread}px` : '0px';
    const color = formatColor(val.color || '#000000');
    shadowVars.push({ name: varName, value: `${x} ${y} ${blur} ${spread} ${color}` });
  }
}

// Build CSS Output
const cssLines = [];
cssLines.push(':root {');
cssLines.push('  /* ==========================================================================');
cssLines.push('     Primitive Palette Tones (internal references only - do not use in UI)');
cssLines.push('     ========================================================================== */');
for (const p of primitiveVars) {
  cssLines.push(`  ${p.name}: ${p.value};`);
}

cssLines.push('');
cssLines.push('  /* ==========================================================================');
cssLines.push('     Color Roles (reference palette primitives - use these in components)');
cssLines.push('     ========================================================================== */');
for (const r of roleVars) {
  cssLines.push(`  ${r.name}: ${r.value};`);
}

cssLines.push('');
cssLines.push('  /* ==========================================================================');
cssLines.push('     Typography Variables (all 15 styles)');
cssLines.push('     ========================================================================== */');
for (const t of typographyVars) {
  cssLines.push(`  ${t.name}: ${t.value};`);
}

cssLines.push('');
cssLines.push('  /* ==========================================================================');
cssLines.push('     Shadow Variables');
cssLines.push('     ========================================================================== */');
for (const s of shadowVars) {
  cssLines.push(`  ${s.name}: ${s.value};`);
}
cssLines.push('}');
cssLines.push('');

const cssContent = cssLines.join('\n');
fs.writeFileSync(outputPath, cssContent, 'utf8');
console.log(`Successfully generated ${outputPath}`);
