void mainImage(out vec4 o, vec2 u) {
    float t = iTime/200.,i,z,d,s,w,l;
    for (o *= i; i++ < 99.;++w) {
        vec3 p = z * normalize(vec3(u+u,0)-iResolution.xyx);
        p += tan(t+p.yzx)*.002;
        s = .06 - length(p.xy);
        p.z -= t;
        p.xy *= sin(t)+2.;
        for (d=0.,w=sin(t)+2.; d++ < 8.; p *= l, w *= l )
            p  = abs(sin(p)) - 1.,
            l = (sin(.5*t)*.5+1.5)/dot(p,p);
        z += d = max(length(p)/w, s);
        o += z / d / 5e6;
    }
    o /= (o + 0.155) * 1.02;
}