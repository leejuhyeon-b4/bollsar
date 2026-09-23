"""Lola theatrical costume blockout, using only the two approved master images.
Run inside Blender. Creates a separate scene; never edits the original scene.
"""
import bpy, bmesh, math, json
from pathlib import Path
from mathutils import Vector

OUT = Path(__file__).resolve().parent
SCENE_NAME = 'LOLA_Blockout_01'
assert SCENE_NAME not in bpy.data.scenes, 'Do not overwrite an existing blockout scene'
scene = bpy.data.scenes.new(SCENE_NAME)
bpy.context.window.scene = scene
collections = {}
for name in ['01_Mannequin', '02_Gown', '03_Boxing_Shorts', '04_Gloves_Strap', '05_Accent', '90_Studio']:
    c = bpy.data.collections.new(name)
    scene.collection.children.link(c)
    collections[name] = c

def material(name, color):
    m = bpy.data.materials.new(name)
    m.diffuse_color = (*color, 1)
    m.use_nodes = True
    node = next(n for n in m.node_tree.nodes if n.type == 'BSDF_PRINCIPLED')
    node.inputs['Base Color'].default_value = (*color, 1)
    node.inputs['Roughness'].default_value = .82
    return m

white = material('BLOCKOUT_Pure_White', (1, 1, 1))
graphite = material('BLOCKOUT_Matte_Graphite', (.055, .059, .063))
black = material('BLOCKOUT_Boxing_Black', (.012, .014, .017))
accent = material('BLOCKOUT_Sheer_Accent_OPAQUE_Placeholder', (.55, .57, .59))
floor_mat = material('STUDIO_Neutral', (.19, .20, .22))

def mesh(name, verts, faces, mat, group, sub=0, thickness=0):
    data = bpy.data.meshes.new(name + '_Mesh')
    data.from_pydata(verts, [], faces)
    data.update()
    bm = bmesh.new()
    bm.from_mesh(data)
    bmesh.ops.remove_doubles(bm, verts=list(bm.verts), dist=.00001)
    bmesh.ops.recalc_face_normals(bm, faces=list(bm.faces))
    bm.to_mesh(data)
    bm.free()
    obj = bpy.data.objects.new(name, data)
    collections[group].objects.link(obj)
    data.materials.append(mat)
    obj.color = mat.diffuse_color
    for poly in data.polygons:
        poly.use_smooth = True
    if sub:
        mod = obj.modifiers.new('Blockout_Surface', 'SUBSURF')
        mod.levels = sub
        mod.render_levels = sub
    if thickness:
        mod = obj.modifiers.new('Real_Cloth_Thickness', 'SOLIDIFY')
        mod.thickness = thickness
        mod.offset = 0
    return obj

def loft(name, rings, mat, group, sub=1, cap=True, n=64):
    verts = []
    for z, rx, ry, cx, cy in rings:
        for j in range(n):
            a = j * 2 * math.pi / n
            verts.append((cx-rx*math.sin(a), cy-ry*math.cos(a), z))
    faces = [(i*n+j, i*n+(j+1)%n, (i+1)*n+(j+1)%n, (i+1)*n+j)
             for i in range(len(rings)-1) for j in range(n)]
    if cap:
        faces += [tuple(reversed(range(n))), tuple((len(rings)-1)*n+j for j in range(n))]
    return mesh(name, verts, faces, mat, group, sub)

def interp(z, profile):
    if z <= profile[0][0]:
        return profile[0][1:]
    for lo, hi in zip(profile, profile[1:]):
        if z <= hi[0]:
            t = (z-lo[0])/(hi[0]-lo[0])
            return tuple(a+(b-a)*t for a,b in zip(lo[1:],hi[1:]))
    return profile[-1][1:]

# Smooth, androgynous display form. No muscular anatomy or added limbs.
body_profile = [(1.49,.222,.145),(1.63,.240,.151),(1.76,.228,.143),
                (1.91,.167,.108),(2.00,.181,.119),(2.13,.224,.141),
                (2.25,.257,.145),(2.34,.283,.127),(2.39,.302,.112),
                (2.42,.260,.105),(2.46,.126,.091),(2.49,.078,.073),
                (2.62,.076,.071),(2.635,.076,.071)]
