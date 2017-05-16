export class HaxeTypeBuilder {

    private classes:Map<string, HaxeClass>;
    private currentClass:HaxeClass;
    private currentProperty:HaxeProperty;
    private currentCommentable:ICommetable;

    constructor(){
        this.classes = new Map();
    }

    goClass(name:string):void {
        let currentMap = this.currentClass == null ? this.classes : this.currentClass.classes;
        if(currentMap.get(name) == null){
            this.addClass(name);
        } else {
            this.currentClass = currentMap.get(name);
            this.currentCommentable = null;
        }
    }

    popClass():void {
        this.currentClass = this.currentClass.parent;
        this.currentCommentable = null;
    }

    setInterface():void{
        this.currentClass.isInterface = true;
    }
    
    setEnum():void{
        this.currentClass.isEnum = true;
    }

    setHeritage(heritage:string):void{
        this.currentClass.heritage = heritage;
    }

    setClassTypeParam(typeParam:string):void{
        this.currentClass.typeParam = typeParam;
    }

    private addClass(name:string):void {
        let originalName = name;
        name = name.charAt(0).toUpperCase()+name.substr(1);
        let map = this.currentClass == null ? this.classes : this.currentClass.classes;
        if(map.get(name) != null) throw `Class ${name} already exists.`;
        var oldClass = this.currentClass;
        this.currentClass = new HaxeClass(name);
        this.currentClass.parent = oldClass;
        map.set(name, this.currentClass);
        this.currentCommentable = this.currentClass;
        
        this.currentClass.fullPath = originalName;
        let parent = this.currentClass.parent;
        while(parent != null){
            this.currentClass.fullPath = `${parent.name}.${this.currentClass.fullPath}`;
            parent = parent.parent;
        }
    }

    addProperty(name:string){
        if(this.currentClass.properties.get(name) != null) throw `Property ${name} in class ${this.currentClass.name} already exists.`;
        this.currentProperty = new HaxeProperty(name);
        this.currentClass.properties.set(name, this.currentProperty);
        this.currentCommentable = this.currentProperty;
    }

    addMethod(name:string){
        if(this.currentClass.properties.get(name) != null){
            let first = this.currentClass.properties.get(name);
            if(first instanceof HaxeMethod){
                this.currentProperty = new HaxeMethod(name);
                let last = first;
                while(last.nextOverload != null) last = last.nextOverload;
                (<HaxeMethod>last).nextOverload = <HaxeMethod>this.currentProperty;
            } else {
                throw `Cannot have a method with the same name as existing variable; name ${name} in class ${this.currentClass.name} already exists.`;
            }
            //console.log(`IGNORING METHOD ${name} - ALREADY EXISTS ON ${this.currentClass.name}`);
            this.currentCommentable = first;
        } else {
            this.currentProperty = new HaxeMethod(name);
            this.currentClass.properties.set(name, this.currentProperty);
            this.currentCommentable = this.currentProperty;
        }
    }

    addParameter(name:string, type:string, nullable:boolean){
        let method = this.currentProperty as HaxeMethod;
        if(method == null) throw `Cannot add parameter, no method added`;
        method.parameters.push(new HaxeParameter(name, type, nullable));
    }

    addModifier(mod:Modifier){
        this.currentProperty.modifiers.push(mod);
    }

    addType(type:string){
        if(this.currentProperty.type !== undefined) throw `Type on ${this.currentProperty.name} already set`;
        if(type === undefined) throw 'Type cannot be undefined';
        this.currentProperty.type = type;
    }

    addMetadata(meta:string){
        this.currentProperty.metadata.push(meta);
    }

    addTypeParam(typeParam:string){
        (<HaxeMethod>this.currentProperty).typeParam = typeParam;
    }

    setComment(comment:string):void{
        if(this.currentCommentable.comment != null){
            if(this.currentCommentable.comment == comment){
                console.log(`Duplicate equal comment on ${this.currentClass.name}.${this.currentProperty.name} - ignoring`);
                if(this.currentCommentable instanceof HaxeMethod){
                    this.currentProperty.comment = comment;//store it, we might use it in the static methods which get exposed via @:native
                }
                return;
            } else {
                throw `Current commentable already has a different comment: ${this.currentCommentable.comment}`;
            }
        }
        this.currentCommentable.comment = comment;
    }
    
    export(syncWriter:(path:string, text:string)=>void){
        return new HaxeWriter().build(this.classes, syncWriter);
    }


}

