# Drift sprite generation

Generated with the built-in imagegen tool from the two supplied references and the existing fighter's side-on pose. Final transparent PNGs are compiled with `tools/build-drift-sprites.ps1`. The tool returned opaque backgrounds even after an alpha-only correction; selected variants use a flat green key removed by the existing FFmpeg sprite workflow. Source renders remain in the ignored `.source-animations/drift/` folder.

## drift-movement.png

Use case: compositing. Asset type: production transparent PNG sprite atlas for a side-on Mortal Kombat style browser fighting game.
Image 1 is the character identity reference: preserve the white fox mask with pink and gold details, red sleeveless hooded vest, black sleeves and trousers, fingerless gloves, gray/gold boots. Image 2 is the weapon reference: the cyan llama unicorn pickaxe with golden horn, magenta mane, rainbow cheek and long gray handle. Combine them: the fighter holds this pickaxe in EVERY frame. Image 3 is ONLY the existing game's camera/pose/scale reference, NOT the character to draw.
Output one high resolution atlas, 1536 wide x 2304 tall, exactly 4 equal columns and 6 equal rows, each cell 384x384. TRUE transparent alpha background, no backdrop, no checkerboard pixels, no floor, no cast shadow, no grid lines, no labels, no text. Every cell contains ONE complete isolated full body figure and complete weapon with generous transparent padding. Every pose faces RIGHT with side-on 3/4 view, same fixed waist-height camera as original fighter reference, no front-facing poses. Consistent body proportions and costume in all 24 cells. Detailed rendered game sprite with crisp moderately pixelated edges; no motion blur. Standing figure body 270 pixels high, top at y70 and boots on y340 within each cell; pelvis centered at x185. Weapon can extend within x20..365 y15..345. Never cross cell edges.
Each ROW is a separate four-frame animation read left to right:
row1 IDLE: four subtle breathing fighting stance phases, knees bent, pickaxe held diagonally ready in two hands.
row2 WALK FORWARD: four distinct stride phases advancing toward right while torso remains right-facing, holding weapon steady.
row3 RETREAT: four distinct backward footwork phases, still facing right, pickaxe guarding chest.
row4 CROUCH: standing ready, knees lowering, deep crouch, settled crouch with weapon horizontal defending chest.
row5 BLOCK: guard rise, two hands plant pickaxe handle diagonally before face/chest, brace on impact, hold braced guard. BOTH hands visibly grip handle.
row6 INTRO: pickaxe planted beside boot, lift from floor, deliberate over-shoulder salute, settle into fighting stance.
Keep sprite registration and foot baseline consistent; no visual background of any kind.

## drift-movement-alpha.png

Use case: background-extraction. Edit this sprite atlas: remove ONLY the checkerboard backdrop and replace it with TRUE TRANSPARENT ALPHA pixels. The checkerboard is unwanted background. Preserve every character, weapon, costume detail and all 24 poses exactly in the same coordinates. Preserve image dimensions 1024x1536, 4 columns and 6 rows. PNG with a real alpha channel, not painted transparency, no white/gray checkerboard. No shadows. No other edits.

## drift-attacks.png

Use case: compositing. Create a new companion transparent PNG sprite atlas using image 1 for exact character, weapon, lighting, and view consistency. Image 2 is original character reference and image 3 exact llama pickaxe reference. Same red hooded fox masked Fortnite fighter wielding cyan/pink rainbow unicorn llama pickaxe. Side-on 3/4 camera at waist height facing RIGHT in every cell, complete body visible. True transparent alpha background, no rendered checkerboard, no shadows, text, grid or labels.
Exactly FOUR equal columns and SIX equal rows, 1024x1536 pixels, cells256x256. Keep every figure and whole weapon inside its cell, with 12px minimum clearance. Standing body height175px, feet y238 and torso center x112; enough room above and right for weapon. Same scale all frames. Four sequential frames per row: anticipation, windup, CONTACT at third frame, recovery fourth frame. Contact hits right. Original tight martial arts pickaxe attacks, deliberate footwork and bracing, NOT Fortnite's generic harvesting loop. No blur/effects.
ROW1: short two-hand pickaxe HANDLE jab into chest. Pull back handle, chamber, drive butt-end right horizontally, retract.
ROW2: reverse hook with llama head at face height. Twist left windup, pivot right, hook head forward right, retract.
ROW3: rising pickaxe uppercut. Crouch and lower head to right knee, coil, rise and drive llama head diagonally UP-RIGHT, settle.
ROW4: heavy braced two-hand horizontal pickaxe thrust. Wind up at hip, step forward, slam head forward right into ribs, return.
ROW5: diagonal overhead chop. Raise over rear shoulder, coil hips, steep diagonal chop ending weapon head forward right at chest height, recover.
ROW6: tether spear throw using pickaxe gesture. Lower weapon in rear hand, draw free hand back, extend free hand forward RIGHT to launch energy tether (DO NOT draw rope or effects), brace and haul toward own chest while weapon stays held.
Costume invariants white fox mask pink/gold markings, red vest hood, black fitted sleeves/pants, gold-gray boots. Weapon invariants turquoise unicorn llama head golden horn magenta mane rainbow cheek long gray handle pink end. Exactly24 figures.

## drift-attacks-key.png