torso = loft('MANNEQUIN_Slim_NeckCut_Torso', [(z,x,y,0,0) for z,x,y in body_profile], graphite, '01_Mannequin', 2)
torso['design'] = 'Slim androgynous master proportions; headless and armless'
for side, x in [('R',-.116),('L',.116)]:
    loft('MANNEQUIN_'+side+'_MidThigh_ClosedCut',
         [(1.04,.095,.101,x,0),(1.052,.095,.101,x,0),(1.20,.107,.121,x,-.004),
          (1.40,.117,.14,x,0),(1.56,.122,.148,x,0),(1.65,.12,.14,x,0)], graphite, '01_Mannequin', 2)

# Strapless front and a true U-shaped open back, with no panel across the back.
verts, faces = [], []
N, ROWS = 96, 16
for i in range(ROWS+1):
    t = i/ROWS
    for j in range(N):
        a = j*2*math.pi/N
        back = max(0,-math.cos(a))
        top = 2.27 - .345 * back**.72 - .035 * math.sin(a)**2
        z = 1.915 + (top-1.915)*t
        rx, ry = interp(z, body_profile)
        verts.append((-(rx+.012)*math.sin(a), -(ry+.014)*math.cos(a), z))
for i in range(ROWS):
    for j in range(N):
        faces.append((i*N+j,i*N+(j+1)%N,(i+1)*N+(j+1)%N,(i+1)*N+j))
bodice = mesh('GOWN_Strapless_Bodice_TRUE_OpenBack',verts,faces,white,'02_Gown',1,.009)
bodice['back_opening'] = 'Actual missing fabric above U boundary; minimum height 1.925m'
waist = loft('GOWN_Defined_Waist',[(1.896,.181,.122,0,0),(1.905,.180,.121,0,0),
             (1.935,.181,.123,0,0),(1.945,.183,.125,0,0)],white,'02_Gown',1,False)
mod = waist.modifiers.new('Real_Cloth_Thickness','SOLIDIFY'); mod.thickness=.009

# One continuous skirt/train shell. The opening converges ABOVE the hidden thigh cuts.
skirt_profile = [(.05,.76,.62,2.15),(.09,.735,.60,2.10),(.14,.68,.55,1.96),
                 (.25,.565,.445,1.52),(.43,.44,.34,.95),(.68,.35,.275,.51),
                 (.95,.295,.225,.30),(1.14,.273,.202,.23),
                 (1.40,.263,.184,.195),(1.65,.263,.173,.18),
                 (1.77,.245,.161,.166),(1.86,.207,.14,.143),(1.94,.184,.126,.13)]
opening_profile = [(0,.75,0),(1.13,.75,0),(1.20,.74,.105),(1.36,.67,.30),
                   (1.55,.65,.44),(1.72,.68,.42),(1.84,.76,.255),(1.94,.84,0)]
verts,faces=[],[]
rows,cols=88,128
for i in range(rows+1):
    z=.05+(1.94-.05)*i/rows
    rx,front,back=interp(z,skirt_profile)
    center,gap=interp(z,opening_profile)
    for j in range(cols+1):
        a=center+gap+(2*math.pi-2*gap)*j/cols
        c=math.cos(a)
        # Broad mass undulations only; no detailed wrinkle treatment.
        wave=(.5+.5*math.cos(10*a+.6)) * .04 * max(0,1-z/1.65)**1.3
        x=-(rx+wave)*math.sin(a)
        y=-(front+wave)*c if c>=0 else -(back+wave)*c
        verts.append((x,y,z-.036*max(0,1-z/.40)**2+.008*math.sin(5*a)**2*max(0,1-z/.4)))
for i in range(rows):
    for j in range(cols):
        k=i*(cols+1)+j
        faces.append((k,k+1,k+cols+2,k+cols+1))
skirt=mesh('GOWN_Long_Skirt_And_Volumetric_Train',verts,faces,white,'02_Gown',1,.014)
skirt['opening_side']='Anatomical right = negative X; front = negative Y'
skirt['opening_lowest_z']=1.13
skirt['train']='Continuous shaped 3D shell, broad volume and 14mm blockout thickness'

# Black shorts: belt and two genuine short legs, not a dark decal behind the opening.
loft('SHORTS_High_Waistband',[(1.80,.225,.15,0,0),(1.806,.227,.152,0,0),
     (1.895,.188,.123,0,0),(1.912,.183,.12,0,0)],black,'03_Boxing_Shorts',1,False)