export enum Modifier {
    Static
}

class HaxeClass implements ICommetable {

    parent:HaxeClass;
    name:string;
    fullPath:string;
    comment:string;
    heritage:string;
    typeParam:string;
    properties:Map<string, HaxeProperty>;
    classes:Map<string, HaxeClass>;
    isInterface:boolean;
    isEnum:boolean;

    constructor(name:string){
        this.name = name;
        this.properties = new Map();
        this.classes = new Map();
    }

}

class HaxeProperty implements ICommetable {

    name:string;
    comment:string;
    modifiers:Modifier[];
    metadata:string[];
    type:string;

    constructor(name:string){
        this.name = name;
        this.modifiers = [];
        this.metadata = [];
    }

}

class HaxeMethod extends HaxeProperty {

    parameters:HaxeParameter[];
    typeParam:string;

    nextOverload:HaxeMethod;

    constructor(name:string){
        super(name);
        this.parameters = [];
    }

}

class HaxeParameter {

    name:string;
    type:string;
    nullable:boolean;

    constructor(name:string, type:string, nullable:boolean){
        this.name = name;
        this.type = type;
        this.nullable = nullable;
    }

}

interface ICommetable {
    comment:string;
}

class HaxeWriter{

    padSymbol:string = "\t";

    private padding:string = "";
    private padSize:number = 0;
    private buff:string = "";
    private paths:string[];
    private syncWriter:(path:string, text:string)=>void;

    build(classes:Map<string, HaxeClass>, syncWriter:(path:string, text:string)=>void){
        this.paths = [];
        this.syncWriter = syncWriter;
        this.preprocessClasses(classes);
        this.customRules(classes);
        for(let c of classes.values()){
            this.writeClass(c);
        }
        //return this.buff;
    }

    private preprocessClasses(classes:Map<string, HaxeClass>){
        //traverses the structure, and removes duplicated things (or replaces them with _name + @:native if they are different)
        let findSuperclass = function(heritage:String, relativeMap:Map<string, HaxeClass> = null):HaxeClass{
            if(heritage == null) return null;
            let c:HaxeClass = null;
            let index = heritage.indexOf("extends ");
            if(index > -1){
                let superclassName = heritage.substr(index+"extends ".length).split(" ")[0];
                let path = superclassName.split(".");
                let map = classes;
                for(let part of path){
                    if(!map.has(part) && !(relativeMap && relativeMap.has(part))) part = part.charAt(0).toUpperCase()+part.substr(1);
                    if(!map.has(part) && !(relativeMap && relativeMap.has(part))) part = part.toUpperCase();//PIXI
                    if(!map.has(part) && !(relativeMap && relativeMap.has(part))) return null;
                    c = map.get(part);
                    if(c == null) c = relativeMap.get(part);
                    map = c.classes;
                }
                if(c == null){
                    console.log(`Warning: superclass ${superclassName} of ${c.name} not found [${c.heritage}]`);
                }
            }
            return c;
        }
        let handleHeritage = function(c:HaxeClass, superclass:HaxeClass){
            //check/modify stuff
            for(let prop of c.properties.values()){
                if(prop.name == "new") continue;//ignore constructor
                if(superclass.properties.has(prop.name)){
                    let superProp = superclass.properties.get(prop.name);
                    //console.log(`Found equal name prop ${prop.name} on  both ${c.name} and ${superclass.name}`);
                    let sameType = prop.type == superProp.type;
                    let sameComment = prop.comment == superProp.comment;
                    let sameMeta = prop.metadata.length == superProp.metadata.length && prop.metadata.every(meta => superProp.metadata.indexOf(meta) != -1);
                    let sameMods = prop.modifiers.length == superProp.modifiers.length && prop.modifiers.every(mod => superProp.modifiers.indexOf(mod) != -1);
                    let allSame = sameType && sameComment && sameMeta && sameMods;
                    if(allSame && prop instanceof HaxeMethod){
                        if(superProp instanceof HaxeMethod){
                            if(superProp.parameters.length == prop.parameters.length){
                                for (var i = 0; i < prop.parameters.length; i++) {
                                    if(prop.parameters[i].type != superProp.parameters[i].type){
                                        allSame = false;
                                        break;
                                    }
                                }
                            } else {
                                allSame = false;
                            }
                        } else {
                            allSame = false;
                        }
                    }
                    if(allSame){//can just kill it
                        //console.log(`removing ${prop.name} from ${c.name}, it's equal to parent`);
                        c.properties.delete(prop.name);
                    } else {
                        console.log(`Different prop ${prop.name} on ${c.name} vs ${superclass.name}(type:${sameType}, comment:${sameComment}, meta:${sameMeta}, mods:${sameMods})`);
                        if(prop.metadata.some(x => x.indexOf(":native") == 0)){
                            console.log(`WARNING: THERE ALREADY WAS A :NATIVE METADATA RENAME ON ${c.name}.${prop.name}`);
                        } else {
                            prop.metadata.push(`:native("${prop.name}")`);
                            prop.name = `${c.name}_${prop.name}`;
                        }
                    }
                }
            }
            //handle super super class
            if(superclass.heritage != null){
                let supersuper = findSuperclass(superclass.heritage, superclass.parent.classes);
                if(supersuper != null)
                    handleHeritage(c, supersuper);
            }
        }
        let iterateClass = function(c:HaxeClass){
            if(c.heritage != null){
                let superclass = findSuperclass(c.heritage, c.parent.classes);
                if(superclass != null){
                    handleHeritage(c, superclass);
                }
            }
            for(let _c of c.classes.values()){
                iterateClass(_c);
            }
        }
        for(let c of classes.values()){
            iterateClass(c);
        }
    }

