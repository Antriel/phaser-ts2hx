/*/// <reference path="typings/node/node.d.ts" />*/

import {readFileSync} from "fs";
import {writeFileSync} from "fs";
import {existsSync} from "fs";
import {mkdirSync} from "fs";
import * as ts from "typescript";
import { HaxeTypeBuilder, Modifier } from "./haxeTypeBuilder";
import {join as joinPaths} from "path";
import {dirname} from "path";

export function processFile(sourcePath: string) {
    // Parse a file
    if(!existsSync(sourcePath)){
        console.log(`File ${sourcePath} doesn't exist, ignoring.`);
        return;
    }
    let sourceFile = ts.createSourceFile(sourcePath, readFileSync(sourcePath).toString(), ts.ScriptTarget.Latest, /*setParentNodes */ true);
    let curDir = process.cwd();
    process.chdir(dirname(sourcePath));
    sourceFile.referencedFiles.forEach(ref => processFile(ref.fileName));
    process.chdir(curDir);
    console.log(`Processing ${sourcePath}`);
    sourceFile.forEachChild(processRoot);
    //writeFileSync("structure2.txt", buildStructure(sourceFile));
    //findComment(sourceFile);

}

function processRoot(node: ts.Node) {
    switch(node.kind){
        case ts.SyntaxKind.ModuleDeclaration:
            var md:ts.ModuleDeclaration = <ts.ModuleDeclaration>node;
            if(md.name.text == "phaser-ce"){//ignore this - not sure what is its purpose
                return;
            }
            processModule(md);
            break;
        case ts.SyntaxKind.ClassDeclaration:
            processClass(<ts.ClassDeclaration>node);
            break;
        case ts.SyntaxKind.EndOfFileToken: break;
        default:
            console.log("Unexpected kind: "+getName(node.kind));
            break;
    }
}

function processModule(node:ts.ModuleDeclaration){
    //if(1 ==1 )return;
    console.log(`processing module ${node.name.getText()}`);
    if(node.decorators !== undefined) console.log("WARNING DECORATORS NOT UNDEFINED");
    if(node.flags !== ts.NodeFlags.None) console.log("WARNING FLAGS NOT NONE");
    builder.goClass(node.name.getText());
    
    if(node.body.decorators !== undefined) console.log("WARNING DECORATORS NOT UNDEFINED");
    if(node.body.modifiers !== undefined) console.log("WARNING MODIFIERS NOT UNDEFINED");
    if(node.body.flags !== ts.NodeFlags.None) console.log("WARNING FLAGS NOT NONE");
    node.body.forEachChild(function(childNode){
        switch(childNode.kind){
            case ts.SyntaxKind.ClassDeclaration:
            case ts.SyntaxKind.InterfaceDeclaration:
                processClass(<ts.ClassDeclaration>childNode);
                break;
            case ts.SyntaxKind.EnumDeclaration:
                processClass(<ts.EnumDeclaration>childNode);
                break;
            case ts.SyntaxKind.ModuleDeclaration:
                processModule(<ts.ModuleDeclaration>childNode);
                break;
            case ts.SyntaxKind.VariableStatement:
                let vs = <ts.VariableStatement>childNode;
                vs.declarationList.declarations.forEach(vd => processProperty(vd));
                break;
            default:
                console.log("Unhandled module node kind: "+getName(childNode.kind));
                console.log(childNode.getText());
        }
    });
    builder.popClass();
}

