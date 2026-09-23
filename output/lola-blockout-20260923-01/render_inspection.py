"""Reproducible 8-view and opening/back inspection renders. Run with Blender -b -P."""
import bpy, math, json, sys
from pathlib import Path
from mathutils import Vector

OUT=Path(__file__).resolve().parent
scene=bpy.data.scenes['LOLA_Blockout_01']
bpy.context.window.scene=scene
scene.render.engine='CYCLES'
scene.cycles.device='CPU'
scene.cycles.samples=24
scene.cycles.use_denoising=True
camera=scene.camera
scene.render.resolution_x=1100
scene.render.resolution_y=1100
scene.render.resolution_percentage=100
records=[]

def shot(filename,angle,target,scale,elevation=10,distance=8):
    a=math.radians(angle); e=math.radians(elevation)
    target=Vector(target)
    camera.location=target+Vector((-distance*math.sin(a)*math.cos(e),-distance*math.cos(a)*math.cos(e),distance*math.sin(e)))
    assert camera.location.z>0, 'Inspection camera must remain above the studio floor'
    camera.rotation_euler=(target-camera.location).to_track_quat('-Z','Y').to_euler()
    camera.data.ortho_scale=scale
    scene.render.filepath=str(OUT/filename)
    bpy.ops.render.render(write_still=True,scene=scene.name)
    records.append({'file':filename,'azimuth':angle,'elevation':elevation,'ortho_scale':scale,
                    'target':list(target),'camera_location':list(camera.location)})

args=sys.argv[sys.argv.index('--')+1:] if '--' in sys.argv else []
if 'low-only' in args:
    shot('opening_close_low_angle.png',45,(-.14,-.10,1.39),.82,-12,3)
    saved=json.loads((OUT/'camera_manifest.json').read_text(encoding='utf-8'))
    saved=[records[0] if row['file']==records[0]['file'] else row for row in saved]
    (OUT/'camera_manifest.json').write_text(json.dumps(saved,indent=2),encoding='utf-8')
elif 'preview' in args:
    shot('preview_front.png',0,(0,.65,1.29),3.7)
    shot('preview_back.png',180,(0,.65,1.29),3.7)
    shot('preview_opening.png',45,(-.14,-.10,1.51),1.03,3)
else:
    for angle in range(0,360,45):
        shot(f'view_{angle:03d}.png',angle,(0,.65,1.29),3.7)
    for angle in [0,30,60,90]:
        shot(f'opening_close_{angle:03d}.png',angle,(-.14,-.10,1.51),1.03,3)
    shot('opening_close_low_angle.png',45,(-.14,-.10,1.39),.82,-12,3)
    shot('open_back_close.png',180,(0,.025,2.20),1.10,8)
    (OUT/'camera_manifest.json').write_text(json.dumps(records,indent=2),encoding='utf-8')
print('INSPECTION_RENDERS_COMPLETE',len(records))
