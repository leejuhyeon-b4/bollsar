"""Run in the saved Blender blockout: geometry and aperture occlusion check."""
import bpy, math, json
from pathlib import Path
from mathutils import Vector

OUT=Path(__file__).resolve().parent
s=bpy.data.scenes['LOLA_Blockout_01']
bpy.context.window.scene=s
bpy.context.view_layer.update()
dg=bpy.context.evaluated_depsgraph_get()
gown=bpy.data.objects['GOWN_Long_Skirt_And_Volumetric_Train']
bodice=bpy.data.objects['GOWN_Strapless_Bodice_TRUE_OpenBack']
assert gown.modifiers['Real_Cloth_Thickness'].thickness>.01
assert not any(v.co.z>2.02 and v.co.y>.125 and abs(v.co.x)<.08 for v in bodice.data.vertices)
assert len([o for o in s.objects if o.name.endswith('_Fist')])==2
assert all(not o.animation_data for o in s.objects)
samples=[]
# Sample the central and flanking visible aperture, with low and high viewpoints.
for z,center,half in [(1.18,.742,.07),(1.30,.698,.225),(1.48,.657,.39),
                      (1.68,.673,.426),(1.82,.747,.28)]:
    for fraction in [-.65,0,.65]:
        a=center+half*fraction
        radial=Vector((-math.sin(a),-math.cos(a),0))
        opening=radial*.24+Vector((0,0,z))
        for elevation in [-12,3,15]:
            origin=opening+radial*2+Vector((0,0,2*math.tan(math.radians(elevation))))
            hit,point,normal,face,obj,matrix=s.ray_cast(dg,origin,(opening-origin).normalized())
            assert hit, ('Empty aperture ray',z,a,elevation)
            signed_depth=point.dot(radial)
            underside=obj.name.startswith('MANNEQUIN_') and normal.z<-.70
            assert not underside, ('Exposed thigh cut',obj.name,z,a,elevation)
            assert signed_depth>-.03, ('Back wall visible through empty interior',obj.name,z,a,elevation)
            samples.append({'z':z,'angle':a,'elevation':elevation,'hit':obj.name,
                            'radial_depth':signed_depth,'underside_visible':underside})
report={'status':'PASS','rays_tested':len(samples),'scene':s.name,'objects':len(s.objects),
        'notes':'Geometry rays complement the 8-direction and close-up render review; approval is still pending.',
        'samples':samples}
(OUT/'geometry_inspection.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
print('GEOMETRY_INSPECTION_PASS',len(samples),'aperture rays; no thigh underside or empty back wall')
