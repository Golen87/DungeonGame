# DungeonGame

Made for the course TDDD23.

Using [phaser](http://phaser.io/)

To run locally, go the directory with html in it and run a python server

  $ python3 -m http.server

Then, point your browser to [localhost:8000](http://localhost:8000)


## Brainstorm

Idea
> A simple zelda game, limit it to:
>> Just one dungeon with a start and a goal
>> 
>> Few monsters, and a "boss"
>> 
>> One attack, stab
> Possibly add Inventory management (see Inventory)
> 
> Possibly add Fire element (see Fire)

Controls
> Keyboard only, no mouse, Zelda esque?
>> WASD
>> 
>> Space to use/attack
> See Inventory

Minimum viable product
> Ability to move a character around
> At least two rooms, "progression", goal
> 
> Basic sword
>> Attack in 4 directions
> At least 1 monster
>> Kill or game over
> GUI displaying health only

Design goals
> Teach player how to play without any text
>> Start safe. Nothing to do but walk forward
>> 
>> Introduce player to sword. Force usage to go past breakable boxes
>> 
>> Introduce to slow enemy
>> 
>> How to force player to open inventory...?
> Inventory design
>> Show how to open without explaining

Inventory
> Ultima Ultimate 2 uses 8 slots (skip equip screen)
>> Possibly fewer slots, but can carry Pouches with additional space
>>> Really not necessary. Keep it til last
>> Hardest part is GUI design
> Limiting to 4 slots makes for easy usage
> 
> Controls
>> Use E to open?
>> 
>> Use E or Escape to close
>> 
>> Once open, highlight selected item

Items (in case of inventory)
> Consumable
>> Basic food
>> 
>> Keys
> Weapons
>> Sword
>> 
>> Torch
>> 
>> Consumable weapons? Sounds tricky design wise, but makes sense for torches
> Possibly harder to design final boss if arsenal may vary

Fire
> Breath of the wild inspiration
> 
> Possibly element usages
>> Light
>>> Dynamic light
>>> 
>>> Dark rooms, nice gameplay
>> Heat
>>> Burn enemies
>>> 
>>> Light boxes/torches on fire
> Stationary torches
>> Classic Zelda
>> 
>> Can be used as puzzle elements
> Possibly find fire magic.
>> Best sense of progression
>> 
>> Possibly key to defeating boss, or an easier mean to
> Light cooking pot, cook food, ahahah. Lets open this can later.

Room design
> Tile/grid based, easy to create
> 
> Text based level editor
>> Possible to do maps in csv
>> 
>> Problem: How to connect two rooms?
> Puzzle style dungeon, Zelda
>> Kill all enemies to open door
>> 
>> Find key to open door
>> 
>> Push boxes around, onto pressure plates. Oh boy. :sweats:
>> 
>> If fire
>>> Burn obstacles
>>> 
>>> Light stationary torches
>> Look at Zelda gameplay
> Size and camera
>> Room size oughta fit inside the screen
>> 
>> Possible for room to be larger in ONE axis, creating pathways, scrolling camera
>> 
>> Transition between rooms
>>> Sliding animation would be amazing. Think about that while implementing anyway

Enemies
> Slimes, slimes, oh god, I love slimes
> 
> Arin's Sequelitis - Iron knuckle
>> Provoked to attack, long cool down
>> 
>> Genius pacing

Some names I generated
> Crayrin
> 
> Jirader
> 
> Afareb
> 
> Asteraclya

Smooth toggle between cinematic mode and gameplay mode
> Freeze player and enemy movement
> 
> Fade in black bars, fade out gui

> Sparkles! Like 5 pixels, animations thereof, nyancat?

> Light and butterflies around sword in the stone. Player may be able to kill
> butterflies and see the light go out and the others flee, an indication that
> killing might not be the solution. Going through the game without killing
> anything should be much harder, but will grant a different ending?

> Early paths blocked due to lack of item
>> Hammer weapon to break certain blocks
>>
>> Also certain type of enemies, or at least one
