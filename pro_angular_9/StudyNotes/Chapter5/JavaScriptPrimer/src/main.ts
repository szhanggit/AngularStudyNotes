function decoratorFactory(name: string) { 
    return (constructor: Function) => { 
        console.log(`decorator function called with : ${name}`); 
    } 
}

@decoratorFactory('testName') 
class ClassWithDecoratorFactory { } 