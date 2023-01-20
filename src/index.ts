import "dotenv-safe/config";
import http from "http";

// apollo server
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
// for session, go back to odl playground
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";

import path from "path";
import app from "./app";
import AppDataSource from "./data-source";
import { createUserLoader } from "./utils/createUserLoader";
import MyContext from "./utils/MyContext";

const PORT = process.env.PORT || 4000;

const server = http.createServer(app);

async function startServer() {
  await AppDataSource.initialize();
  // await AppDataSource.runMigrations();

  const schema = await buildSchema({
    resolvers: [path.join(__dirname, "**/*.resolver.js")],
    validate: false,
  });

  // console.log(schema);

  const apolloServer = new ApolloServer({
    schema,
    context: ({ req, res }): MyContext => ({
      req,
      res,
      userLoader: createUserLoader()
    }),
    // enable this to get caching work properly
    plugins: [
      ApolloServerPluginLandingPageGraphQLPlayground({
        // options
      }),
    ],
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({
    app,
    cors: false,
  });

  server.listen(PORT, () => {
    console.log(`Listening on  http://localhost:${PORT}/graphql`);
  });
}

startServer().catch((err) => console.log("main server err: ", err));
