# Dexbreille Gatekeeper Plugin

Gatekeeper through OpenID Connect with Keycloak as primary OpenID Provider.

## Developmental Setup

Run the following command to start up the keycloak server.

```sh
npm run dev-compose
```

Run the following command to start up the development server.

```sh
npm run dev
```

Usually, the access code for accessing protected resource server is obtained via user login with the OpenID Provider, which is Keycloak.
However, to test out the functionality of resource protection, a user must be created and authenticated.
Login to keycloak via `http://localhost:8082/`.
The temporary admin account is setup, please check out `.env.development.compose` file for username and password.
Create a user under the realm `dexbreille-gatekeeper-plugin`.

After creation, run the command to get the access token.
Please replace the username and password.

```sh
curl -L -X POST http://localhost:8082/realms/dexbreille-gatekeeper-plugin/protocol/openid-connect/token \
    -d client_id=gatekeeper \
    -d username=<USER_NAME> \
    -d password=<PASSWORD> \
    -d grant_type=password
```

This is possible because the direct access grant is turned on.
Do note that this approach is only for developmental purposes.
In production, you should redirect the user to login page and from there get the access token from Keycloak once the user is successfully authenticated.

This will provide you the access token.
From there you can attempt to access the private route in the development server.

```sh
curl -X GET http://localhost:8080/private -H 'Authorization: Bearer <ACCESS_CODE>'
```
