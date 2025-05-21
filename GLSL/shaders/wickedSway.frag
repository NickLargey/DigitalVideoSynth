void mainImage(out vec4 o, vec2 u) {
    float t = iTime*.4,i,z,d,s,w,l;
    for (o *= i; i++ < 1e2;) {
        vec3 p = z * normalize(vec3(u+u+sin(t*.6)*u,0)-iResolution.xyx);
        p += sin(t+p.yzx)*.4;
        s = 3. - length(p.xy-z);
        for (d=0.,w=1.; d++ < 8.; p *= l, w *= l )
            p  = abs(sin(p)) - 1.,
            l = 1.3/dot(p,p);
        z += d = max(length(p)/w, s);
        o += z / d / 5e6;
    }
    o = tanh(o);
}