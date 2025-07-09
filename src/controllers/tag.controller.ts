import type {
    CreateTagInput,
    UpdateTagInput,
    TagResponse,
} from "../types/tag.type";
import { TagService } from "../services/tag.service";

export class TagController {
    constructor(private readonly service: TagService) {}

    async createTag(data: CreateTagInput): Promise<TagResponse> {
        return this.service.createTag(data);
    }

    async findAllTags(): Promise<TagResponse[]> {
        return this.service.findAllTags();
    }

    async findTagById(id: string): Promise<TagResponse | null> {
        return this.service.findTagById(id);
    }

    async updateTag(id: string, data: UpdateTagInput): Promise<TagResponse> {
        return this.service.updateTag(id, data);
    }

    async deleteTag(id: string): Promise<boolean> {
        return this.service.deleteTag(id);
    }
}
