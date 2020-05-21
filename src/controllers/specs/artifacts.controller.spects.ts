/**
 * @description this is the spec file for artifacts controller
 * @since 14th May 2020
 * @author gaurav sharma
 */

import {getModelSchemaRef} from '@loopback/rest';
import {Artifact} from '../../models';

export const ArtifactsSpecs = {
  upload: {
    request: {
      description: 'Upload an artifact',
      required: true,
      content: {
        'multipart/form-data': {
          // Skip body parsing
          'x-parser': 'stream',
          schema: {type: 'object'},
        },
      },
    },
    response: {
      responses: {
        '200': {
          description: 'Artifact instance',
          content: {'application/json': {schema: getModelSchemaRef(Artifact)}},
        },
      },
    }
  },
};

