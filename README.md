# User Pics.IO TEST TASK

## Quick start

1. Clone this repo using:
  
  ```shell
  git clone git@github.com:basi1iscus/pics-io-test-task.git
  ```

2. To install dependencies and clean the git repo run:

  ```shell
  npm install
  ```
3. Copy .env.example file to .env and make the necessary changes there

4. Build project

  ```shell
  npm run build
  ```
5. Run project

  ```shell
  npm start
  ```

#### Docker
Server working on 3000 ports on localhost

To run
```shell
docker-compose -f ./docker-compose.yml up
```
To stop
```shell
docker-compose -f ./docker-compose.yml down
```

## API

### Login endpoint:
```Shell
POST api/v1/auth/login
```
Body
```Shell
{
    "email": "admin@example.com",
    "password": "admin"
}
```

### Events endpoint:
```Shell
POST api/v1/events
```
You must use Bearer Token authorisation

Body
```Shell
{
    // required payload that should be routed to destinations
    "payload": {
        "a": 1,
        "b": 2,
        "c": 3
    },
    "strategy": "ALL",
    // array or destination intents
    "possibleDestinations": [
        {
            "destination1": true,
            "destination2": true,
            "destination3": true
        },
        {
            "destination1": true,
            "destination3": false
        },
        {
            "destination1": true,
            "destination2": true,
            "destination4": false
        },
        {
            "destination5": true
        }
    ]
}
```

Also You can use Pics.io test task.postman_collection.json for postman to test application

