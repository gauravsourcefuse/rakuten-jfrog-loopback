import {AuthenticationComponent} from '@loopback/authentication';
import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication, RestBindings} from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent
} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import {ArtifactValidatorBindings, RakutenArtifactBindings} from './config';
import {MySequence} from './sequence';
import {ArtifactRestService, RakutenArtifactValidator} from './services';

export class StarterApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // setup the compoenent related items
    // to allow @authentication decorator for endpoints
    this.component(AuthenticationComponent);
    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    // set up the DI
    this.setUpBindings();

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }

  /**
   * Set up the application bindings.
   * This will load all of my custom created services.
   * Most of the services are defined in services/ directory
   * @author gaurav sharma
   * @since 13th May 2020
   */
  setUpBindings(): void {
    this.bind(RestBindings.ERROR_WRITER_OPTIONS).to({debug: true})

    /**
     * bindin the artifacts validator
     */
    const {env: {VALID_ARTIFACTS}} = process;
    const validArtifactMimes = (VALID_ARTIFACTS?.split(',')) ?? ['application/x-gzip']

    this.bind(ArtifactValidatorBindings.VALID_ARTIFACT_MIMES).to(validArtifactMimes);
    this.bind(ArtifactValidatorBindings.ARTIFACT_VALIDATOR).toClass(RakutenArtifactValidator);

    /**
     * binding the artifacts REST services
     */
    const {env: {ARTIFACTORY_BASE_URL = 'https://gauravsf.jfrog.io/artifactory'}} = process;
    this.bind(RakutenArtifactBindings.ARTIFACT_BASE_URL).to(ARTIFACTORY_BASE_URL);
    this.bind(RakutenArtifactBindings.ARTIFACT_REST_SERVICE).toClass(ArtifactRestService);

  }
}