loft('SHORTS_Hip_Yoke',[(1.585,.248,.166,0,0),(1.70,.25,.165,0,0),(1.82,.219,.148,0,0)],black,'03_Boxing_Shorts',1,False)
for side,x in [('R',-.12),('L',.12)]:
    leg=loft('SHORTS_'+side+'_Leg',[(1.405,.127,.152,x,-.002),(1.42,.13,.155,x,-.002),
         (1.50,.135,.161,x,0),(1.65,.135,.16,x,0)],black,'03_Boxing_Shorts',1,False)
    mod=leg.modifiers.new('Shorts_Cloth_Thickness','SOLIDIFY');mod.thickness=.008
    loft('SHORTS_'+side+'_Hem',[(1.397,.129,.154,x,-.002),(1.403,.131,.156,x,-.002),
         (1.432,.132,.157,x,-.002),(1.44,.131,.156,x,-.002)],black,'03_Boxing_Shorts',1,False)

def ellipsoid(name, center, scale, mat, group):
    rings=[]
    for i in range(17):
        a=-math.pi/2+math.pi*i/16
        rings.append((center[2]+scale[2]*math.sin(a),max(.001,scale[0]*math.cos(a)),
                      max(.001,scale[1]*math.cos(a)),center[0],center[1]))
    return loft(name,rings,mat,group,1)

for side,x,z in [('R',-.116,2.105),('L',.122,2.015)]:
    # Rounded closed fist, tapered wrist, cuff, and opposing thumb; fingers not modeled.
    loft('GLOVE_'+side+'_Fist',[(z-.102,.022,.029,x,-.214),(z-.089,.059,.048,x,-.226),
         (z-.048,.075,.057,x,-.232),(z+.015,.072,.059,x,-.232),
         (z+.072,.047,.044,x,-.226),(z+.105,.043,.038,x,-.219)],black,'04_Gloves_Strap',2)
    s=1 if x<0 else -1
    ellipsoid('GLOVE_'+side+'_Thumb',(x+s*.062,-.208,z+.005),(.029,.04,.060),black,'04_Gloves_Strap')
    loft('GLOVE_'+side+'_Cuff',[(z+.089,.045,.039,x,-.219),(z+.095,.049,.042,x,-.219),
         (z+.14,.049,.042,x,-.215),(z+.146,.047,.04,x,-.215)],black,'04_Gloves_Strap',1,False)

# A flattened ribbon runs from both cuffs around the back of the neck.
strap_points=[(-.116,-.218,2.25),(-.112,-.169,2.32),(-.100,-.118,2.42),
              (-.084,-.053,2.51),(-.076,.025,2.515),(-.045,.075,2.515),
              (0,.081,2.515),(.045,.075,2.515),(.076,.025,2.515),
              (.084,-.053,2.51),(.104,-.123,2.40),(.122,-.179,2.29),(.122,-.217,2.16)]
verts=[]
for p in strap_points:
    verts.extend([(p[0]-.010,p[1],p[2]),(p[0]+.010,p[1],p[2])])
mesh('GLOVES_Black_Neck_Strap',verts,[(2*i,2*i+1,2*i+3,2*i+2) for i in range(len(strap_points)-1)],black,'04_Gloves_Strap',2,.006)

# Very small separate side accent. Opaque proxy only; transparency deliberately deferred.
verts=[]
for a,z in [(-.91,1.879),(-1.13,1.83),(-1.13,1.738),(-1.015,1.80)]:
    rx,front,back=interp(z,skirt_profile)
    verts.append((-(rx+.012)*math.sin(a),-(front+.012)*math.cos(a),z))
obj=mesh('ACCENT_Small_Side_Sheer_OPAQUE_Proxy',verts,[(0,1,2,3)],accent,'05_Accent',0,.003)
obj['stage']='Position/shape placeholder only. No transparency at blockout stage.'

# Keep the two internal short legs inside the gown's outer hip envelope.
# This avoids a second accidental opening on the opposite side of the skirt.
for obj in list(collections['03_Boxing_Shorts'].objects)+[o for o in collections['01_Mannequin'].objects if 'MidThigh' in o.name]:
    margin=(.011 if obj.name.endswith('_Hem') else .018) if obj.name.startswith('SHORTS') else .030
    for v in obj.data.vertices:
        rx,front,back=interp(v.co.z,skirt_profile)
        ry=front if v.co.y<0 else back
        q=(v.co.x/(rx-margin))**2+(v.co.y/(ry-margin))**2
        if q>1:
            v.co.x/=math.sqrt(q)
            v.co.y/=math.sqrt(q)
    obj.data.update()

