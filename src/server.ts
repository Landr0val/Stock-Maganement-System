import { fastify } from 'fastify';
import { categoryRouter } from './routers/category.router';
import { productRouter } from './routers/product.router';
import { tagRouter } from './routers/tag.router';
import { userRouter } from './routers/user.router';
import { Container } from './config/container';

const originalStringify = JSON.stringify;
JSON.stringify = function (value, replacer, space) {
    if (typeof value === 'bigint') {
        return value.toString();
    }

    return originalStringify(
        value,
        function (key, val) {
            if (typeof val === 'bigint') {
                return val.toString();
            }
            return typeof replacer === 'function' ? replacer(key, val) : val;
        },
        space,
    );
};

const server = fastify({
    logger: {
        transport: {
            target: 'pino-pretty'
        }
    }
});

server.register(
    async (fastify) => {
        await fastify.register(categoryRouter);
        await fastify.register(productRouter);
        await fastify.register(tagRouter);
        await fastify.register(userRouter);
    }, { prefix: '/api/v1' }
)


server.listen({ port: 8000 }, (err, address) => {
    if (err) {
        server.log.error(err);
        process.exit(1);
    }
    server.log.info(`Server listening at ${address}`);
});
