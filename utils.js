/**
 * @param {string|Buffer|object} json
 * @returns {string[]}
 */
export function extractUrls(json) {
    const pkg = (typeof json === "object" && "devDependencies" in json) ? json : JSON.parse(String(json));
    return Object
        .keys(pkg.devDependencies)
        .map(name => `https://registry.npmjs.org/${name.replace(/\//g, "%2f")}`);
}

/**
 * @param {number} ms
 * @returns {Promise<void>}
 */
export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Warm up the JIT
 *
 * @param {string[]} urls
 * @param {(url: string) => Promise<unknown>} getUrl
 * @returns {Promise<void>}
 */
export async function warmup(urls, getUrl) {
    const warmupUrls = urls.slice(0, 10);
    await Promise.all(warmupUrls.map(url => getUrl(url)));
    await sleep(500);
}

/**
 * @param {string} name
 * @param {Promise<unknown>} promise
 * @returns {Promise<void>}
 */
export async function measure(name, promise) {
    const t1 = performance.now();
    await promise;
    console.info(`${name}: ${Math.round(performance.now() - t1)}ms`);
}