function processClass(node:ts.ClassDeclaration|ts.InterfaceDeclaration|ts.EnumDeclaration){
    //writeFileSync("output.hx", builder.build());
    //console.log("processing class "+node.name.text);
    //if(node.name.text == "PluginConstructorOf") return;//don't need this one
    builder.goClass(node.name.text);
    processComment(node);
    node.forEachChild(function(childNode){
        switch(childNode.kind){
            case ts.SyntaxKind.DeclareKeyword:
            case ts.SyntaxKind.Identifier:
            case ts.SyntaxKind.ExportKeyword:
                //ignored;
                break;
            case ts.SyntaxKind.Constructor:
            case ts.SyntaxKind.MethodDeclaration:
            case ts.SyntaxKind.MethodSignature:
                let method:ts.FunctionLikeDeclaration = <ts.FunctionLikeDeclaration>childNode;
                processMethod(method);
                break;
            case ts.SyntaxKind.PropertyDeclaration:
            case ts.SyntaxKind.PropertySignature:
                var prop:ts.PropertyDeclaration = <ts.PropertyDeclaration>childNode;
                processProperty(prop);
                break;
            case ts.SyntaxKind.EnumMember:
                processProperty(<ts.EnumMember>childNode);
                break;
            case ts.SyntaxKind.HeritageClause:
                var heritage:ts.HeritageClause = <ts.HeritageClause>childNode;
                //if(heritage.getText().includes("PIXI")) break;//TODO handle PIXI?
                if(heritage.getText().includes("p2.")) break;//TODO handle p2?
                builder.setHeritage(processPackageNames(heritage.getText()));
                break;
            case ts.SyntaxKind.TypeParameter:
                builder.setClassTypeParam(childNode.getText());
                break;
            default:
                console.log("Unhandled class node kind: "+getName(childNode.kind));
                console.log(childNode.getText());
        }
    });
    if(node.kind == ts.SyntaxKind.InterfaceDeclaration){
        builder.setInterface();
    } else if(node.kind == ts.SyntaxKind.EnumDeclaration){
        builder.setEnum();
    }
    builder.popClass();
}

function processComment(node:any){
    let jsDoc = <ts.JSDoc[]>node.jsDoc;
    if(jsDoc != null && jsDoc.length > 0){
        if(jsDoc.length > 1) {
            console.log("WARNING: Ignoring additional comments");//they are wrong, so ignore them here
            //console.log(jsDoc.map(doc => doc.getText()).join("\n----------\n"));
        }
        //builder.setComment(jsDoc[0].getText());
        let comment = jsDoc[0].comment;
        if(jsDoc[0].tags != null){
            comment += "\r\n\r\n";
            comment += jsDoc[0].tags.map((tag) => `${tag.getText().trim()} ${tag.comment}`).join("\r\n");
        }
        builder.setComment(comment);
    }
}

function processMethod(node:ts.FunctionLikeDeclaration){
    if(node.decorators !== undefined) console.log("WARNING DECORATORS NOT UNDEFINED");
    if(node.questionToken !== undefined){
        console.log("WARNING QUESTION_TOKEN NOT UNDEFINED");
        console.log(node.getText());
    } 
    if(node.asteriskToken !== undefined) console.log("WARNING ASTERIX_TOKEN NOT UNDEFINED");
    if(node.flags !== ts.NodeFlags.None) console.log("WARNING FLAGS NOT NONE");
    if(node.kind == ts.SyntaxKind.Constructor){
        builder.addMethod("new");
    } else {
        let name = node.name.getText();
        if(name == "new") console.log("WARNING: THERE IS A METHOD WITH THE NAME New");
        builder.addMethod(name);
        builder.addType(processType(node.type));
    }
    if(node.typeParameters !== undefined) {
        //console.log("WARNING TYPE_PARAMETERS NOT UNDEFINED");
        node.typeParameters.forEach((typeParam) =>{
            if(typeParam.decorators !== undefined) console.log("WARNING DECORATORS NOT UNDEFINED");
            if(typeParam.default !== undefined) console.log("WARNING DEFAULT NOT UNDEFINED");
            if(typeParam.flags !== ts.NodeFlags.None) console.log("WARNING FLAGS NOT NONE");
            if(typeParam.modifiers !== undefined) console.log("WARNING MODIFIERS NOT UNDEFINED");
            if(typeParam.expression !== undefined) console.log("WARNING EXPRESSION NOT UNDEFINED");
            if(typeParam.constraint !== undefined) {
                builder.addTypeParam(`${typeParam.name.text}:${processPackageNames(typeParam.constraint.getText())}`);
            } else {
                builder.addTypeParam(typeParam.name.text);
            }
        });
    }
    processModifiers(node.modifiers);
    processParameters(node.parameters);
    processComment(node);
}

