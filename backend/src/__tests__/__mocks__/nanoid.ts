/**
 * Manual mock for nanoid to avoid ESM import issues in Jest
 */

let callCount = 0;

export const nanoid = jest.fn((length: number = 7) => {
  // Return a consistent 7-character string for testing
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars[(callCount + i) % chars.length];
  }
  callCount++;
  return result;
});

export default nanoid;

