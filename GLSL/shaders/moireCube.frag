precision mediump float;

const float PI = 3.14159265359;

// --- Mouse Control Parameters ---
const float MOUSE_SENSITIVITY = 2.0 * PI; // Full drag across screen = 360 deg rotation

// --- Parameters for Moire ---
const float MOIRE_FREQ1 = 50.0;
const float MOIRE_FREQ2 = 53.0;
const float MOIRE_ANIM_SPEED = 0.1;

// --- Parameters for Underlying Scene Refraction ---
const float UNDERLYING_MAX_REFRACTION_STRENGTH = 0.49;
const float UNDERLYING_REFRACTION_WAVE_SPEED = 0.3;
const float UNDERLYING_CHROMATIC_ABERRATION_STRENGTH = 0.12;

// --- Parameters for Top Glass Block Layer (Effect Surface) ---
const float TOP_BLOCK_REFRACTION_STRENGTH = 0.535;
const float TOP_BLOCK_CA_STRENGTH = 0.025;
const float TOP_BLOCK_SPECULAR_SHININESS = 96.0;
const float TOP_BLOCK_SPECULAR_INTENSITY = 0.9;
const float TOP_BLOCK_FRESNEL_MIN_REFLECT = 0.04;
const float TOP_BLOCK_FRESNEL_POWER = 5.0;
const float TOP_BLOCK_NORMAL_ANIM_SPEED = 0.95;
const float PER_FACE_UV_OFFSET_STRENGTH = 0.15; // How much each face's UVs are shifted. Try 0.0 to 0.3

// --- Time Evolution Parameters ---
const float EFFECT_START_TIME = 0.0;
const float EFFECT_FULL_TIME = 5.0;


// --- Pseudo-random 2D vector from a 2D seed ---
vec2 random2(vec2 p) {
    return fract(sin(vec2(dot(p, vec2(127.1,-311.7)), dot(p, vec2(269.5,183.3))))*437588888990.5453);
}

// ---Generate a Moiré pattern value ---
float getMoire(vec2 uv, float time, vec2 aspect_source_res) {
    vec2 p_uv = uv;
    if (aspect_source_res.y != 0.0) {
         p_uv.x *= aspect_source_res.x / aspect_source_res.y;
    }
    vec2 center = vec2(0.5 * (aspect_source_res.y != 0.0 ? aspect_source_res.x / aspect_source_res.y : 1.0), 0.5);

    vec2 offset1 = vec2(sin(time * MOIRE_ANIM_SPEED * 0.7), cos(time * MOIRE_ANIM_SPEED * 0.5)) * 0.03;
    vec2 offset2 = vec2(cos(time * MOIRE_ANIM_SPEED * 0.6), sin(time * MOIRE_ANIM_SPEED * 0.8)) * 0.04;

    float d1 = length(p_uv - center + offset1);
    float d2 = length(p_uv - center + offset2);

    float pattern1 = sin(d1 * MOIRE_FREQ1 + time * 0.5);
    float pattern2 = cos(d2 * MOIRE_FREQ2 - time * 0.3);
    return (pattern1 * pattern2 + 1.0) * 0.5;
}

// -- Generate displacement for UNDERLYING scene's refraction ---
vec2 getUnderlyingRefractionDisplacement(vec2 uv, float time, float strength) {
    float wave_x1 = sin(uv.x * 2.5 + time*8. * UNDERLYING_REFRACTION_WAVE_SPEED * 0.4 + cos(uv.y * 3.5 + time * UNDERLYING_REFRACTION_WAVE_SPEED * 0.2) * 0.6);
    float wave_y1 = cos(uv.y * 2.0 + time*8. * UNDERLYING_REFRACTION_WAVE_SPEED * 0.3 + sin(uv.x * 3.0 + time * UNDERLYING_REFRACTION_WAVE_SPEED * 0.25) * 0.6);
    float fine_wave_x = sin(uv.x * 12.0 + uv.y * 18.0 + time * UNDERLYING_REFRACTION_WAVE_SPEED * 2.4) * 0.25;
    float fine_wave_y = cos(uv.y * 14.0 - uv.x * 10.0 + time * UNDERLYING_REFRACTION_WAVE_SPEED * 2.4) * 0.25;
    return vec2(wave_x1 + fine_wave_x, wave_y1 + fine_wave_y) * strength;
}

