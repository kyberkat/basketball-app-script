# basketball-app-script
a nodejs script for seeding database via strapi routes with sample data

# Quick Start

1. Configure env variables.
   
- Set API_TOKEN and API_URL entrypoint (usually http://localhost:1337/api)

2. Run script.

```shell
node script.js -create -players
node script.js -get -players
node script.js -delete -players

node script.js -create -games
node script.js -get -games
node script.js -delete -games
```

# Requirements

1. Player and Games Content-type Schema must be predefined in Strapi (schema fields can be found in data.js)
2. API token must have full access to /players and /teams controller and routes.

# What's next?

1. Remove requirement #1 by adding a Strapi bootstrap function in ./config/functions/bootstrap.js that automactially creates the content-type and schemas upon strapi startup.