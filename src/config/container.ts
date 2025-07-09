import { DatabasePool } from "./database";
import { DatabaseService } from "../services/database.service";
import { CategoryRepository } from "../repositories/category.repository";
import { TagRepository } from "../repositories/tag.repository";
import { ProductRepository } from "../repositories/product.repository";
import { CategoryService } from "../services/category.service";
import { TagService } from "../services/tag.service";
import { ProductService } from "../services/product.service";
import { CategoryController } from "../controllers/category.controller";
import { TagController } from "../controllers/tag.controller";
import { ProductController } from "../controllers/product.controller";

export class Container {

    private static instance: Container;
    public categoryRepository: CategoryRepository;
    public tagRepository: TagRepository;
    public productRepository: ProductRepository;
    public categoryService: CategoryService;
    public tagService: TagService;
    public productService: ProductService;
    public categoryController: CategoryController;
    public tagController: TagController;
    public productController: ProductController;

    constructor() {
        const pool = DatabasePool.getInstance();
        const db = new DatabaseService(pool);
        this.categoryRepository = new CategoryRepository(db);
        this.tagRepository = new TagRepository(db);
        this.productRepository = new ProductRepository(db);
        this.categoryService = new CategoryService(this.categoryRepository);
        this.tagService = new TagService(this.tagRepository);
        this.productService = new ProductService(this.productRepository);
        this.categoryController = new CategoryController(this.categoryService);
        this.tagController = new TagController(this.tagService);
        this.productController = new ProductController(this.productService);
    }

    public static getInstance(): Container {
        if (!Container.instance) {
            Container.instance = new Container();
        }
        return Container.instance;
    }

    public static getRepository(): CategoryRepository {
        return Container.getInstance().categoryRepository;
    }

    public static getTagRepository(): TagRepository {
        return Container.getInstance().tagRepository;
    }

    public static getProductRepository(): ProductRepository {
        return Container.getInstance().productRepository;
    }

    public static getCategoryService(): CategoryService {
        return Container.getInstance().categoryService;
    }

    public static getTagService(): TagService {
        return Container.getInstance().tagService;
    }

    public static getProductService(): ProductService {
        return Container.getInstance().productService;
    }

    public static getCategoryController(): CategoryController {
        return Container.getInstance().categoryController;
    }

    public static getTagController(): TagController {
        return Container.getInstance().tagController;
    }

    public static getProductController(): ProductController {
        return Container.getInstance().productController;
    }

    public static closePool(): void {
        DatabasePool.closePool();
    }
}