// ---Generate the underlying scene color ---
vec3 getUnderlyingSceneColor(vec2 uv_scene, float time_scene, float globalEffectFactor, vec2 aspect_source_res) {
    float currentUnderlyingRefractionStrength = UNDERLYING_MAX_REFRACTION_STRENGTH * globalEffectFactor;
    float currentUnderlyingCAStrength = UNDERLYING_CHROMATIC_ABERRATION_STRENGTH * globalEffectFactor;

    vec2 underlyingBaseDisplacement = getUnderlyingRefractionDisplacement(uv_scene, time_scene, currentUnderlyingRefractionStrength);

    vec2 uv_r_bg = uv_scene + underlyingBaseDisplacement * (1.0 - currentUnderlyingCAStrength);
    vec2 uv_g_bg = uv_scene + underlyingBaseDisplacement;
    vec2 uv_b_bg = uv_scene + underlyingBaseDisplacement * (1.0 + currentUnderlyingCAStrength);

    uv_r_bg = fract(uv_r_bg); // Wrap UVs
    uv_g_bg = fract(uv_g_bg);
    uv_b_bg = fract(uv_b_bg);

    float moireR_bg = getMoire(uv_r_bg, time_scene, aspect_source_res);
    float moireG_bg = getMoire(uv_g_bg, time_scene, aspect_source_res);
    float moireB_bg = getMoire(uv_b_bg, time_scene, aspect_source_res);

    vec3 sceneColor = vec3(moireR_bg, moireG_bg, moireB_bg);

    vec3 dullSceneColor = vec3(dot(sceneColor, vec3(0.299, 0.587, 0.114)));
    sceneColor = mix(dullSceneColor, sceneColor, globalEffectFactor);

    float contrastFactor = mix(0.6, 1.0, globalEffectFactor);
    float brightnessOffset = mix(0.2, 0.0, globalEffectFactor);
    sceneColor = sceneColor * contrastFactor + brightnessOffset;
    
    return clamp(sceneColor, 0.0, 1.0);
}

// --- Generate Normal for the Top Glass Block surface ---
vec3 getTopGlassBlockNormal(vec2 uv, float time) {
    float t = time * TOP_BLOCK_NORMAL_ANIM_SPEED;
    float scale_coarse = 2.0 + sin(t*0.3)*0.5;
    float scale_fine = 8.0 + cos(t*0.4)*2.0;

    float h_coarse_x_deriv = cos(uv.x * scale_coarse + uv.y * 0.5 * scale_coarse + t) * 0.7;
    h_coarse_x_deriv += sin(uv.x * 0.8 * scale_coarse - uv.y * 1.2 * scale_coarse - t * 1.3) * 0.5;
    float h_coarse_y_deriv = sin(uv.y * scale_coarse - uv.x * 0.4 * scale_coarse + t * 1.1) * 0.7;
    h_coarse_y_deriv += cos(uv.y * 1.1 * scale_coarse + uv.x * 0.7 * scale_coarse - t * 0.8) * 0.5;
    float h_fine_x_deriv = cos(uv.x * scale_fine - t * 2.5 + sin(uv.y*scale_fine*0.7)) * 0.2;
    float h_fine_y_deriv = sin(uv.y * scale_fine + t * 2.2 + cos(uv.x*scale_fine*0.8)) * 0.2;
    
    float perturb_strength = 0.5;
    vec3 normal = normalize(vec3(
        (h_coarse_x_deriv + h_fine_x_deriv) * perturb_strength,
        (h_coarse_y_deriv + h_fine_y_deriv) * perturb_strength,
        1.0 ));
    return normal;
}

