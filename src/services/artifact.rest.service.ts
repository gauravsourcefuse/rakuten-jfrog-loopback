import {inject} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import FormData from 'form-data';
import mime from 'mime-types';
import fetch, {Response} from 'node-fetch';
import {RakutenArtifactBindings} from '../config/keys';

/**
 * the payload format for uploadArtifact
 */
export interface ArtifactPayloadFormat {
	org: string,
	bundle: string,
	filename: string,
	revision: string,
	file?: Express.Multer.File,
	mime: String,
};

/**
 * The simple HTTP request service for loopback.
 * Not using Loopback REST connector because there is no
 * documentation found to handle REST file uploads using loopback-rest-connector
 * @author gaurav sharma
 * @since 21st May 2020
 */
export interface ArtifactRestCaller<T = object> {
	/**
	 * function to call REST endpoint to upload artifact to artifact respository e.g. JFrog
	 * @param org e.g rakuten-poc-bundle
	 * @param bundle e.g.ominicare
	 * @param filename e.g. omnicare-v1.2.tar
	 * @param file the raw file content
	 */
	uploadArtifact(artifact: ArtifactPayloadFormat): Promise<T>,
	/**
	 * function to call JFrog REST API to fetch the rakuten bundle artifact
	 * @param uri
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	fetchArtifact(org: string, bundle: string, revision: string): Promise<any>;
}

/**
 * implementation for the REST service caller
 */
export class ArtifactRestService implements ArtifactRestCaller<object> {
	constructor(
		@inject(RakutenArtifactBindings.ARTIFACT_BASE_URL) private readonly baseURL: string
	) {}

	/**
	 * private internal function to conver buffer to array buffer cycle
	 * @param {Buffer} buffer
	 */
	private async bufferToArrayBufferCycle(buffer: Buffer = new Buffer(0)) {
		if (buffer.length === 0) {
			throw new HttpErrors.ExpectationFailed('File buffer is 0');
		}
		const arrayBuffer = new ArrayBuffer(buffer.length);
		const view = new Uint8Array(arrayBuffer);

		for (let i = 0; i < buffer.length; i += 1) {
			view[i] = buffer[i];
		}
		return arrayBuffer;
	}

	/**
	 * handle uploading artifact here
	 */
	async uploadArtifact(artifact: ArtifactPayloadFormat): Promise<Response> {
		const extension = artifact.filename.includes('.tar.gz') ? 'tar.gz' : mime.extension(<string>artifact.mime);
		const constructEndpoint = `${this.baseURL}/${artifact.org}/${artifact.bundle}/${artifact.bundle}-v${artifact.revision}.${extension}`;

		// const arrayBufferData = await this.bufferToArrayBufferCycle(artifact.file);

		// TODO prepare the payload to push using axios
		// https://github.com/axios/axios/issues/318#issuecomment-218948420
		const data = new FormData();
		data.append('file', artifact.file ? artifact.file.buffer : undefined);

		const headers = {'Content-Type': <string>artifact.mime, 'X-Jfrog-Art-Api': <string>process.env.JFROG_APIKEY}
		// let response: ServerResponse = {data: {data: {}}};
		let response;
		try {
			response = <Response>await fetch(constructEndpoint, {method: 'PUT', headers, body: artifact.file ? artifact.file.buffer : undefined})
		} catch (err) {
			throw new HttpErrors.InternalServerError(err.message);
		}
		return response ?? new Response();
	}


	/**
	 * fetch the artifact
	 * @param {String} org
	 * @param {String} bundle
	 * @param {String} revision
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	async fetchArtifact(org: string, bundle: string, revision: string, extension: string = 'tar.gz'): Promise<any> {
		const constructEndpoint = `${this.baseURL}/${org}/${bundle}/${bundle}-v${revision}.${extension}`;
		console.log(constructEndpoint);
		// TODO move this to constructor
		const headers = {'X-Jfrog-Art-Api': <string>process.env.JFROG_APIKEY};
		const file = await fetch(constructEndpoint, {method: 'GET', headers, })
		return {
			extension,
			content: await file.blob(),
		};
	}
}
