# Drizzle Playground

![image](https://github.com/rphlmr/drizzle-playground/assets/20722140/1116ab6f-98aa-4e68-a066-b546d8b9de1f)

Just a little repo to play around with drizzle.

It includes all major drivers, ready to be used.

Import and write your queries in `main` function in `index.ts`, then run `(npm|pnpm|yarn) run start`.

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
(npm|pnpm|yarn) run {dialect}:push

(npm|pnpm|yarn) run pg:push
```

## Start Drizzle Studio
> It depends on the DB
> Push your schema before starting the studio. Or restart the studio after pushing the schema.

```bash
# In a terminal, run
(npm|pnpm|yarn) run {dialect}:studio

(npm|pnpm|yarn) run pg:studio
```

# I am stuck, I have errors on push

Delete the docker containers and start again 😂.

Stop the compose with `ctrl + c`.

```bash
# In a terminal, run
docker rm db-mysql # or docker rm db-postgres or both
```
