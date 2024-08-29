import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './schemas/product.schema';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
    private readonly configService: ConfigService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(createProductDto: CreateProductDto, file: Express.Multer.File) {
    if (file) {
      try {
        const productsFolder = this.configService.get<string>(
          'CLOUDINARY_PRODUCTS_FOLDER',
        );
        // eslint-disable-next-line
        const { secure_url } = await this.cloudinaryService.uploadFile(
          file,
          productsFolder,
        );
        //createProductDto.imageUrl = secure_url;
      } catch (error) {
        console.log({ error });
        throw new BadRequestException('Error al subir la imagen');
      }
    }
    return this.productModel.create(createProductDto);
  }

  findAll() {
    return this.productModel.find();
  }

  findOne(id: string) {
    return this.productModel.findById(id);
  }

  update(id: string, updateProductDto: UpdateProductDto) {
    return this.productModel.findByIdAndUpdate(id, updateProductDto, {
      new: true,
    });
  }

  remove(id: string) {
    return this.productModel.findByIdAndDelete({ _id: id }, { new: true });
  }
}
