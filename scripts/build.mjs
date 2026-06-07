import { build } from "../admin/generator.js";

const result = await build();
console.log(JSON.stringify(result, null, 2));