    private customRules(classes:Map<string, HaxeClass>){
        /*let world = classes.get("Phaser").classes.get("World");
        world.properties.delete("centerX");//Redefinition of variable ... in subclass is not allowed. Previously declared at phaser.Group
        world.properties.delete("centerY");
        world.properties.delete("game");*/
        /*let tilemap = classes.get("Phaser").classes.get("TilemapLayer");
        ["cameraOffset",
        "data",
        "debug",
        "exists",
        "fixedToCamera",
        "game",
        "name",
        "physicsType",
        "type"].forEach(prop => tilemap.properties.delete(prop));*/
        /*let text = classes.get("Phaser").classes.get("Text");
        ["angle",
        "cameraOffset",
        "destroyPhase",
        "events",
        "exists",
        "fixedToCamera",
        "game",
        "input",
        "inputEnabled",
        "name",
        "pendingDestroy",
        "physicsType",
        "position",
        "previousPosition",
        "previousRotation",
        "renderOrderID",
        "scale",
        "type",
        "world",
        "z"].forEach(prop => text.properties.delete(prop));*/
        //classes.get("Phaser").classes.get("Button").properties.delete("type");
        /*["position", "scale"].forEach(prop => classes.get("Phaser").classes.get("FlexLayer").properties.delete(prop));
        let emitter = classes.get("Phaser").classes.get("Particles").classes.get("Arcade").classes.get("Emitter");
        ["angle", "bottom", "exists", "left", "name", "physicsType", "position", "right", "top", "type"].forEach(prop => emitter.properties.delete(prop));
        classes.get("Phaser").classes.get("SpriteBatch").properties.delete("type");
        classes.get("Phaser").classes.get("Plugin").classes.get("AStar").properties.delete("parent");*/

        let replace = function(c:HaxeClass, name:string, withName:string){
            if(c.properties.has(withName)) throw "Cannot replace, already exists";
            let prop = c.properties.get(name);
            c.properties.delete(name);
            prop.name = withName;
            prop.metadata.push(`:native("${name}")`);
            c.properties.set(withName, prop);
        }
        replace(classes.get("Phaser").classes.get("Physics").classes.get("P2").classes.get("Body"), "dynamic", "isDynamic");
        replace(classes.get("Phaser").classes.get("Physics").classes.get("P2").classes.get("Body"), "static", "isStatic");
        replace(classes.get("Phaser").classes.get("Sound"), "override", "_override");
        
        let des = <HaxeMethod>classes.get("PIXI").classes.get("CanvasRenderer").properties.get("destroy");
        des.nextOverload = new HaxeMethod(des.name);
        des.nextOverload.type = des.type;
        des.nextOverload.parameters = des.parameters;
        des.parameters = [];

        let stateInit = <HaxeMethod>classes.get("Phaser").classes.get("State").properties.get("init");//move Rest<> to overload, so we can extend State in Haxe
        stateInit.nextOverload = new HaxeMethod(stateInit.name);
        stateInit.nextOverload.type = stateInit.type;
        stateInit.nextOverload.parameters = stateInit.parameters;
        stateInit.parameters = [];
    }

