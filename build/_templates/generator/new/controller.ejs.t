---
to: src/controllers/<%= name %>.controller.ts
unless_exists: true
---
import { Controller } from "#controllers/controller.controller";

export class <%= h.inflection.camelize(name) %>Controller extends Controller  {
  
}
