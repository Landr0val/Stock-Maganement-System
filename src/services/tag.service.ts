import type { CreateTagInput, UpdateTagInput, TagResponse } from "../types/tag.type";
import { TagRepository } from "../repositories/tag.repository";

export class TagService {
    constructor(private readonly repository: TagRepository) {}

    async createTag(data: CreateTagInput): Promise<TagResponse> {
        const existingTag = await this.repository.findByName(data.name);
        if (existingTag) {
            throw new Error(`Tag with name ${data.name} already exists`);
        }
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

    async findTagById(id: string): Promise<TagResponse> {
        const tag = await this.repository.findById(id);
        if (!tag || Object.keys(tag).length === 0) {
            throw new Error(`Tag  not found`);
        }
        return tag;
    }

    async findTagByName(name: string): Promise<TagResponse> {
        const tag = await this.repository.findByName(name);
        if (!tag || Object.keys(tag).length === 0) {
            throw new Error(`Tag with name ${name} not found`);
        }
        return tag;
    }

    async updateTag(id: string, data: UpdateTagInput): Promise<TagResponse> {
        const tag = await this.repository.update(id, data);
        if (!tag || Object.keys(tag).length === 0) {
            throw new Error(`Tag  not found`);
        }
        return tag;
    }

    async deleteTag(id: string): Promise<boolean> {
        const tag = await this.repository.findById(id);
        if (!tag || Object.keys(tag).length === 0) {
            throw new Error(`Tag  not found`);
        }
        await this.repository.delete(id);
        return true;
    }
}
