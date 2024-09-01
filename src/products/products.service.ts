import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './schemas/product.schema';

@Injectable()
export class ProductsService {
  private readonly productsFolder: string;
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
    private readonly configService: ConfigService,
    private readonly cloudinaryService: CloudinaryService,
  ) {
    this.productsFolder = this.configService.get<string>(
      'CLOUDINARY_PRODUCTS_FOLDER',
    );
  }

  async create(createProductDto: CreateProductDto, file: Express.Multer.File) {
    try {
      let imageUrl: string | undefined;
      if (file) {
        const { secure_url } = await this.cloudinaryService.uploadFile(
          file,
          this.productsFolder,
        );
        imageUrl = secure_url;
      }
      return this.productModel.create({ ...createProductDto, imageUrl });
    } catch (error) {
      throw new BadRequestException('Error al crear el producto');
    }
  }

  findAll() {
    try {
      return this.productModel.find();
    } catch (error) {
      throw new InternalServerErrorException(
        'Error al obtener todos los productos',
      );
    }
  }

  async findOne(id: string) {
    try {
      const product = await this.productModel.findById(id);
      if (!product)
        throw new NotFoundException(`Producto con id ${id} no encontrado`);
      return product;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al obtener el producto ${id}`,
      );
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    try {
      const updatedProduct = await this.productModel.findByIdAndUpdate(
        id,
        updateProductDto,
        {
          new: true,
        },
      );

      if (!updatedProduct)
        throw new NotFoundException(`Producto con id ${id} no encontrado`);
      return updatedProduct;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al actualizar el producto ${id}`,
      );
    }
  }

  async remove(id: string) {
    try {
      const deletedProduct = await this.update(id, { isActive: false });
      return deletedProduct;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al eliminar el producto ${id}`,
      );
    }
  }
}
