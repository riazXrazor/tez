/* tslint:disable */
import chalk from "chalk";
import prettyHrtime from "pretty-hrtime";
import { generateRoutes, generateSwaggerSpec, RoutesConfig, SwaggerConfig } from "tsoa";
import handlebars, { HelperOptions } from 'handlebars';
import { config } from "dotenv"
import { ApiKeySecurity } from "swagger-schema-official";
config();

function getSchema(properties: any){
  const outputSchema: any = {
    "type": "object",
    "properties": {},
    "required": []
  };
  for(const property in properties){
    const obj = properties[property];
    outputSchema.properties[property] = {};
    
    outputSchema.properties[property].type = obj.dataType;
    if(obj.required){
      outputSchema.required.push(property);
    }
  }
  return outputSchema
}

handlebars.registerHelper('toSchema', (context: any) => {
  return JSON.stringify(getSchema(context))
});

handlebars.registerHelper('toUpperCase', (context: any) => {
  return context.toUpperCase();
});

handlebars.registerHelper('toCamelCase', (context: any) => {
  context = context.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function(match: any, index: any) {
    if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
    return index == 0 ? match.toLowerCase() : match.toUpperCase();
  })

  return context.substring(0, 1).toUpperCase() + context.substring(1);
});

handlebars.registerHelper('isRef', function(lvalue: any, options: HelperOptions) {
  if( lvalue == "ref" ) {
    //@ts-ignore
    return options.fn(this);
  } else {
    //@ts-ignore
    return options.inverse(this);
  }
})

handlebars.registerHelper('formateSchema', function(context: any) {
  let schema: any = {};
  for (const key in context) {
    console.log(key, context);
    if(key == 'ref'){
      return `"${context[key]}#"`;
    }
    else if(key == 'array'){ continue }
    else if(key == 'dataType'){
      if(context[key] == 'array'){
        schema['type'] = 'array';
        schema['items'] = `${context['array']['ref']}#`;
        continue;
      }
      schema['type'] = context[key] == 'double' ? 'number' : context[key];
    }else{
      schema[key] = context[key];
    }

  }
  delete schema['default'];
  delete schema['required'];
  return JSON.stringify(schema);
})

handlebars.registerHelper('compare', function(lvalue: any, rvalue: any, options: HelperOptions) {

  if (arguments.length < 3)
    throw new Error("Handlerbars Helper 'compare' needs 2 parameters");

  const operator: string = options.hash.operator || "==";
  
  const operators: any = {
    '==':		(l: any,r: any): boolean => l == r ,
    '===':	(l: any,r: any): boolean => l === r ,
    '!=':		(l: any,r: any): boolean => l != r ,
    '<':		(l: any,r: any): boolean => l < r ,
    '>':		(l: any,r: any): boolean => l > r ,
    '<=':		(l: any,r: any): boolean => l <= r ,
    '>=':		(l: any,r: any): boolean => l >= r ,
    'typeof':	(l: any,r: any) => typeof l == r
  }

  if (!operators[operator])
    throw new Error("Handlerbars Helper 'compare' doesn't know the operator "+operator);

  const result: boolean = operators[operator](lvalue,rvalue);

  if( result ) {
    //@ts-ignore
    return options.fn(this);
  } else {
    //@ts-ignore
    return options.inverse(this);
  }
  
});
(async () => {

  const SecurityDef: ApiKeySecurity = {
    type: "apiKey",
    name: "Authorization",
    in: "header",
    description: "access token from the login"
  }

  const swaggerOptions: SwaggerConfig = {
    basePath: process.env['BASE_PATH'],
    controllerPathGlobs: [
      "./src/controllers/**/*.controller.ts",
    ],
    entryFile: "./src/server.ts",
    outputDirectory: "src",
    schemes: [
      "http",
    ],
    specVersion: 3,
    noImplicitAdditionalProperties: 'silently-remove-extras',
    securityDefinitions: {
      "api_key" : SecurityDef
    }
  };

  const routeOptions: RoutesConfig = {
    basePath: process.env['BASE_PATH'],
    entryFile: "./src/server.ts",
    middlewareTemplate: "./build/route-template.hbs",
    routesDir: "./src",
  };

  const ignorePaths: string[] = [
    "**/node_modules/**"
  ];
  try {
    let fstart = process.hrtime();
    let start = process.hrtime();

    await generateSwaggerSpec(swaggerOptions, routeOptions, {}, ignorePaths);

    let end = process.hrtime(start);
      console.log(chalk.greenBright(`✓ Generated OpenAPI spec (${prettyHrtime(end)})`));
    start = process.hrtime();

    await generateRoutes(routeOptions, swaggerOptions);

    end = process.hrtime(start);
      console.log(chalk.greenBright(`✓ Generated routes (${prettyHrtime(end)})`));
    end = process.hrtime(fstart);
      console.log(chalk.greenBright(`✓ Generated Client (${prettyHrtime(end)})`));
  } catch (e) {
      console.log(chalk.red(e))
  }
})();