    private writeClass(c:HaxeClass){
        this.addLine(`package ${this.paths.map(s => s.toLowerCase()).join(".")};`);
        this.addLine();
        this.writeImports(c);
        this.writeComment(c.comment);
        let structureName = c.isInterface ? "interface" : (c.isEnum ? "enum" : "class");
        let heritage = c.heritage != null ? c.heritage+" " : "";
        let typeParam = c.typeParam != null ? `<${c.typeParam}>` : "";
        this.addLine(`@:native("${c.fullPath}")`);
        this.addLine(`extern ${structureName} ${c.name}${typeParam} ${heritage}{`);
        this.addLine();
        this.increasePad();
        this.preprocessMethods(c);
        for(let prop of c.properties.values()){
            this.writeComment(prop.comment);
            prop.metadata.forEach(line =>{
                this.addLine(`@${line}`);
            });
            if(prop instanceof HaxeMethod){
                this.writeMethod(<HaxeMethod>prop);
            } else {
                if(c.isEnum){
                    this.writeEnumMember(prop);
                } else {
                    this.writeProperty(prop);
                }
            }
            this.addLine();
        }
        this.decreasePad();
        this.addLine("}");
        this.addLine();
        this.syncWriter(this.paths.join("/")+`/${c.name}.hx`, this.buff);
        this.buff = "";
        this.paths.push(c.name.toLowerCase());
        for(let _c of c.classes.values()){
            this.writeClass(_c);
        }
        this.paths.pop();
    }

    private importsConfig = [
        ["EitherType<", "import haxe.extern.EitherType;"],
        ["Rest<", "import haxe.extern.Rest;"],
        ["HTMLCanvasElement", "import js.html.CanvasElement as HTMLCanvasElement;"],
        ["CanvasRenderingContext2D", "import js.html.CanvasRenderingContext2D;"],
        ["HTMLElement", "import js.html.HtmlElement as HTMLElement;"],
        ["MouseEvent", "import js.html.MouseEvent;"],
        ["HTMLVideoElement", "import js.html.VideoElement as HTMLVideoElement;"],
        ["Blob", "import js.html.Blob;"],
        ["Float32Array", "import js.html.Float32Array;"],
        ["Event", "import js.html.Event;"],
        ["ArrayBuffer", "import js.html.ArrayBuffer;"],
        ["Uint8Array","import js.html.Uint8Array;"],
        ["Uint32Array", "import js.html.Uint32Array;"],
        ["ImageData", "import js.html.ImageData;"],
        ["HTMLDivElement", "import js.html.DivElement as HTMLDivElement;"],
        ["WebGLFramebuffer", "import js.html.webgl.Framebuffer as WebGLFramebuffer;"],
        ["XMLHttpRequest", "import js.html.XMLHttpRequest;"],
        ["XMLDocument", "import js.html.XMLDocument;"],
        ["MSPointerEvent", "typedef MSPointerEvent = Dynamic;"],
        ["KeyboardEvent", "import js.html.KeyboardEvent;"],
        ["HTMLImageElement", "import js.html.ImageElement as HTMLImageElement;"],
        ["WebGLRenderingContext", "import js.html.webgl.RenderingContext as WebGLRenderingContext;"],
        ["WebGLProgram", "import js.html.webgl.Program as WebGLProgram;"],
        ["WebGLBuffer", "import js.html.webgl.Buffer as WebGLBuffer;"]
    ];

