import {readFileSync} from "node:fs";
import pAll from "p-all";
import axios from "axios";
import {extractUrls, measure, warmup} from "./utils.js";

const json = readFileSync(new URL("1500-deps.json", import.meta.url));
const urls = extractUrls(json);
const opts = {concurrency: process.argv[2] ? Number(process.argv[2]) : 96};

const getUrl = url => axios.get(url, { responseType: "text" });
await warmup(urls, getUrl);

const promise = pAll(urls.map(url => () => getUrl(url)), opts);
await measure('axios', promise);
