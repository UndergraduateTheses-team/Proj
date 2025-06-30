const mediaHandler = require('./mediaHandler'); // Adjust path to your media handler file

describe('Media Server Tests', () => {
  it('should process media file successfully', () => {
    const mockFile = { path: '/tmp/test.mp4' };
    const result = mediaHandler.processMedia(mockFile);
    expect(result).toBe(true); // Adjust based on your function's return value
  });

  it('should handle invalid media file', () => {
    const mockFile = { path: '/tmp/invalid.txt' };
    expect(() => mediaHandler.processMedia(mockFile)).toThrow('Invalid media type');
  });
});