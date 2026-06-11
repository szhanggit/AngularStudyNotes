import { ImageCategory } from "../../enums/image-category";

export class GetMediaListQueryModel {
    searchKeyword: string;
    type:ImageCategory;
    pageNumber: number;
    rowCount: number;
}
