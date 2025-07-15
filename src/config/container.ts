import { DatabasePool } from "./database";
import { DatabaseService } from "../services/database.service";
import { CategoryRepository } from "../repositories/category.repository";
import { TagRepository } from "../repositories/tag.repository";
import { ProductRepository } from "../repositories/product.repository";
import { UserRepository } from "../repositories/user.repository";
import { CategoryService } from "../services/category.service";
import { TagService } from "../services/tag.service";
import { ProductService } from "../services/product.service";
import { UserService } from "../services/user.service";
import { AuthService } from "../services/auth.service";
import { CategoryController } from "../controllers/category.controller";
import { TagController } from "../controllers/tag.controller";
import { ProductController } from "../controllers/product.controller";
import { UserController } from "../controllers/user.controller";

export class Container {

    private static instance: Container;
    public categoryRepository: CategoryRepository;
    public tagRepository: TagRepository;
    public productRepository: ProductRepository;
    public userRepository: UserRepository;
    public categoryService: CategoryService;
    public tagService: TagService;
    public productService: ProductService;
    public userService: UserService;
    public authService: AuthService;
    public categoryController: CategoryController;
    public tagController: TagController;
    public productController: ProductController;
    public userController: UserController;

    constructor() {
        const pool = DatabasePool.getInstance();
        const db = new DatabaseService(pool);
        this.categoryRepository = new CategoryRepository(db);
        this.tagRepository = new TagRepository(db);
        this.productRepository = new ProductRepository(db);
        this.userRepository = new UserRepository(db);
        this.categoryService = new CategoryService(this.categoryRepository);
        this.tagService = new TagService(this.tagRepository);
        this.productService = new ProductService(this.productRepository);
        this.userService = new UserService(this.userRepository);
        this.authService = new AuthService(this.userRepository);
        this.categoryController = new CategoryController(this.categoryService);
        this.tagController = new TagController(this.tagService);
        this.productController = new ProductController(this.productService);
        this.userController = new UserController(this.userService);
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

    public static getAuthService(): AuthService {
        return Container.getInstance().authService;
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

    public static getUserController(): UserController {
        return Container.getInstance().userController;
    }

    public static closePool(): void {
        DatabasePool.closePool();
    }
}
