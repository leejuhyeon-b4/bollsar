"""Shape pass 1: only train, diagonal opening and shorts. Keeps v001 intact."""
import bpy, bmesh, math, ast, json, hashlib
from pathlib import Path
from mathutils import Vector

OUT=Path(__file__).resolve().parent
source=bpy.data.scenes['LOLA_Blockout_01']
assert 'LOLA_Shape_Pass_01' not in bpy.data.scenes
scene=source.copy();scene.name='LOLA_Shape_Pass_01';scene.use_fake_user=True
for c in list(scene.collection.children):
    scene.collection.children.unlink(c)
collections={};copied={}
for c in source.collection.children:
    new=bpy.data.collections.new('R1_'+c.name);scene.collection.children.link(new)
    collections[c.name]=new
    for obj in c.objects:
        dup=obj.copy();dup.name='R1_'+obj.name;new.objects.link(dup);copied[obj.name]=dup
        if obj==source.camera:
            dup.data=obj.data.copy();scene.camera=dup
bpy.context.window.scene=scene
original=OUT.parent/'lola-blockout-20260923-01'/'build_blockout.py'
tree=ast.parse(original.read_text(encoding='utf-8'))
for node in tree.body:
    if isinstance(node,ast.FunctionDef) and node.name in ['mesh','loft','interp']:
        exec(compile(ast.Module(body=[node],type_ignores=[]),str(original),'exec'))
white=bpy.data.materials['BLOCKOUT_Pure_White'];black=bpy.data.materials['BLOCKOUT_Boxing_Black']
allowed={'GOWN_Long_Skirt_And_Volumetric_Train','SHORTS_Hip_Yoke','SHORTS_R_Leg','SHORTS_R_Hem','SHORTS_L_Leg','SHORTS_L_Hem'}
for name in allowed:
    bpy.data.objects.remove(copied[name],do_unlink=True)

profile=[(.05,.76,.62,2.15),(.10,.72,.57,2.06),(.20,.61,.46,1.78),
         (.35,.49,.36,1.27),(.55,.39,.30,.76),(.80,.32,.247,.43),
         (1.14,.273,.202,.23),(1.40,.263,.184,.195),(1.65,.263,.173,.18),
         (1.77,.245,.161,.166),(1.86,.207,.14,.143),(1.94,.184,.126,.13)]
opening=[(0,.30,0),(1.13,.30,0),(1.20,.36,.09),(1.35,.49,.29),
         (1.55,.68,.43),(1.73,.85,.40),(1.84,.98,.23),(1.94,1.07,0)]
verts=[];faces=[];rows=96;cols=128
for i in range(rows+1):
    z=.05+1.89*i/rows
    rx,front,back=interp(z,profile);center,gap=interp(z,opening)
    for j in range(cols+1):
        u=j/cols;a=center+gap+(2*math.pi-2*gap)*u;c=math.cos(a)
        fade=max(0,1-z/1.65)
        # Three broad cloth ridges per half, not fine surface wrinkles.
        ridge=(.5+.5*math.cos(6*a+.25))*.11*fade**.85
        # Leading edge lifts slightly over the underlying mass of the skirt.
        lap=.023*math.exp(-((1-u)/.08)**2)*max(0,math.sin(math.pi*(z-1.13)/.81)) if z>1.13 else 0
        diagonal=.018*math.exp(-((z-(1.80+.12*math.sin(a)))/.055)**2)*max(0,c)
        x=-(rx+ridge+lap+diagonal)*math.sin(a)
        y=-((front if c>=0 else back)+ridge+lap+diagonal)*c
        # Rounded pooled mass above the hem, continuous with the long skirt.
        t=max(0,min(1,(z-.05)/.43))
        pool=.11*math.sin(math.pi*t)**1.2*(.25+.75*(.5+.5*math.cos(6*a+.25)))
        zz=z-.036*max(0,1-z/.40)**2+pool
        verts.append((x,y,zz))
for i in range(rows):
    for j in range(cols):
        k=i*(cols+1)+j;faces.append((k,k+1,k+cols+2,k+cols+1))
skirt=mesh('R1_GOWN_Long_Skirt_And_Volumetric_Train',verts,faces,white,'02_Gown',1,.014)
skirt['opening_lowest_z']=1.13
skirt['revision']='Broad continuous drape ridges and rounded pooled train; swept right-hip opening'

# Each leg is now one continuous surface from waistband to rolled hem.
# Removing the yoke and separate hem eliminates the stacked horizontal slabs.
legs=[]
for side,sign in [('R',-1),('L',1)]:
    rings=[(1.398,.124,.146,sign*.12,-.002),(1.408,.13,.153,sign*.12,-.002),
           (1.425,.131,.154,sign*.12,-.002),(1.448,.128,.151,sign*.12,-.002),
           (1.53,.137,.162,sign*.12,0),(1.64,.136,.162,sign*.118,0),
           (1.74,.127,.151,sign*.112,0),(1.81,.112,.138,sign*.105,0),
           (1.835,.108,.132,sign*.103,0)]
    leg=loft('R1_SHORTS_'+side+'_Continuous_Leg',rings,black,'03_Boxing_Shorts',2,False)
    mod=leg.modifiers.new('Existing_Cloth_Thickness','SOLIDIFY');mod.thickness=.008
    for v in leg.data.vertices:
        rx,front,back=interp(v.co.z,profile);ry=front if v.co.y<0 else back
        q=(v.co.x/(rx-.014))**2+(v.co.y/(ry-.014))**2
        if q>1:
            v.co.x/=math.sqrt(q);v.co.y/=math.sqrt(q)
    leg.data.update();legs.append(leg)

# Unedited components still reference the exact original geometry and materials.
untouched=[]
for obj in source.objects:
    if obj.name not in allowed and obj.type=='MESH':
        dup=copied[obj.name]
        assert dup.data==obj.data and dup.matrix_world==obj.matrix_world
        untouched.append(obj.name)
assert skirt['opening_lowest_z']>1.052+.06
assert all(not o.animation_data for o in scene.objects)
bpy.context.view_layer.update()
dg=bpy.context.evaluated_depsgraph_get();checks=[]
for z in [1.20,1.35,1.55,1.73,1.84]:
    center,gap=interp(z,opening)
    for fraction in [-.5,0,.5]:
        a=center+gap*fraction;r=Vector((-math.sin(a),-math.cos(a),0))
        target=r*.25+Vector((0,0,z))
        origin=target+r*2
        hit,p,n,f,obj,mat=scene.ray_cast(dg,origin,-r)
        assert hit and p.dot(r)>-.03, ('empty aperture',z,fraction)
        assert not ('MidThigh' in obj.name and n.z<-.7), 'exposed cut'
        checks.append({'z':z,'fraction':fraction,'hit':obj.name})
scene['stage']='Unapproved shape pass 1: train + opening/shorts only'
scene.render.resolution_x=800;scene.render.resolution_y=800;scene.cycles.samples=12
(OUT/'shape_pass_report.json').write_text(json.dumps({'scene':scene.name,'untouched':untouched,'aperture_checks':checks,'materials_changed':False,'source_blend':'../lola-blockout-20260923-01/lola-blockout.blend'},indent=2),encoding='utf-8')
bpy.ops.wm.save_as_mainfile(filepath=str(OUT/'lola-shape-pass-01.blend'))
print('SHAPE_PASS_READY',len(scene.objects),'objects;',len(checks),'aperture checks passed')
