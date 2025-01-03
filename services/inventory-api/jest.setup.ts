import '@testing-library/jest-dom';

jest.mock('@sellhub/db/src', () => ({
  db: {
    select: jest.fn(),
    update: jest.fn(),
    from: jest.fn().mockReturnThis(),
  },
}));
