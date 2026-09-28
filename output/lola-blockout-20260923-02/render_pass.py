import bpy,math,json
from pathlib import Path
from mathutils import Vector
OUT=Path(__file__).resolve().parent
s=bpy.data.scenes['LOLA_Shape_Pass_01'];bpy.context.window.scene=s;cam=s.camera
s.render.resolution_x=800;s.render.resolution_y=800;s.render.resolution_percentage=100
s.cycles.samples=12;s.cycles.use_denoising=True
records=[]
for name,angle,target,scale,elev,dist in [
    ('train_090.png',90,(0,.65,1.29),3.7,10,8),
    ('train_270.png',270,(0,.65,1.29),3.7,10,8),
    ('hero_045.png',45,(0,.65,1.29),3.7,10,8),
    ('opening_close.png',30,(-.12,-.10,1.51),1.03,3,8),
    ('opening_low.png',45,(-.10,-.10,1.39),.82,-12,3)]:
    a=math.radians(angle);e=math.radians(elev);target=Vector(target)
    cam.location=target+Vector((-dist*math.sin(a)*math.cos(e),-dist*math.cos(a)*math.cos(e),dist*math.sin(e)))
    assert cam.location.z>0
    cam.rotation_euler=(target-cam.location).to_track_quat('-Z','Y').to_euler();cam.data.ortho_scale=scale
    s.render.filepath=str(OUT/name);bpy.ops.render.render(write_still=True,scene=s.name)
    records.append({'file':name,'angle':angle,'scale':scale,'elevation':elev})
(OUT/'render_manifest.json').write_text(json.dumps(records,indent=2),encoding='utf-8')
print('PASS_RENDER_DONE',len(records))