function processProperty(node:ts.PropertyDeclaration|ts.PropertySignature|ts.VariableDeclaration|ts.EnumMember){
    if(node.decorators !== undefined) console.log("WARNING DECORATORS NOT UNDEFINED");
    if(node.initializer !== undefined) console.log("WARNING INITIALIZER NOT UNDEFINED");
    if(node.flags !== ts.NodeFlags.None) console.log("WARNING FLAGS NOT NONE");
    builder.addProperty(node.name.getText());
    if((<ts.PropertyDeclaration|ts.PropertySignature>node).questionToken !== undefined) {
        //console.log("WARNING QUESTION_TOKEN NOT UNDEFINED");
        builder.addMetadata(":optional");
    }
    processModifiers(node.modifiers);
    if(!isEnumMember(node))
        builder.addType(processType(node.type));
    processComment(node);
}

function isEnumMember(node:ts.PropertyDeclaration|ts.PropertySignature|ts.VariableDeclaration|ts.EnumMember):node is ts.EnumMember{
    return ((<any>node).type === undefined);
}

function processModifiers(modifiers:ts.NodeArray<ts.Modifier>){
    if(modifiers != null) {
        modifiers.forEach(modifier => {
            switch (modifier.kind) {
                case ts.SyntaxKind.StaticKeyword:
                    builder.addModifier(Modifier.Static);
                    break;
                default:
                    console.log('WARNING UNKNOWN MODIFIER: '+getName(modifier.kind));
                    break;
            }
        });
    }
}

function processParameters(parameters:ts.NodeArray<ts.ParameterDeclaration>){
    if(parameters != null){
        parameters.forEach(parameter => {
            if(parameter.initializer !== undefined) console.log("WARNING: INITIALIZER NOT UNDEFINED");
            if(parameter.modifiers !== undefined) console.log("WARNING: MODIFIERS NOT UNDEFINED");
            if(parameter.flags !== ts.NodeFlags.None) console.log("WARNING FLAGS NOT NONE");
            let nullable:boolean = parameter.questionToken !== undefined;
            let dotdotdot:boolean = parameter.dotDotDotToken !== undefined;
            let processedType:string;
            if(dotdotdot){
                processedType = processType((<ts.ArrayTypeNode>parameter.type).elementType);
                processedType = `Rest<${processedType}>`;
            } else {
                processedType = processType(parameter.type);
            }
            builder.addParameter(parameter.name.getText(), processedType, nullable);
        });
    }
}