// --- Core 2D Effect Function ---
// effect_uv is [0,1] for the current surface (cube face).
// face_normal_local is used to generate a unique offset for this face.
vec3 getSurfaceEffectColor(vec2 effect_uv_in, float time, vec2 effect_aspect_ratio_source_resolution, vec3 face_normal_local) {
    // Per-face UV offset
    vec2 face_seed = face_normal_local.xy + face_normal_local.yz * 1.5 + face_normal_local.zx * 2.5; // Create a somewhat unique seed from normal
    vec2 random_uv_offset = (random2(face_seed) - 0.5) * 2.0 * PER_FACE_UV_OFFSET_STRENGTH;
    vec2 effect_uv = fract(effect_uv_in + random_uv_offset); // Apply offset and wrap

    float effectFactor = smoothstep(EFFECT_START_TIME, EFFECT_FULL_TIME, time);

    vec3 glassBlockNormal = getTopGlassBlockNormal(effect_uv, time);

    float currentTopBlockRefractionStrength = TOP_BLOCK_REFRACTION_STRENGTH * effectFactor;
    vec2 topBlockDisplacement = glassBlockNormal.xy * currentTopBlockRefractionStrength;

    float currentTopBlockCAStrength = TOP_BLOCK_CA_STRENGTH * effectFactor;

    vec3 refractedColorR = getUnderlyingSceneColor(fract(effect_uv + topBlockDisplacement * (1.0 + currentTopBlockCAStrength)), time, effectFactor, effect_aspect_ratio_source_resolution);
    vec3 refractedColorG = getUnderlyingSceneColor(fract(effect_uv + topBlockDisplacement), time, effectFactor, effect_aspect_ratio_source_resolution);
    vec3 refractedColorB = getUnderlyingSceneColor(fract(effect_uv + topBlockDisplacement * (1.0 - currentTopBlockCAStrength)), time, effectFactor, effect_aspect_ratio_source_resolution);

    vec3 finalRefractedSceneColor = vec3(refractedColorR.r, refractedColorG.g, refractedColorB.b);

    vec3 viewDir_effect = vec3(0.0, 0.0, 1.0); 
    vec3 lightDir_effect = normalize(vec3(0.7, 0.7, 1.0)); 

    vec3 halfwayDir = normalize(lightDir_effect + viewDir_effect);
    float specAngle = max(0.0, dot(glassBlockNormal, halfwayDir));
    float specular = pow(specAngle, TOP_BLOCK_SPECULAR_SHININESS);
    vec3 specularColor = vec3(1.0) * specular * TOP_BLOCK_SPECULAR_INTENSITY * effectFactor;

    float NdotV = max(0.0, dot(glassBlockNormal, viewDir_effect));
    float fresnel = TOP_BLOCK_FRESNEL_MIN_REFLECT + (1.0 - TOP_BLOCK_FRESNEL_MIN_REFLECT) * pow(1.0 - NdotV, TOP_BLOCK_FRESNEL_POWER);
    fresnel *= effectFactor;

    vec3 finalColor = mix(finalRefractedSceneColor, specularColor, fresnel);
    return clamp(finalColor, 0.0, 1.0);
}

// --- 3D Raycasting and Cube Utilities ---
mat3 rotationMatrix(vec3 axis, float angle) {
    axis = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;
    return mat3(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,
                oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,
                oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c);
}

// Simpler box intersection that returns t_min and t_max
vec2 intersectBoxDist(vec3 ro, vec3 rd, vec3 box_min, vec3 box_max) {
    vec3 invD = 1.0 / rd;
    vec3 t0s = (box_min - ro) * invD;
    vec3 t1s = (box_max - ro) * invD;
    vec3 tsmaller = min(t0s, t1s);
    vec3 tbigger  = max(t0s, t1s);
    float tmin = max(tsmaller.x, max(tsmaller.y, tsmaller.z));
    float tmax = min(tbigger.x, min(tbigger.y, tbigger.z));
    if (tmin > tmax || tmax < 0.0) return vec2(-1.0); // No hit or behind
    return vec2(tmin, tmax);
}

// Get normal for box hit
vec3 getBoxNormal(vec3 p_local, vec3 box_min, vec3 box_max) {
    vec3 c = (box_min + box_max) * 0.5;
    vec3 p_rel_center = p_local - c;
    vec3 d_half_size = (box_max - box_min) * 0.5;
    
    float bias = 1.001; // Slightly more than 1 to avoid issues at exact surface
    vec3 p_norm_scaled_inv = d_half_size / p_rel_center; // Inverse scaled position

    vec3 n = vec3(0.0);
    vec3 abs_inv = abs(p_norm_scaled_inv);

    if (abs_inv.x < abs_inv.y && abs_inv.x < abs_inv.z) {
        n.x = sign(p_rel_center.x);
    } else if (abs_inv.y < abs_inv.z) {
        n.y = sign(p_rel_center.y);
    } else {
        n.z = sign(p_rel_center.z);
    }
    return n;
}


