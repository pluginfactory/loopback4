import {AuthenticationComponent} from '@loopback/authentication';
import {BootMixin} from '@loopback/boot';
import {ApplicationConfig, BindingScope} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent
} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import {AuthTokenBindings, PasswordHasherBindings, TokenServiceConstants, UserServiceBindings} from './config';
import {MySequence} from './sequence';
import {BcryptHasher} from './services/hash.password.bcrypt';
import {JWTService} from './services/jwt.auth';
import {CustomUserService} from './services/user.service';

export class StarterApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // set up the DI
    this.setUpBindings();

    // setup the compoenent related items
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
    /**
     * binding the password hash services
     */
    this.bind(PasswordHasherBindings.ROUNDS).to(10);
    this.bind(PasswordHasherBindings.PASSWORD_HASHER).toClass(BcryptHasher).inScope(BindingScope.SINGLETON);

    /**
     * binding the token services
     */
    this.bind(AuthTokenBindings.TOKEN_EXPIRES_IN).to(TokenServiceConstants.TOKEN_EXPIRES_IN_VALUE);
    this.bind(AuthTokenBindings.TOKEN_SECRET).to(TokenServiceConstants.TOKEN_SECRET_VALUE);
    this.bind(AuthTokenBindings.TOKEN_SERVICE).toClass(JWTService);

    /**
     * binding the user services
     */
    this.bind(UserServiceBindings.USER_SERVICE).toClass(CustomUserService);
  }
}