    private writeImports(c:HaxeClass){
        let importsConfig = this.importsConfig;
        let importBools = importsConfig.map(x=>false);
        let checkString = function(name) {
            for (let i = 0; i < importsConfig.length; i++) {
                let check = importsConfig[i];
                importBools[i] = importBools[i] || name.includes(check[0]);
            }
        }
        c.properties.forEach(prop =>{
            if(prop.type != null){
                checkString(prop.type);
            }
            if(prop instanceof HaxeMethod){
                prop.parameters.forEach(param => checkString(param.type));
                let overload = prop.nextOverload;
                while(overload != null){
                    overload.parameters.forEach(param => checkString(param.type));
                    overload = overload.nextOverload;
                }
            }
        });
        for (let i = 0; i < importsConfig.length; i++) {
            if(importBools[i]){
                this.addLine(importsConfig[i][1]);
            }
        }
        if(importBools.some(x => x == true)){
            this.addLine();
        }
    }

    private writeComment(comment:string){
        if(comment != null){
            this.addLine("/**");
            comment.split("\r\n").forEach((line) => {
                this.addLine("* "+line);
            });
            this.addLine("*/");
        }
    }

    private preprocessMethods(c:HaxeClass){
        //extract statics if there's also non-static using @:native
        c.properties.forEach(prop => {
            if(prop instanceof HaxeMethod){
                let statics:HaxeMethod[] = [];
                let method = prop;
                let count = 0;
                while(method != null){
                    count++;
                    if(method.modifiers.some(mod => mod == Modifier.Static)){//is static
                        statics.push(method);
                    }
                    method = method.nextOverload;
                }
                if(statics.length > 0 && statics.length < count){//extract to new methods
                    let first = prop;
                    while(statics.indexOf(first) >= 0) first = first.nextOverload;//there's guarantee to be at least one, so this works
                    if(first != c.properties.get(first.name)){//gotta remap
                        c.properties.set(first.name, first);
                    }
                    let iter = first;
                    while(iter != null){
                        while(statics.indexOf(iter.nextOverload) >= 0) iter.nextOverload = iter.nextOverload.nextOverload;//cut statics
                        iter = iter.nextOverload;
                    }
                    for (var i = 0; i < statics.length; i++) {
                        var s = statics[i];
                        s.nextOverload = statics.length > (i+1) ? statics[i+1] : null;
                        s.metadata.push(`:native("${s.name}")`);//TODO, probably needs to contain whole path
                        s.name = "STATIC_"+s.name;
                        if(c.properties.has(s.name))
                            throw `Unexpected, converting to custom name [${s.name}], but the class [${c.name}] already contains such member`;
                    }
                    c.properties.set(statics[0].name, statics[0]);
                }
            }
        });
    }

    private writeMethod(method:HaxeMethod){
        if(method.nextOverload != null){//has overloads
            let overload = method.nextOverload;
            while(overload != null){
                let type = overload.type == null? ":Dynamic" : `:${overload.type}`;
                this.addLine(`@:overload(function(${overload.parameters.map(this.getParam).join(", ")})${type}{})`);
                overload = overload.nextOverload;
            }
        }
        this.prependMods(method.modifiers);
        let typeParam = method.typeParam == null ? "" : `<${method.typeParam}>`;
        this.buff += `function ${method.name}${typeParam}(${method.parameters.map(this.getParam).join(", ")})`;
        if(method.type != null){
            this.buff += `:${method.type};\n`;
        } else {
            this.buff += `;\n`;
        }
    }

    private getParam(param:HaxeParameter):string{
        let q = param.nullable ? "?" : "";
        return `${q}${param.name}:${param.type}`;
    }

    private writeProperty(prop:HaxeProperty){
        this.prependMods(prop.modifiers);
        this.buff += "var "+prop.name+":"+prop.type+";\n";
    }

    private writeEnumMember(prop:HaxeProperty){
        this.addLine(prop.name+";");
    }

    private prependMods(modifiers:Modifier[]){
        this.buff += this.padding;
        for(let mod of modifiers){
            this.buff += HaxeWriter.modifierToString(mod)+" ";
        }
    }
    
    private static modifierToString(m:Modifier):string {
        switch (m) {
            case Modifier.Static:
                return "static";
        }
    }

    private addText(text:string){
        this.buff += this.padding+text;
    }

    private addLine(text:string = ""){
        this.buff += this.padding+text+"\n";
    }

    private increasePad(){
        this.padSize++;
        this.padding = this.padSymbol.repeat(this.padSize);
    }

    private decreasePad(){
        this.padSize--;
        this.padding = this.padSymbol.repeat(this.padSize);
    }

}