function processType(type:ts.TypeNode|ts.TypeElement):string{
    switch (type.kind) {
        case ts.SyntaxKind.StringKeyword:
            return "String";
        case ts.SyntaxKind.NumberKeyword:
            return "Float";
        case ts.SyntaxKind.BooleanKeyword:
            return "Bool";
        case ts.SyntaxKind.VoidKeyword:
            return "Void";
        case ts.SyntaxKind.AnyKeyword:
            return "Dynamic";
        case ts.SyntaxKind.TypeReference:
            var typeRef = <ts.TypeReferenceNode>type;
            let typeText = typeRef.getText();
            if(typeText == "Number") typeText = "Float";
            if(typeText == "Boolean") typeText = "Bool";
            if(typeText == "Function") typeText = "Dynamic";
            //if(typeText.includes("PIXI")) typeText = "Dynamic";//TODO Add pixi too?
            if(typeText.includes("p2.")) typeText = "Dynamic";//TODO Add p2 too?
            //if(typeRef.typeArguments !== undefined) {//included in typeRef.getText();
                //typeText = typeText+`<(${typeRef.typeArguments.map(t => t.getText()).join(", ")})>`;
            //}
            typeText = processPackageNames(typeText);
            return typeText;
            /*if(typeRef.typeName.kind == ts.SyntaxKind.QualifiedName){
                var qualName = <ts.QualifiedName>typeRef.typeName;
                return qualName.getText();
            } else {
                console.log(`WARNING TYPE REF NOT QUALIFIED NAME: ${getName(typeRef.kind)} (${typeRef.getText()})`);
                return "Dynamic";
            }*/
        case ts.SyntaxKind.ArrayType:
            var arrayType = <ts.ArrayTypeNode>type;
            return `Array<${processType(arrayType.elementType)}>`;
        case ts.SyntaxKind.UnionType:
            let unionType = <ts.UnionTypeNode>type;
            let processed = unionType.types.map(processType);
            return combineUnionTypes(processed);
        case ts.SyntaxKind.ParenthesizedType:
            return processType((<ts.ParenthesizedTypeNode>type).type);
        case ts.SyntaxKind.FunctionType:
            let functionType = <ts.FunctionTypeNode>type;
            let params = functionType.parameters.map((param)=> processType(param.type));
            if(params.length == 0) params.push("Void");
            let returnType = processType(functionType.type);
            return params.join("->")+"->"+returnType;
        case ts.SyntaxKind.TypeLiteral:
            let typeLiteral = <ts.TypeLiteralNode>type;
            if(typeLiteral.members.some(x => x.kind == ts.SyntaxKind.IndexSignature)){
                return "Dynamic";//not sure how to solve this one
            }
            let parts = typeLiteral.members.map((type) => type.name.getText()+":"+processType((<ts.PropertySignature>type).type));
            return `{${parts.join(", ")}}`;
        default:
            console.log('WARNING TYPE: '+getName(type.kind));
            return "Dynamic";
    }
}

function processPackageNames(typeText:string):string{
    let split = typeText.split(".");
    split = split.map((part, index) => {
        if(index < split.length -1){
            return part.toLowerCase();
        } else {
            if(part.indexOf(" ") == -1){
                return part.charAt(0).toUpperCase()+part.substr(1);
            }
            else return part;
        }
    });
    typeText = split.join(".");
    return typeText;
}

function combineUnionTypes(types:string[]):string{
    if(types.length == 1) return types[0];
    let first = types.shift();
    let rest = combineUnionTypes(types);
    return `EitherType<${first}, ${rest}>`;
}

/*var logged = false;
var skipped = false;
function findComment(node: ts.Node){

    if(node.kind == ts.SyntaxKind.ClassDeclaration){
        if(!skipped){
            skipped = true;
            return;
        }
        if(!logged){
            logged = true;
            console.log('test');
            console.log(node);
        }
    } else {
        node.forEachChild(findComment2);
    }
}*/

export function buildStructure(node: ts.Node){
    function getStructure(node: ts.Node, padding:string){
        if(node.getChildCount() > 0){
            var buffer = padding+getName(node.kind)+"[\n";
            node.forEachChild(function(childNode){
                buffer += getStructure(childNode, padding+"   ");
            });
            /*for (var i = 0; i < node.getChildCount(); i++) {
                var element = node.getChildAt(i);
                buffer += getStructure(element, padding+"   ");
            }*/
            buffer += padding+"]\n";
            return buffer;
        } else {
            return padding+getName(node.kind)+"\n";
        }
    }
    return getStructure(node, "");
}

function getName(kind: ts.SyntaxKind){
    return ts.SyntaxKind[kind];
}

let builder = new HaxeTypeBuilder();

processFile(process.argv[2]);
builder.export((path, text) => {
    let target = joinPaths(process.argv[3], path);
    if(!existsSync(dirname(target))){
        mkdirSync(dirname(target));
    }
    writeFileSync(target, text);
});
console.log("finished");