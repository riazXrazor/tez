/* tslint:disable */
import v from "node-input-validator";

export function Validate(rules: any): Function{
  return function (_target: any, _propertyName: string, descriptor: TypedPropertyDescriptor<any>): any {
    const method = descriptor.value
    descriptor.value = function(){
      const context = this;
      const arg = arguments;
      let validator = new v(arg[0],rules);
      return validator.check().then(function (matched: any) { 
        if(matched){
          method.apply(context,arg, method);
        } else {
          return validator.errors
        }
      });
     
    }
  }
}
