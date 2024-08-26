import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { Model } from 'mongoose';
import { Product } from './schemas/product.schema';
import { getModelToken } from '@nestjs/mongoose';

describe('ProductsService', () => {
  let service: ProductsService;
  let model: Model<Product>;

  const mockProduct = {
    title: 'Mi new product',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getModelToken(Product.name),
          useValue: {
            create: jest.fn().mockResolvedValue(mockProduct),
            find: jest.fn().mockResolvedValue([mockProduct]),
            findById: jest.fn().mockResolvedValue(mockProduct),
            findByIdAndUpdate: jest.fn().mockResolvedValue(mockProduct),
            findByIdAndDelete: jest.fn().mockResolvedValue(mockProduct),
          },
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    model = module.get<Model<Product>>(getModelToken(Product.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a product', async () => {
    const result = await service.create(mockProduct);
    expect(result).toEqual(mockProduct);
    expect(model.create).toHaveBeenCalledWith(mockProduct);
  });

  it('should find all products', async () => {
    const result = await service.findAll();
    expect(result).toEqual([mockProduct]);
    expect(model.find).toHaveBeenCalled();
  });

  it('should find one product by ID', async () => {
    const result = await service.findOne('productId123');
    expect(result).toEqual(mockProduct);
    expect(model.findById).toHaveBeenCalledWith('productId123');
  });

  it('should update a product by ID', async () => {
    const updateProductDto = { title: 'Updated title' };
    const result = await service.update('productId123', updateProductDto);
    expect(result).toEqual(mockProduct);
    expect(model.findByIdAndUpdate).toHaveBeenCalledWith(
      'productId123',
      updateProductDto,
      { new: true },
    );
  });

  it('should delete a product by ID', async () => {
    const result = await service.remove('productId123');
    expect(result).toEqual(mockProduct);
    expect(model.findByIdAndDelete).toHaveBeenCalledWith(
      { _id: 'productId123' },
      { new: true },
    );
  });
});