# Neutral inspection studio, kept out of the model collections.
mesh('STUDIO_Floor',[(-200,-200,0),(200,-200,0),(200,200,0),(-200,200,0)],[(0,1,2,3)],floor_mat,'90_Studio')
world=bpy.data.worlds.new('LOLA_Studio_World');scene.world=world;world.use_nodes=True
bg=next(n for n in world.node_tree.nodes if n.type=='BACKGROUND')
bg.inputs['Color'].default_value=(.32,.34,.38,1);bg.inputs['Strength'].default_value=.4
for name,loc,power,size in [('Key',(-3,-4,6),750,4),('Fill',(4,-2,3.6),550,3),('Back',(0,4,5),1000,3)]:
    data=bpy.data.lights.new('STUDIO_'+name,'AREA');data.energy=power;data.shape='DISK';data.size=size
    obj=bpy.data.objects.new('STUDIO_'+name,data);collections['90_Studio'].objects.link(obj);obj.location=loc
    obj.rotation_euler=(Vector((0,0,1.4))-obj.location).to_track_quat('-Z','Y').to_euler()
data=bpy.data.cameras.new('CAM_Inspection');data.type='ORTHO';data.ortho_scale=3.7;data.lens=70
cam=bpy.data.objects.new('CAM_Inspection',data);collections['90_Studio'].objects.link(cam);scene.camera=cam
target=Vector((0,.65,1.29));a=math.radians(45);e=math.radians(10)
cam.location=target+Vector((-8*math.sin(a)*math.cos(e),-8*math.cos(a)*math.cos(e),8*math.sin(e)))
cam.rotation_euler=(target-cam.location).to_track_quat('-Z','Y').to_euler()
scene.render.engine='CYCLES'
scene.cycles.device='CPU';scene.cycles.samples=24;scene.cycles.use_denoising=True
scene.render.resolution_x=1100;scene.render.resolution_y=1100;scene.render.resolution_percentage=100
scene.render.image_settings.file_format='PNG';scene.render.film_transparent=False
scene.render.filepath=str(OUT/'preview_hero.png')
scene['master_hero']='../imagegen/kinky-boots-lola-mannequin-final-hero.png'
scene['master_4_view']='../imagegen/kinky-boots-lola-mannequin-final-4-view.png'
scene['stage']='PRE-MATERIAL BLOCKOUT. No rig, animation, transparency, or detailed wrinkles.'
scene['coordinate_system']='Z up; front -Y; anatomical right -X'
for area in bpy.context.screen.areas:
    if area.type=='VIEW_3D':
        area.spaces.active.region_3d.view_perspective='CAMERA'
        area.spaces.active.shading.color_type='MATERIAL'

# One runnable structural check; visual review still required separately.
def verify():
    assert len(collections['01_Mannequin'].objects)==3
    assert len([o for o in collections['04_Gloves_Strap'].objects if o.name.endswith('_Fist')])==2
    assert min(v.co.z for v in bodice.data.vertices if v.co.y>.09)<1.95
    assert not any(v.co.z>2.02 and v.co.y>.125 and abs(v.co.x)<.08 for v in bodice.data.vertices)
    assert skirt['opening_lowest_z']>1.052+.06
    assert max(v.co.y for v in skirt.data.vertices)>2
    assert white.diffuse_color[:3]==(1,1,1)
    assert all(not o.animation_data for c in collections.values() for o in c.objects)
verify()
manifest={'scene':scene.name,'stage':scene['stage'],'coordinates':scene['coordinate_system'],
          'collections':{name:[o.name for o in c.objects] for name,c in collections.items()},
          'cut_z':1.04,'opening_bottom_z':1.13,'train_back_y':2.15,
          'camera':{'type':'ORTHO','scale':3.7,'resolution':[1100,1100]},
          'source_references':[scene['master_hero'],scene['master_4_view']]}
(OUT/'object_manifest.json').write_text(json.dumps(manifest,indent=2),encoding='utf-8')
bpy.ops.wm.save_as_mainfile(filepath=str(OUT/'lola-blockout.blend'))
print('BLOCKOUT_CREATED',len(scene.objects),str(OUT))
