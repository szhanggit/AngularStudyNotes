import { ImageCategory } from "../../enums/image-category";

export class GetImageResponseModel{
    data: GetImageListResponseModel;
    message: string;
    success:boolean;
}

export class GetImageListResponseModel {
    mediaDtos: MediaDto[];
    totalCount:number;
}



export class MediaDto {
    mediaId: number;
    fileName: string;
    imageDimension: string;
    nodeUrl: string;
    blobName: string;
    type: ImageCategory;
}
