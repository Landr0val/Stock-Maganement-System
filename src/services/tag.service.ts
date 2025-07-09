import type { CreateTagInput, UpdateTagInput, TagResponse } from "../types/tag.type";
import { TagRepository } from "../repositories/tag.repository";

export class TagService {
    constructor(private readonly repository: TagRepository) {}

    async createTag(data: CreateTagInput): Promise<TagResponse> {
        const tag = await this.repository.create(data);
        return tag;
    }

    async findAllTags(): Promise<TagResponse[]> {
        const tags = await this.repository.findAll();
        if (!tags || tags.length === 0) {
            throw new Error("No tags found");
        }
        return tags;
    }

    async findTagById(id: string): Promise<TagResponse | null> {
        const tag = await this.repository.findById(id);
        if (!tag) {
            throw new Error(`Tag with id ${id} not found`);
        }
        return tag;
    }

    async updateTag(id: string, data: UpdateTagInput): Promise<TagResponse> {
        const tag = await this.repository.update(id, data);
        if (!tag) {
            throw new Error(`Tag with id ${id} not found`);
        }
        return tag;
    }

    async deleteTag(id: string): Promise<boolean> {
        const tag = await this.repository.findById(id);
        if (!tag) {
            throw new Error(`Tag with id ${id} not found`);
        }
        await this.repository.delete(id);
        return true;
    }
}
