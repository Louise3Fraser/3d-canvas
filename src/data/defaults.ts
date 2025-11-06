export const defaultDimensions = {
  box: { Width: 1, Height: 1, Depth: 1 },
  cone: { Radius: 0.5, Height: 2, RadialSegments: 16 },
  cylinder: {
    RadiusTop: 0.5,
    RadiusBottom: 0.5,
    Height: 1,
    RadialSegments: 10,
  },
  sphere: { Radius: 0.5 },
  torus: {
    Radius: 1,
    TubeRadius: 0.4,
    RadialSegments: 10,
    TubularSegments: 16,
    Arc: Math.PI * 0.5,
  },
  capsule: {
    Radius: 1,
    Height: 1,
    CapSegments: 10,
    RadialSegments: 20,
  },
};
