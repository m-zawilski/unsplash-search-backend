import { config } from "dotenv";
import express from "express";
import cors from "cors";
import * as nodeFetch from "node-fetch";
import { createApi } from "unsplash-js";
import { ApiResponse } from "unsplash-js/dist/helpers/response";
import { Photos } from "unsplash-js/dist/methods/search/types/response";

if (process.env.NODE_ENV !== "production") {
  config();
}

const app = express();
const port: number = Number(process.env.PORT) ?? 3000;

const corsOptions = {
  origin: process.env.FRONTEND_URL,
};

const unsplash = createApi({
  accessKey: process.env.UNSPLASH_ACCESS_KEY ?? "",
  // as per https://github.com/unsplash/unsplash-js to circumvent an issue with node-fetch v3
  fetch: nodeFetch.default as unknown as typeof fetch,
});

app.get("/search", cors(corsOptions), async (req, res) => {
  const query: string = req.query.query?.toString() ?? "";
  const page: number = Number(req.query.page) ?? 1;
  const perPage: number = Number(req.query.perPage) ?? 10;

  const photos: ApiResponse<Photos> = await unsplash.search.getPhotos({
    query,
    page,
    perPage,
  });
  if (photos.errors) {
    res.status(500).json(photos.errors);
  } else {
    res.status(200).json(photos.response);
  }
});

app.listen(port, () => {
  console.log(`Unsplash simple backend listening on port ${port}`);
});
