import { Test, TestingModule } from '@nestjs/testing';
import { HashService } from './hash.service';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('HashService', () => {
  let service: HashService;
  const mockValue = 'value123';
  const mockHash = 'hashedValue';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HashService],
    }).compile();

    service = module.get<HashService>(HashService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('hash', () => {
    it('should hash the value', async () => {
      const salt = 'randomSalt';
      (bcrypt.genSalt as jest.Mock).mockResolvedValue(salt);
      (bcrypt.hash as jest.Mock).mockResolvedValue(mockHash);
      const result = await service.hash(mockValue);
      expect(result).toEqual(mockHash);
      expect(bcrypt.hash).toHaveBeenCalledWith(mockValue, salt);
    });
  });

  describe('compare', () => {
    it('should compare the value and hash', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      const result = await service.compare(mockValue, mockHash);
      expect(result).toBe(true);
      expect(bcrypt.compare).toHaveBeenCalledWith(mockValue, mockHash);
    });

    it('should return false for incorrect comparison', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);
      const result = await service.compare(mockValue, mockHash);
      expect(result).toBe(false);
      expect(bcrypt.compare).toHaveBeenCalledWith(mockValue, mockHash);
    });
  });
});
