# phaser-ts2hx
Convertor for Phaser's TypeScript definitions to Haxe externs.  
Written in TypeScript, running on NodeJS.

This was quickly thrown together so the code is not very nice and is quite specific to [Phaser](https://github.com/photonstorm/phaser-ce/). That said, it could be used as starting point for more general converter.


## Usage

```
node main.js <phaser.d.ts> <export_path>
```
e.g.
```
node build/main.js phaser_definitions/phaser.comments.d.ts export/
```

The generated export folder currently contains externs for Phaser-CE 2.7.8.
