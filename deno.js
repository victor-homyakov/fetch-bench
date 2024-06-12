import pAll from "npm:p-all";
import json from "./1500-deps.json" assert {type: "json"};
import {extractUrls, measure, warmup} from "./utils.js";

const urls = extractUrls(json);
const opts = {concurrency: Deno.args[0] ? Number(Deno.args[0]) : 96};

const getUrl = url => fetch(url).then(res => res.text());
await warmup(urls, getUrl);

const promise = pAll(urls.map(url => () => getUrl(url)), opts);
await measure('deno', promise);
