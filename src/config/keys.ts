import {BindingKey} from '@loopback/core';
import {ArtifactRestCaller, ArtifactValidator} from '../services';
/**
 * Bidings to define the valid artifacts
 * @author gaurav sharma
 * @since 20th May 2020
 */
export namespace ArtifactValidatorBindings {
  /**
   * bindings to define the valid artifact mimes
   */
  export const VALID_ARTIFACT_MIMES = BindingKey.create<string[]>('artifact.validator.validtypes');
  /**
   * bindings to define the vartifact validator service
   */
  export const ARTIFACT_VALIDATOR = BindingKey.create<ArtifactValidator>('artifact.validator.service');
}

/**
 * Rakuten JFrog based bindings
 */
export namespace RakutenArtifactBindings {
  /**
   * contains the bindings for the base URL for rakuten
   * bundle hosting provider
   */
  export const ARTIFACT_BASE_URL = BindingKey.create<string>('rakuten.artifact.baseurl');
  /**
   * service binding that handles the rakuten bundle based REST calls.
   */
  export const ARTIFACT_REST_SERVICE = BindingKey.create<ArtifactRestCaller>('rakuten.artifact.restservice')
}

/**
 * TODO move all the key bindings here from index.ts....
 */