vec2 getCubeFaceUVs(vec3 p_local, vec3 n_local, float cube_half_size) {
    vec2 uv;
    vec3 p_norm_on_face = p_local / cube_half_size;

    if (abs(n_local.x) > 0.5) {
        uv = vec2(-p_norm_on_face.z * n_local.x, -p_norm_on_face.y);
    } else if (abs(n_local.y) > 0.5) {
        uv = vec2(p_norm_on_face.x, p_norm_on_face.z * n_local.y);
    } else {
        uv = vec2(p_norm_on_face.x * n_local.z, -p_norm_on_face.y);
    }
    return uv * 0.5 + 0.5;
}

// --- Main 3D Scene Rendering ---
void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
    vec2 p_ndc = (2.0 * fragCoord.xy - iResolution.xy) / iResolution.y;
    float time = iTime;

    // Camera
    vec3 ro = vec3(0.0, 0.0, 3.0);
    vec3 target = vec3(0.0, 0.0, 0.0);
    vec3 cam_z = normalize(target - ro);
    vec3 cam_x = normalize(cross(vec3(0.0, 1.0, 0.0), cam_z));
    vec3 cam_y = normalize(cross(cam_z, cam_x));
    float fov_val = 1.8;
    vec3 rd = normalize(p_ndc.x * cam_x + p_ndc.y * cam_y + fov_val * cam_z);

    // Cube
    float cube_half_s = 0.7;
    vec3 box_min_orig = vec3(-cube_half_s);
    vec3 box_max_orig = vec3(cube_half_s);
    vec3 cube_center = vec3(0.0, 0.0, 0.0);

    // Cube Rotation
    // Base time-based rotation
    mat3 rot_y_time = rotationMatrix(vec3(0.0, 1.0, 0.0), time * 0.3);
    mat3 rot_x_time = rotationMatrix(vec3(1.0, 0.0, 0.0), time * 0.2);
    mat3 base_rotation = rot_y_time * rot_x_time;

    // Mouse rotation (applied on top of base rotation)
    mat3 mouse_rotation_offset = mat3(1.0); // Identity
    if (iMouse.z > 0.0) { // If left mouse button is down
        // iMouse.zw stores the screen coordinates where the mouse button was *pressed*
        // iMouse.xy stores the current mouse screen coordinates
        vec2 mouse_drag_pixels = iMouse.xy - iMouse.zw;
        // Normalize drag by screen height to make sensitivity somewhat consistent
        vec2 mouse_drag_normalized = mouse_drag_pixels / iResolution.y;

        float angle_yaw = -mouse_drag_normalized.x * MOUSE_SENSITIVITY; // Drag left/right -> Y-axis rotation
        float angle_pitch = -mouse_drag_normalized.y * MOUSE_SENSITIVITY; // Drag up/down -> X-axis rotation
        
        mat3 rot_mouse_y = rotationMatrix(vec3(0.0, 1.0, 0.0), angle_yaw);
        mat3 rot_mouse_x = rotationMatrix(vec3(1.0, 0.0, 0.0), angle_pitch);
        mouse_rotation_offset = rot_mouse_y * rot_mouse_x;
    }
    
    mat3 cube_rotation = mouse_rotation_offset * base_rotation; // Apply mouse drag to the time-animated cube
    mat3 inv_cube_rotation = transpose(cube_rotation);

    // Transform ray to cube's local space
    vec3 ro_local = (ro - cube_center) * inv_cube_rotation;
    vec3 rd_local = rd * inv_cube_rotation;

    vec3 finalColor = vec3(0.05, 0.05, 0.1); // Background

    vec2 hit_dists = intersectBoxDist(ro_local, rd_local, box_min_orig, box_max_orig);
    float t_hit = hit_dists.x; // Use entry point for opaque cube surface

    if (t_hit > 0.0) {
        vec3 hit_pos_local = ro_local + rd_local * t_hit;
        vec3 n_hit_local = getBoxNormal(hit_pos_local, box_min_orig, box_max_orig);
        
        vec2 face_uv = getCubeFaceUVs(hit_pos_local, n_hit_local, cube_half_s);
        
        finalColor = getSurfaceEffectColor(face_uv, time, iResolution.xy, n_hit_local);
    }

    fragColor = vec4(finalColor, 1.0);
}