// Uncomment these imports to begin using these cool features!

import {inject} from '@loopback/core';
import {get, HttpErrors, oas, param, put, Request, requestBody, Response, RestBindings} from '@loopback/rest';
import {ArtifactValidatorBindings, RakutenArtifactBindings} from '../config';
import {Artifact} from '../models';
import {ArtifactRestService, RakutenArtifactValidator} from '../services';
import {ArtifactsSpecs} from './specs';

const fs = require('fs');
const multer = require('multer');
const path = require('path');

const UPLOAD_PATH = path.resolve(__dirname, '..', 'sandbox');
/**
 * @description this is a sample Artifacts controller
 * that handles the uploading and fetching of JFrog artifacts.
 * This is just a PoC implementation and should not be used
 * in production
 * @author gaurav sharma
 * @since 19th May 2020
 */
export class ArtifactsController {
  constructor(
    @inject(ArtifactValidatorBindings.ARTIFACT_VALIDATOR)
    readonly artifactValidator: RakutenArtifactValidator,
    @inject(RakutenArtifactBindings.ARTIFACT_REST_SERVICE)
    readonly artifactService: ArtifactRestService
  ) {}

  /**
   * controller to handle the upload of artifact
   */
  @put('/artifacts')
  async uploadArtifact(
    @requestBody(ArtifactsSpecs.upload.request) request: Request,
    @inject(RestBindings.Http.RESPONSE) response: Response,
  ): Promise<Artifact> {
    const storage = multer.memoryStorage();
    const upload = multer({storage}).single('file');
    /**
     * TODO can handle this as a service as well
     */
    const process = new Promise<Artifact>((resolve, reject) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      upload(request, response, (err: any) => {
        if (err) {return reject(err)}
        const file = request.file;
        if (!file) {
          throw new HttpErrors.NotAcceptable('Require artifact to upload');
        }
        const validated = this.artifactValidator.isValidArtifactMime(file.mimetype);
        if (!validated) {
          throw new HttpErrors.UnprocessableEntity('The file type is not acceptable');
        }
        return resolve(new Artifact({
          filename: file.originalname,
          mime: file.mimetype,
          org: request.body.org,
          bundle: request.body.bundle,
          revision: request.body.revision,
          file: file,
        }));
      });
    });
    const rakutenArtifact: Artifact = await process;


    if (!rakutenArtifact.file) {
      throw new HttpErrors.FailedDependency('Missing required file');
    }
    // const buffer = Buffer.from(rakutenArtifact.file.buffer);
    const uploadResponse = await this.artifactService.uploadArtifact({
      org: rakutenArtifact.org ?? '',
      bundle: rakutenArtifact.bundle ?? '',
      filename: rakutenArtifact.filename ?? '',
      file: rakutenArtifact.file,
      mime: rakutenArtifact.file.mimetype,
      revision: rakutenArtifact.revision
    });
    // const rakutenArtifact: Artifact = await process;
    return Promise.resolve(<Artifact>{
      filename: rakutenArtifact.filename,
      mime: rakutenArtifact.mime,
      org: rakutenArtifact.org,
      bundle: rakutenArtifact.bundle,
      revision: rakutenArtifact.revision,
    });
  }

  /**
   * The controller function to handle the downloading
   * or transfer of asset
   * @param uri
   */
  @get('/artifacts/{org}/{bundle}/{revision}')
  @oas.response.file()
  async downloadArtifact(
    @param.path.string('org') org: string,
    @param.path.string('bundle') bundle: string,
    @param.path.string('revision') revision: string,
    @inject(RestBindings.Http.RESPONSE) response: Response
  ) {
    const file = <{extension: string, content: Blob}>await this.artifactService.fetchArtifact(org, bundle, revision);
    const fileName = `${bundle}-v${revision}.${file.extension}`;
    fs.writeFileSync(path.resolve(UPLOAD_PATH, fileName), Buffer.from(new Uint8Array(await file.content.arrayBuffer())));

    response.download(path.resolve(UPLOAD_PATH, fileName), fileName);
    return response
  }
}
