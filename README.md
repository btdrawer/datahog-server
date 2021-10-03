# datahog-server

A server that receives requests from clients for gas and internet bills. The server requests the relevant data from the provider, and then sends it back to the client in the form of a webhook.

To launch the server, run the following command (you will need Docker and docker-compose installed):

```
npm run start
```

To run the tests:

```
npm run test
```

(The tests provide 100% code coverage.)

## Endpoints

### `POST /`

Requests to this endpoint should include a JSON body with the following parameters:

| Parameter   | Description                                         |
| ----------- | --------------------------------------------------- |
| provider    | Either "gas" or "internet"                          |
| callbackUrl | The URL that the webhook payload should be sent to. |

For example:

```
{
    "provider": "gas"
    "callbackUrl": "http://localhost:3002"
}
```

Assuming the request body is valid, the API will return a `200`, collect billing data from the relative provider, and then send it to the `callbackUrl` in the following format:

```
{
    "success": true,
    "provider": "gas",
    "data": [
        {
            "billedOn": "2021-01-01T10:00:00Z",
            "amount": 15.92,
        }
    ],
    "lastUpdated": "2021-01-01T10:00:00Z"
}
```

**Note**: The `lastUpdated` field is provided because sometimes, the provider may be unavailable, and if so then the server will send a cached response which may be out of date.

If the provider is unavailable and no data has been cached, the server will instead send the following payload:

```
{
    "success": false,
    "message": "The provider could not be reached and no cached data are available. Please try again later."
}
```
