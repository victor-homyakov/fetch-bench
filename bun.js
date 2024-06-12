import {readFileSync} from "fs";
import pAll from "p-all";
import {extractUrls, measure, warmup} from "./utils.js";

const json = readFileSync(new URL("1500-deps.json", import.meta.url));
const urls = extractUrls(json);
const opts = {concurrency: process.argv[2] ? Number(process.argv[2]) : 96};

const getUrl = url => fetch(url).then(res => res.text());
await warmup(urls, getUrl);

const promise = pAll(urls.map(url => () => getUrl(url)), opts);
await measure('bun', promise);
