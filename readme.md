# Drizzle Playground

Just a little repo to play around with drizzle.

It includes all major drivers, ready to be used.

Import and write your queries in `main` function in `index.ts`, then run `npm run start`.

# How to

## Copy the `.env.example` file to `.env` and fill it
> You can keep the default values (they are the ones used in the docker-compose.yml file)

## Start local DB
> It requires Docker to be installed (https://docs.docker.com/get-docker/)

```bash
# In a terminal, run
docker compose up

# ctrl + c to stop
```

## Push the schema to the DB
> It depends on the DB

```bash
# In a terminal, run
npm run {dialect}:push

npm run pg:push
```

## Start Drizzle Studio
> It depends on the DB
> Push your schema before starting the studio. Or restart the studio after pushing the schema.

```bash
# In a terminal, run
npm run {dialect}:studio

npm run pg:studio
```

# I am stuck, I have errors on push

Delete the docker containers and start again 😂.

Stop the compose with `ctrl + c`.

```bash
# In a terminal, run
docker rm db-mysql # or docker rm db-postgres or both
```