Edit target: image1 sprite atlas. BACKGROUND REPLACEMENT ONLY. Replace the entire colorful smoky backdrop with ONE perfectly flat solid chroma key green RGB(0,255,0) #00FF00. Every background pixel, including between limbs and weapon, must be exactly pure bright green. No gradients, NO smoke, no checkerboard, no shadows, no vignettes. Preserve ALL 24 figures, positions, costumes, weapon details, poses, grid cell locations, 1024x1536 dimensions EXACTLY. This will be converted to transparent PNG in the existing game's sprite compiler. Only background changes.

## drift-kicks-falls-key.png

Create companion game sprite atlas of image1 character: red hooded white fox mask fighter holding same rainbow cyan llama pickaxe. IMAGE1 exact costume/weapon/view reference. Exactly4 columns x6 rows =24 complete isolated poses,1024x1536 image,each256square. Backdrop MUST BE PERFECTLY FLAT PURE CHROMA GREEN #00FF00, no other background, no gradients/shadows/checkerboard. This solid color will be removed by the game's transparent-sprite compiler.
All figures face RIGHT in side-on three-quarter waist-height view. Identical proportions, mask, outfit and pickaxe across poses. Fixed scale: standing body180px tall, boots y240, pelvis x118. FULL figure and full pickaxe stay INSIDE own cell with at least12px margin including airborne/fallen poses. No touching cell borders, no text or dividers, no blur. Crisp detailed rendered game sprite, slight pixel texture.
Four frames in each row form an animation, left to right:
ROW1 KICK: ready holding pickaxe rear-side; chamber front knee; front boot thrust extended RIGHT at waist height; recoil knee.
ROW2 RIGHT KICK: windup holding weapon tight across chest; pivot rear foot; sweeping rear boot roundhouse RIGHT at ribs; settle.
ROW3 SIDE KICK: lean left brace weapon; lift knee; fully extended boot RIGHT at chest height; retract foot.
ROW4 FINISHER: windup two hands on pickaxe; raise it above back shoulder; drive decisive downward diagonal blow toward right; low followthrough with head near ground to right. NO victim, blood or effects.
ROW5 UPPERCUT HIT AND FALL: chin snaps up from hit coming from RIGHT; torso launched backward left with feet lifting; body falling horizontal back to left; lying flat on back on ground, head LEFT feet RIGHT, pickaxe alongside still held.
ROW6 HEAVY KICK HIT AND FALL: fold over stomach from hit coming from RIGHT; stumble backward left; buckle onto rear knee falling left; lying on side on ground head LEFT feet RIGHT, still holding pickaxe.
Every row is visibly distinct. Every complete weapon and all limbs fit well inside its cell. No gore.

## drift-reactions-key.png

Create companion reaction sprite atlas of image1 character: exact red hooded white fox mask fighter holding same rainbow cyan llama pickaxe. All characters face RIGHT in the same side-on three-quarter waist-height camera. Exactly4 equal columns x6 equal rows,1024x1536 image,24 distinct complete figures. Background MUST BE PERFECTLY FLAT SOLID CHROMA KEY GREEN RGB(0,255,0) #00FF00. NO other backdrop, no gradients, shadows, checkerboard, grid lines or labels. Background will be removed by the game's sprite compiler. Same costume proportions/scale throughout, standing height180px, boots y240 in each256x256cell, pelvis x120. Entire figure and weapon within12px inset of each cell.
Each row FOUR distinct sequential frames of getting hit from opponent to the RIGHT. The fighter remains oriented RIGHT even when recoiling LEFT. Always retains pickaxe in one or both hands. No attacker, no blood, no effects.
Row1 RIGHT HOOK REACTION: guard, cheek impact head snaps backward LEFT, shoulders recoil, recover guarded stance.
Row2 LEFT HOOK REACTION: face turns slightly away from right-side blow, torso twists left, knees buckle slightly, recover right-facing guard.
Row3 BODY KICK REACTION: upright guard, fold forward clutching stomach, deep doubled-over pain with weapon lowered, halfway recover.
Row4 HIGH KICK REACTION: head thrown back LEFT, arched torso and arms wide retaining weapon, stagger backward left, brace back foot to recover.
Row5 SLASH REACTION: chest recoils from diagonal blow from right, turn shoulders left weapon lowered, stagger on bent knees with torso angled, regain guard.
Row6 SPEAR HIT AND PULL REACTION: chest impact arch back, fold forward clutching chest, boots planted but leaning and reaching RIGHT as if pulled by tether attached to chest (draw NO rope), dazed bent-knee standing recovery. Pose rooted in each cell; game will translate the victim toward attacker.
Preserve detailed fox mask, red vest, black sleeves/pants, gold gray boots and cyan llama gold horn magenta mane pickaxe. No generic duplicated standing poses; exaggerated distinct impact/body movement.

## drift-movement-key.png

Edit target: image1 movement sprite atlas. BACKGROUND REPLACEMENT ONLY. Replace the entire white-gray checkerboard with ONE perfectly flat pure chroma key green RGB(0,255,0) #00FF00. All background pixels, including between limbs and weapon, must be exactly pure bright green. NO gradients, smoke, checkerboard, shadows or vignettes. Preserve ALL24 figures, positions, costumes, pickaxe details, poses and grid cells EXACTLY. Keep1024x1536 dimensions,4columns6rows. The game sprite compiler will convert this key to true alpha transparency. Only background changes.

