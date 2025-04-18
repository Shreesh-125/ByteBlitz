import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import s3Client from '../config/aws.config.js';

class S3Service {
  static async deleteFile(key) {
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key
    };
    await s3Client.send(new DeleteObjectCommand(params));
    return true;
  }

  static extractKeyFromUrl(url) {
    return url.split('/').slice(3).join('/');
  }
}

export default S3Service;