import {inject} from '@loopback/core';
import mime from 'mime-types';
import {ArtifactValidatorBindings} from '../config/keys';

/**
 * @description this is a service class designed to test
 * the mime type of the provided filename. The response will
 * be the valid mime-type of the file
 * This interface will accept the array of valid mimes and process
 * the incoming files to validate the mime type against the
 * allowed mime-types.
 * @author gaurav sharma
 * @since 20th May 2020
 */
export interface ArtifactValidator<T = string[]> {
  /**
   * isValidArtifact is a service function to check the
   * file name against the valid mime names.
   * @param filename
   */
  isValidArtifact(filename: string): Promise<Boolean>,
  /**
   * isValidArtifactMime is a service function to check the mime
   * type against the valid mime types. This is the use case when we have
   * the mime type of the uploaded file.
   * @param {String} mime a vlida mime type
   */
  isValidArtifactMime(mime: string): boolean,
}

/**
 * implement the mime checker service
 */
export class RakutenArtifactValidator implements ArtifactValidator<string[]> {
  /**
   * The default constructor
   * @param mimes
   */
  constructor(
    @inject(ArtifactValidatorBindings.VALID_ARTIFACT_MIMES) private readonly mimes: string[],
  ) {}

  /**
   * Overriden function to check whether the artifact is valid
   * or not
   * @param {String} filename represents the name of file to check
   */
  async isValidArtifact(filename: string): Promise<boolean> {
    const mimeType = mime.lookup(filename);
    if (mimeType && this.mimes.includes(mimeType)) {
      return Promise.resolve(true);
    }
    /**
     * TODO can add additional validators here
     */
    return Promise.resolve(false);
  }

  /**
   * Overriden function to check the arifact validity based on its MIME type
   * @param {String} mime
   */
  isValidArtifactMime(mimeType: string): boolean {
    if (this.mimes.includes(mimeType)) {
      return true;
    }
    return false;
  }

}
