const cleanGeminiResponse = (response, options = {}) => {
  if (!response) return '';

  const {
    removeCodeBlocks = true,
    removeHeaders = true,
    removeBulletPoints = true,
    removeSpecialChars = true,
    normalizeQuotes = true,
    normalizeWhitespace = true,
    replaceEscapedNewlines = true,
    removePlaceholders = true,
  } = options;

  let cleaned = response;

  if (removeCodeBlocks) {
    cleaned = cleaned.replace(/```[\s\S]*?```/g, '');
  }

  if (removeHeaders) {
    cleaned = cleaned.replace(/#{1,6}\s+([^\n]+)/g, '$1');
  }

  if (removeBulletPoints) {
    cleaned = cleaned.replace(/^[\s]*[-*+]\s+/gm, '');
    cleaned = cleaned.replace(/^[\s]*\d+\.\s+/gm, '');
  }

  if (removeSpecialChars) {
    cleaned = cleaned.replace(/[\/\\:*"<>|]/g, '');
  }

  if (normalizeQuotes) {
    cleaned = cleaned.replace(/[""]/g, '"');
    cleaned = cleaned.replace(/['']/g, "'");
  }

  if (replaceEscapedNewlines) {
    // Replace escaped newlines with actual newlines
    cleaned = cleaned.replace(/\\n/g, '');
  }

  if (removePlaceholders) {
    // Remove placeholder text like [User Name]
    cleaned = cleaned.replace(/\[([^\]]+)\]/g, '');
  }

  // if (normalizeWhitespace) {
  //   cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
  //   cleaned = cleaned.trim();
  // }

  console.log('Cleaned response length:', cleaned.length);
  return cleaned;
};

export default cleanGeminiResponse;
