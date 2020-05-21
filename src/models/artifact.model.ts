import {Model, model, property} from '@loopback/repository';

@model()
export class Artifact extends Model {
  @property({
    type: 'string',
  })
  filename?: string;

  @property({
    type: 'string',
  })
  mime?: string;

  @property({type: 'string'})
  org?: string;

  @property({type: 'string', })
  bundle?: string;

  @property({type: 'string', })
  revision: string;

  @property({type: 'string'})
  file?: Express.Multer.File;

  @property({type: 'string'})
  uploadResponse?: object;


  constructor(data?: Partial<Artifact>) {
    super(data);
  }
}

export interface ArtifactRelations {
  // describe navigational properties here
}

export type ArtifactWithRelations = Artifact & ArtifactRelations;
