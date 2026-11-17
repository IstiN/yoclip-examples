(() => {
  // three/three_global_shim.js
  var T = globalThis.THREE;
  if (T === void 0 || T === null) {
    throw new Error("three.unsupported: evaluate the JSR jsr_three_native.js/jsr_three_web.js bundle before this widget so globalThis.THREE is installed");
  }
  var { ACESFilmicToneMapping, AddEquation, AddOperation, AdditiveAnimationBlendMode, AdditiveBlending, AgXToneMapping, AlphaFormat, AlwaysCompare, AlwaysDepth, AlwaysStencilFunc, AmbientLight, AnimationAction, AnimationClip, AnimationLoader, AnimationMixer, AnimationObjectGroup, AnimationUtils, ArcCurve, ArrayCamera, ArrowHelper, AttachedBindMode, Audio, AudioAnalyser, AudioContext } = T;
  var { AudioListener, AudioLoader, AxesHelper, BackSide, BasicDepthPacking, BasicShadowMap, BatchedMesh, BezierInterpolant, Bone, BooleanKeyframeTrack, Box2, Box3, Box3Helper, BoxGeometry, BoxHelper, BufferAttribute, BufferGeometry, BufferGeometryLoader, ByteType, Cache, Camera, CameraHelper, CanvasTexture, CapsuleGeometry } = T;
  var { CatmullRomCurve3, CineonToneMapping, CircleGeometry, ClampToEdgeWrapping, Clock, Color, ColorKeyframeTrack, ColorManagement, Compatibility, CompressedArrayTexture, CompressedCubeTexture, CompressedTexture, CompressedTextureLoader, ConeGeometry, ConstantAlphaFactor, ConstantColorFactor, Controls, CubeCamera, CubeDepthTexture, CubeReflectionMapping, CubeRefractionMapping, CubeTexture, CubeTextureLoader, CubeUVReflectionMapping } = T;
  var { CubicBezierCurve, CubicBezierCurve3, CubicInterpolant, CullFaceBack, CullFaceFront, CullFaceFrontBack, CullFaceNone, Curve, CurvePath, CustomBlending, CustomToneMapping, CylinderGeometry, Cylindrical, Data3DTexture, DataArrayTexture, DataTexture, DataTextureLoader, DataUtils, DecrementStencilOp, DecrementWrapStencilOp, DefaultLoadingManager, DepthFormat, DepthStencilFormat, DepthTexture } = T;
  var { DetachedBindMode, DirectionalLight, DirectionalLightHelper, DiscreteInterpolant, DodecahedronGeometry, DoubleSide, DstAlphaFactor, DstColorFactor, DynamicCopyUsage, DynamicDrawUsage, DynamicReadUsage, EdgesGeometry, EllipseCurve, EqualCompare, EqualDepth, EqualStencilFunc, EquirectangularReflectionMapping, EquirectangularRefractionMapping, Euler, EventDispatcher, ExternalTexture, ExtrudeGeometry, FileLoader, Float16BufferAttribute } = T;
  var { Float32BufferAttribute, FloatType, Fog, FogExp2, FramebufferTexture, FrontSide, Frustum, FrustumArray, GLBufferAttribute, GLSL1, GLSL3, GLTFLoader, GreaterCompare, GreaterDepth, GreaterEqualCompare, GreaterEqualDepth, GreaterEqualStencilFunc, GreaterStencilFunc, GridHelper, Group, HTMLTexture, HalfFloatType, HemisphereLight, HemisphereLightHelper } = T;
  var { IcosahedronGeometry, ImageBitmapLoader, ImageLoader, ImageUtils, IncrementStencilOp, IncrementWrapStencilOp, InstancedBufferAttribute, InstancedBufferGeometry, InstancedInterleavedBuffer, InstancedMesh, Int16BufferAttribute, Int32BufferAttribute, Int8BufferAttribute, IntType, InterleavedBuffer, InterleavedBufferAttribute, Interpolant, InterpolateBezier, InterpolateDiscrete, InterpolateLinear, InterpolateSmooth, InterpolationSamplingMode, InterpolationSamplingType, InvertStencilOp } = T;
  var { JsrImageBitmapLoader, JsrPMREMGenerator, JsrThreeCanvas, KeepStencilOp, KeyframeTrack, LOD, LatheGeometry, Layers, LessCompare, LessDepth, LessEqualCompare, LessEqualDepth, LessEqualStencilFunc, LessStencilFunc, Light, LightProbe, LightShadow, Line, Line3, LineBasicMaterial, LineCurve, LineCurve3, LineDashedMaterial, LineLoop } = T;
  var { LineSegments, LinearFilter, LinearInterpolant, LinearMipMapLinearFilter, LinearMipMapNearestFilter, LinearMipmapLinearFilter, LinearMipmapNearestFilter, LinearSRGBColorSpace, LinearToneMapping, LinearTransfer, Loader, LoaderUtils, LoadingManager, LoopOnce, LoopPingPong, LoopRepeat, MOUSE, Material, MaterialBlending, MaterialLoader, MathUtils, Matrix2, Matrix3, Matrix4 } = T;
  var { MaxEquation, Mesh, MeshBasicMaterial, MeshDepthMaterial, MeshDistanceMaterial, MeshLambertMaterial, MeshMatcapMaterial, MeshNormalMaterial, MeshPhongMaterial, MeshPhysicalMaterial, MeshStandardMaterial, MeshToonMaterial, MinEquation, MirroredRepeatWrapping, MixOperation, MultiplyBlending, MultiplyOperation, NearestFilter, NearestMipMapLinearFilter, NearestMipMapNearestFilter, NearestMipmapLinearFilter, NearestMipmapNearestFilter, NeutralToneMapping, NeverCompare } = T;
  var { NeverDepth, NeverStencilFunc, NoBlending, NoColorSpace, NoNormalPacking, NoToneMapping, NormalAnimationBlendMode, NormalBlending, NormalGAPacking, NormalRGPacking, NotEqualCompare, NotEqualDepth, NotEqualStencilFunc, NumberKeyframeTrack, Object3D, ObjectLoader, ObjectSpaceNormalMap, OctahedronGeometry, OneFactor, OneMinusConstantAlphaFactor, OneMinusConstantColorFactor, OneMinusDstAlphaFactor, OneMinusDstColorFactor, OneMinusSrcAlphaFactor } = T;
  var { OneMinusSrcColorFactor, OriginalWebGLRenderer, OrthographicCamera, PCFShadowMap, PCFSoftShadowMap, PMREMGenerator, Path, PerspectiveCamera, Plane, PlaneGeometry, PlaneHelper, PointLight, PointLightHelper, Points, PointsMaterial, PolarGridHelper, PolyhedronGeometry, PositionalAudio, PropertyBinding, PropertyMixer, QuadraticBezierCurve, QuadraticBezierCurve3, Quaternion, QuaternionKeyframeTrack } = T;
  var { QuaternionLinearInterpolant, R11_EAC_Format, RED_GREEN_RGTC2_Format, RED_RGTC1_Format, REVISION, RG11_EAC_Format, RGBADepthPacking, RGBAFormat, RGBAIntegerFormat, RGBA_ASTC_10x10_Format, RGBA_ASTC_10x5_Format, RGBA_ASTC_10x6_Format, RGBA_ASTC_10x8_Format, RGBA_ASTC_12x10_Format, RGBA_ASTC_12x12_Format, RGBA_ASTC_4x4_Format, RGBA_ASTC_5x4_Format, RGBA_ASTC_5x5_Format, RGBA_ASTC_6x5_Format, RGBA_ASTC_6x6_Format, RGBA_ASTC_8x5_Format, RGBA_ASTC_8x6_Format, RGBA_ASTC_8x8_Format, RGBA_BPTC_Format } = T;
  var { RGBA_ETC2_EAC_Format, RGBA_PVRTC_2BPPV1_Format, RGBA_PVRTC_4BPPV1_Format, RGBA_S3TC_DXT1_Format, RGBA_S3TC_DXT3_Format, RGBA_S3TC_DXT5_Format, RGBDepthPacking, RGBFormat, RGBIntegerFormat, RGB_BPTC_SIGNED_Format, RGB_BPTC_UNSIGNED_Format, RGB_ETC1_Format, RGB_ETC2_Format, RGB_PVRTC_2BPPV1_Format, RGB_PVRTC_4BPPV1_Format, RGB_S3TC_DXT1_Format, RGDepthPacking, RGFormat, RGIntegerFormat, RawShaderMaterial, Ray, Raycaster, RectAreaLight, RedFormat } = T;
  var { RedIntegerFormat, ReinhardToneMapping, RenderObjectRefreshType, RenderTarget, RenderTarget3D, RepeatWrapping, ReplaceStencilOp, ReverseSubtractEquation, RingGeometry, SIGNED_R11_EAC_Format, SIGNED_RED_GREEN_RGTC2_Format, SIGNED_RED_RGTC1_Format, SIGNED_RG11_EAC_Format, SRGBColorSpace, SRGBTransfer, Scene, ShaderChunk, ShaderLib, ShaderMaterial, ShadowMaterial, Shape, ShapeGeometry, ShapePath, ShapeUtils } = T;
  var { ShortType, Skeleton, SkeletonHelper, SkinnedMesh, Source, Sphere, SphereGeometry, Spherical, SphericalHarmonics3, SplineCurve, SpotLight, SpotLightHelper, Sprite, SpriteMaterial, SrcAlphaFactor, SrcAlphaSaturateFactor, SrcColorFactor, StaticCopyUsage, StaticDrawUsage, StaticReadUsage, StereoCamera, StreamCopyUsage, StreamDrawUsage, StreamReadUsage } = T;
  var { StringKeyframeTrack, SubtractEquation, SubtractiveBlending, TOUCH, TangentSpaceNormalMap, TetrahedronGeometry, Texture, TextureLoader, TextureSource, TextureUtils, ThreeCapabilityError, ThreeCompatibilityRuntime, Timer, TimestampQuery, TorusGeometry, TorusKnotGeometry, Triangle, TriangleFanDrawMode, TriangleStripDrawMode, TrianglesDrawMode, TubeGeometry, UVMapping, Uint16BufferAttribute, Uint32BufferAttribute } = T;
  var { Uint8BufferAttribute, Uint8ClampedBufferAttribute, Uniform, UniformsGroup, UniformsLib, UniformsUtils, UnsignedByteType, UnsignedInt101111Type, UnsignedInt248Type, UnsignedInt5999Type, UnsignedIntType, UnsignedShort4444Type, UnsignedShort5551Type, UnsignedShortType, VSMShadowMap, Vector2, Vector3, Vector4, VectorKeyframeTrack, VideoFrameTexture, VideoTexture, WebGL3DRenderTarget, WebGLArrayRenderTarget, WebGLCoordinateSystem } = T;
  var { WebGLCubeRenderTarget, WebGLRenderTarget, WebGLRenderer, WebGLUtils, WebGPUCoordinateSystem, WebGPURenderer, WebXRController, WireframeGeometry, WrapAroundEnding, ZeroCurvatureEnding, ZeroFactor, ZeroSlopeEnding, ZeroStencilOp, _resumeAudio, createBoundedCSGEvaluator, createCanvasElement, error, get, getCapabilities, getConsoleFunction, getNativeCSGDiagnostics, getNativeRaycastDiagnostics, log, setConsoleFunction } = T;
  var { warn, warnOnce } = T;

  // three/addons_bundle.js
  var CopyShader = {
    name: "CopyShader",
    uniforms: {
      "tDiffuse": { value: null },
      "opacity": { value: 1 }
    },
    vertexShader: (
      /* glsl */
      `

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`
    ),
    fragmentShader: (
      /* glsl */
      `

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`
    )
  };
  var OutputShader = {
    name: "OutputShader",
    uniforms: {
      "tDiffuse": { value: null },
      "toneMappingExposure": { value: 1 }
    },
    vertexShader: (
      /* glsl */
      `
		precision highp float;

		uniform mat4 modelViewMatrix;
		uniform mat4 projectionMatrix;

		attribute vec3 position;
		attribute vec2 uv;

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`
    ),
    fragmentShader: (
      /* glsl */
      `

		precision highp float;

		uniform sampler2D tDiffuse;

		#include <tonemapping_pars_fragment>
		#include <colorspace_pars_fragment>

		varying vec2 vUv;

		void main() {

			gl_FragColor = texture2D( tDiffuse, vUv );

			// tone mapping

			#ifdef LINEAR_TONE_MAPPING

				gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );

			#elif defined( REINHARD_TONE_MAPPING )

				gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );

			#elif defined( CINEON_TONE_MAPPING )

				gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );

			#elif defined( ACES_FILMIC_TONE_MAPPING )

				gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );

			#elif defined( AGX_TONE_MAPPING )

				gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );

			#elif defined( NEUTRAL_TONE_MAPPING )

				gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );

			#elif defined( CUSTOM_TONE_MAPPING )

				gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );

			#endif

			// color space

			#ifdef SRGB_TRANSFER

				gl_FragColor = sRGBTransferOETF( gl_FragColor );

			#endif

		}`
    )
  };
  var LuminosityHighPassShader = {
    name: "LuminosityHighPassShader",
    uniforms: {
      "tDiffuse": { value: null },
      "luminosityThreshold": { value: 1 },
      "smoothWidth": { value: 1 },
      "defaultColor": { value: new Color(0) },
      "defaultOpacity": { value: 0 }
    },
    vertexShader: (
      /* glsl */
      `

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`
    ),
    fragmentShader: (
      /* glsl */
      `

		uniform sampler2D tDiffuse;
		uniform vec3 defaultColor;
		uniform float defaultOpacity;
		uniform float luminosityThreshold;
		uniform float smoothWidth;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			float v = luminance( texel.xyz );

			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

			float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );

			gl_FragColor = mix( outputColor, texel, alpha );

		}`
    )
  };
  var FXAAShader = {
    name: "FXAAShader",
    uniforms: {
      "tDiffuse": { value: null },
      "resolution": { value: new Vector2(1 / 1024, 1 / 512) }
    },
    vertexShader: (
      /* glsl */
      `

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`
    ),
    fragmentShader: (
      /* glsl */
      `

		uniform sampler2D tDiffuse;
		uniform vec2 resolution;
		varying vec2 vUv;

		#define EDGE_STEP_COUNT 6
		#define EDGE_GUESS 8.0
		#define EDGE_STEPS 1.0, 1.5, 2.0, 2.0, 2.0, 4.0
		const float edgeSteps[EDGE_STEP_COUNT] = float[EDGE_STEP_COUNT]( EDGE_STEPS );

		float _ContrastThreshold = 0.0312;
		float _RelativeThreshold = 0.063;
		float _SubpixelBlending = 1.0;

		vec4 Sample( sampler2D  tex2D, vec2 uv ) {

			return texture( tex2D, uv );

		}

		float SampleLuminance( sampler2D tex2D, vec2 uv ) {

			return dot( Sample( tex2D, uv ).rgb, vec3( 0.3, 0.59, 0.11 ) );

		}

		float SampleLuminance( sampler2D tex2D, vec2 texSize, vec2 uv, float uOffset, float vOffset ) {

			uv += texSize * vec2(uOffset, vOffset);
			return SampleLuminance(tex2D, uv);

		}

		struct LuminanceData {

			float m, n, e, s, w;
			float ne, nw, se, sw;
			float highest, lowest, contrast;

		};

		LuminanceData SampleLuminanceNeighborhood( sampler2D tex2D, vec2 texSize, vec2 uv ) {

			LuminanceData l;
			l.m = SampleLuminance( tex2D, uv );
			l.n = SampleLuminance( tex2D, texSize, uv,  0.0,  1.0 );
			l.e = SampleLuminance( tex2D, texSize, uv,  1.0,  0.0 );
			l.s = SampleLuminance( tex2D, texSize, uv,  0.0, -1.0 );
			l.w = SampleLuminance( tex2D, texSize, uv, -1.0,  0.0 );

			l.ne = SampleLuminance( tex2D, texSize, uv,  1.0,  1.0 );
			l.nw = SampleLuminance( tex2D, texSize, uv, -1.0,  1.0 );
			l.se = SampleLuminance( tex2D, texSize, uv,  1.0, -1.0 );
			l.sw = SampleLuminance( tex2D, texSize, uv, -1.0, -1.0 );

			l.highest = max( max( max( max( l.n, l.e ), l.s ), l.w ), l.m );
			l.lowest = min( min( min( min( l.n, l.e ), l.s ), l.w ), l.m );
			l.contrast = l.highest - l.lowest;
			return l;

		}

		bool ShouldSkipPixel( LuminanceData l ) {

			float threshold = max( _ContrastThreshold, _RelativeThreshold * l.highest );
			return l.contrast < threshold;

		}

		float DeterminePixelBlendFactor( LuminanceData l ) {

			float f = 2.0 * ( l.n + l.e + l.s + l.w );
			f += l.ne + l.nw + l.se + l.sw;
			f *= 1.0 / 12.0;
			f = abs( f - l.m );
			f = clamp( f / l.contrast, 0.0, 1.0 );

			float blendFactor = smoothstep( 0.0, 1.0, f );
			return blendFactor * blendFactor * _SubpixelBlending;

		}

		struct EdgeData {

			bool isHorizontal;
			float pixelStep;
			float oppositeLuminance, gradient;

		};

		EdgeData DetermineEdge( vec2 texSize, LuminanceData l ) {

			EdgeData e;
			float horizontal =
				abs( l.n + l.s - 2.0 * l.m ) * 2.0 +
				abs( l.ne + l.se - 2.0 * l.e ) +
				abs( l.nw + l.sw - 2.0 * l.w );
			float vertical =
				abs( l.e + l.w - 2.0 * l.m ) * 2.0 +
				abs( l.ne + l.nw - 2.0 * l.n ) +
				abs( l.se + l.sw - 2.0 * l.s );
			e.isHorizontal = horizontal >= vertical;

			float pLuminance = e.isHorizontal ? l.n : l.e;
			float nLuminance = e.isHorizontal ? l.s : l.w;
			float pGradient = abs( pLuminance - l.m );
			float nGradient = abs( nLuminance - l.m );

			e.pixelStep = e.isHorizontal ? texSize.y : texSize.x;

			if (pGradient < nGradient) {

				e.pixelStep = -e.pixelStep;
				e.oppositeLuminance = nLuminance;
				e.gradient = nGradient;

			} else {

				e.oppositeLuminance = pLuminance;
				e.gradient = pGradient;

			}

			return e;

		}

		float DetermineEdgeBlendFactor( sampler2D  tex2D, vec2 texSize, LuminanceData l, EdgeData e, vec2 uv ) {

			vec2 uvEdge = uv;
			vec2 edgeStep;
			if (e.isHorizontal) {

				uvEdge.y += e.pixelStep * 0.5;
				edgeStep = vec2( texSize.x, 0.0 );

			} else {

				uvEdge.x += e.pixelStep * 0.5;
				edgeStep = vec2( 0.0, texSize.y );

			}

			float edgeLuminance = ( l.m + e.oppositeLuminance ) * 0.5;
			float gradientThreshold = e.gradient * 0.25;

			vec2 puv = uvEdge + edgeStep * edgeSteps[0];
			float pLuminanceDelta = SampleLuminance( tex2D, puv ) - edgeLuminance;
			bool pAtEnd = abs( pLuminanceDelta ) >= gradientThreshold;

			for ( int i = 1; i < EDGE_STEP_COUNT && !pAtEnd; i++ ) {

				puv += edgeStep * edgeSteps[i];
				pLuminanceDelta = SampleLuminance( tex2D, puv ) - edgeLuminance;
				pAtEnd = abs( pLuminanceDelta ) >= gradientThreshold;

			}

			if ( !pAtEnd ) {

				puv += edgeStep * EDGE_GUESS;

			}

			vec2 nuv = uvEdge - edgeStep * edgeSteps[0];
			float nLuminanceDelta = SampleLuminance( tex2D, nuv ) - edgeLuminance;
			bool nAtEnd = abs( nLuminanceDelta ) >= gradientThreshold;

			for ( int i = 1; i < EDGE_STEP_COUNT && !nAtEnd; i++ ) {

				nuv -= edgeStep * edgeSteps[i];
				nLuminanceDelta = SampleLuminance( tex2D, nuv ) - edgeLuminance;
				nAtEnd = abs( nLuminanceDelta ) >= gradientThreshold;

			}

			if ( !nAtEnd ) {

				nuv -= edgeStep * EDGE_GUESS;

			}

			float pDistance, nDistance;
			if ( e.isHorizontal ) {

				pDistance = puv.x - uv.x;
				nDistance = uv.x - nuv.x;

			} else {

				pDistance = puv.y - uv.y;
				nDistance = uv.y - nuv.y;

			}

			float shortestDistance;
			bool deltaSign;
			if ( pDistance <= nDistance ) {

				shortestDistance = pDistance;
				deltaSign = pLuminanceDelta >= 0.0;

			} else {

				shortestDistance = nDistance;
				deltaSign = nLuminanceDelta >= 0.0;

			}

			if ( deltaSign == ( l.m - edgeLuminance >= 0.0 ) ) {

				return 0.0;

			}

			return 0.5 - shortestDistance / ( pDistance + nDistance );

		}

		vec4 ApplyFXAA( sampler2D  tex2D, vec2 texSize, vec2 uv ) {

			LuminanceData luminance = SampleLuminanceNeighborhood( tex2D, texSize, uv );
			if ( ShouldSkipPixel( luminance ) ) {

				return Sample( tex2D, uv );

			}

			float pixelBlend = DeterminePixelBlendFactor( luminance );
			EdgeData edge = DetermineEdge( texSize, luminance );
			float edgeBlend = DetermineEdgeBlendFactor( tex2D, texSize, luminance, edge, uv );
			float finalBlend = max( pixelBlend, edgeBlend );

			if (edge.isHorizontal) {

				uv.y += edge.pixelStep * finalBlend;

			} else {

				uv.x += edge.pixelStep * finalBlend;

			}

			return Sample( tex2D, uv );

		}

		void main() {

			gl_FragColor = ApplyFXAA( tDiffuse, resolution.xy, vUv );

		}`
    )
  };
  var SMAAEdgesShader = {
    name: "SMAAEdgesShader",
    defines: {
      "SMAA_THRESHOLD": "0.1"
    },
    uniforms: {
      "tDiffuse": { value: null },
      "resolution": { value: new Vector2(1 / 1024, 1 / 512) }
    },
    vertexShader: (
      /* glsl */
      `

		uniform vec2 resolution;

		varying vec2 vUv;
		varying vec4 vOffset[ 3 ];

		void SMAAEdgeDetectionVS( vec2 texcoord ) {
			vOffset[ 0 ] = texcoord.xyxy + resolution.xyxy * vec4( -1.0, 0.0, 0.0,  1.0 ); // WebGL port note: Changed sign in W component
			vOffset[ 1 ] = texcoord.xyxy + resolution.xyxy * vec4(  1.0, 0.0, 0.0, -1.0 ); // WebGL port note: Changed sign in W component
			vOffset[ 2 ] = texcoord.xyxy + resolution.xyxy * vec4( -2.0, 0.0, 0.0,  2.0 ); // WebGL port note: Changed sign in W component
		}

		void main() {

			vUv = uv;

			SMAAEdgeDetectionVS( vUv );

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`
    ),
    fragmentShader: (
      /* glsl */
      `

		uniform sampler2D tDiffuse;

		varying vec2 vUv;
		varying vec4 vOffset[ 3 ];

		vec4 SMAAColorEdgeDetectionPS( vec2 texcoord, vec4 offset[3], sampler2D colorTex ) {
			vec2 threshold = vec2( SMAA_THRESHOLD, SMAA_THRESHOLD );

			// Calculate color deltas:
			vec4 delta;
			vec3 C = texture2D( colorTex, texcoord ).rgb;

			vec3 Cleft = texture2D( colorTex, offset[0].xy ).rgb;
			vec3 t = abs( C - Cleft );
			delta.x = max( max( t.r, t.g ), t.b );

			vec3 Ctop = texture2D( colorTex, offset[0].zw ).rgb;
			t = abs( C - Ctop );
			delta.y = max( max( t.r, t.g ), t.b );

			// We do the usual threshold:
			vec2 edges = step( threshold, delta.xy );

			// Then discard if there is no edge:
			if ( dot( edges, vec2( 1.0, 1.0 ) ) == 0.0 )
				discard;

			// Calculate right and bottom deltas:
			vec3 Cright = texture2D( colorTex, offset[1].xy ).rgb;
			t = abs( C - Cright );
			delta.z = max( max( t.r, t.g ), t.b );

			vec3 Cbottom  = texture2D( colorTex, offset[1].zw ).rgb;
			t = abs( C - Cbottom );
			delta.w = max( max( t.r, t.g ), t.b );

			// Calculate the maximum delta in the direct neighborhood:
			float maxDelta = max( max( max( delta.x, delta.y ), delta.z ), delta.w );

			// Calculate left-left and top-top deltas:
			vec3 Cleftleft  = texture2D( colorTex, offset[2].xy ).rgb;
			t = abs( C - Cleftleft );
			delta.z = max( max( t.r, t.g ), t.b );

			vec3 Ctoptop = texture2D( colorTex, offset[2].zw ).rgb;
			t = abs( C - Ctoptop );
			delta.w = max( max( t.r, t.g ), t.b );

			// Calculate the final maximum delta:
			maxDelta = max( max( maxDelta, delta.z ), delta.w );

			// Local contrast adaptation in action:
			edges.xy *= step( 0.5 * maxDelta, delta.xy );

			return vec4( edges, 0.0, 0.0 );
		}

		void main() {

			gl_FragColor = SMAAColorEdgeDetectionPS( vUv, vOffset, tDiffuse );

		}`
    )
  };
  var SMAAWeightsShader = {
    name: "SMAAWeightsShader",
    defines: {
      "SMAA_MAX_SEARCH_STEPS": "8",
      "SMAA_AREATEX_MAX_DISTANCE": "16",
      "SMAA_AREATEX_PIXEL_SIZE": "( 1.0 / vec2( 160.0, 560.0 ) )",
      "SMAA_AREATEX_SUBTEX_SIZE": "( 1.0 / 7.0 )"
    },
    uniforms: {
      "tDiffuse": { value: null },
      "tArea": { value: null },
      "tSearch": { value: null },
      "resolution": { value: new Vector2(1 / 1024, 1 / 512) }
    },
    vertexShader: (
      /* glsl */
      `

		uniform vec2 resolution;

		varying vec2 vUv;
		varying vec4 vOffset[ 3 ];
		varying vec2 vPixcoord;

		void SMAABlendingWeightCalculationVS( vec2 texcoord ) {
			vPixcoord = texcoord / resolution;

			// We will use these offsets for the searches later on (see @PSEUDO_GATHER4):
			vOffset[ 0 ] = texcoord.xyxy + resolution.xyxy * vec4( -0.25, 0.125, 1.25, 0.125 ); // WebGL port note: Changed sign in Y and W components
			vOffset[ 1 ] = texcoord.xyxy + resolution.xyxy * vec4( -0.125, 0.25, -0.125, -1.25 ); // WebGL port note: Changed sign in Y and W components

			// And these for the searches, they indicate the ends of the loops:
			vOffset[ 2 ] = vec4( vOffset[ 0 ].xz, vOffset[ 1 ].yw ) + vec4( -2.0, 2.0, -2.0, 2.0 ) * resolution.xxyy * float( SMAA_MAX_SEARCH_STEPS );

		}

		void main() {

			vUv = uv;

			SMAABlendingWeightCalculationVS( vUv );

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`
    ),
    fragmentShader: (
      /* glsl */
      `

		#define SMAASampleLevelZeroOffset( tex, coord, offset ) texture2D( tex, coord + float( offset ) * resolution, 0.0 )

		uniform sampler2D tDiffuse;
		uniform sampler2D tArea;
		uniform sampler2D tSearch;
		uniform vec2 resolution;

		varying vec2 vUv;
		varying vec4 vOffset[3];
		varying vec2 vPixcoord;

		#if __VERSION__ == 100
		vec2 round( vec2 x ) {
			return sign( x ) * floor( abs( x ) + 0.5 );
		}
		#endif

		float SMAASearchLength( sampler2D searchTex, vec2 e, float bias, float scale ) {
			// Not required if searchTex accesses are set to point:
			// float2 SEARCH_TEX_PIXEL_SIZE = 1.0 / float2(66.0, 33.0);
			// e = float2(bias, 0.0) + 0.5 * SEARCH_TEX_PIXEL_SIZE +
			//     e * float2(scale, 1.0) * float2(64.0, 32.0) * SEARCH_TEX_PIXEL_SIZE;
			e.r = bias + e.r * scale;
			return 255.0 * texture2D( searchTex, e, 0.0 ).r;
		}

		float SMAASearchXLeft( sampler2D edgesTex, sampler2D searchTex, vec2 texcoord, float end ) {
			/**
				* @PSEUDO_GATHER4
				* This texcoord has been offset by (-0.25, -0.125) in the vertex shader to
				* sample between edge, thus fetching four edges in a row.
				* Sampling with different offsets in each direction allows to disambiguate
				* which edges are active from the four fetched ones.
				*/
			vec2 e = vec2( 0.0, 1.0 );

			for ( int i = 0; i < SMAA_MAX_SEARCH_STEPS; i ++ ) { // WebGL port note: Changed while to for
				e = texture2D( edgesTex, texcoord, 0.0 ).rg;
				texcoord -= vec2( 2.0, 0.0 ) * resolution;
				if ( ! ( texcoord.x > end && e.g > 0.8281 && e.r == 0.0 ) ) break;
			}

			// We correct the previous (-0.25, -0.125) offset we applied:
			texcoord.x += 0.25 * resolution.x;

			// The searches are bias by 1, so adjust the coords accordingly:
			texcoord.x += resolution.x;

			// Disambiguate the length added by the last step:
			texcoord.x += 2.0 * resolution.x; // Undo last step
			texcoord.x -= resolution.x * SMAASearchLength(searchTex, e, 0.0, 0.5);

			return texcoord.x;
		}

		float SMAASearchXRight( sampler2D edgesTex, sampler2D searchTex, vec2 texcoord, float end ) {
			vec2 e = vec2( 0.0, 1.0 );

			for ( int i = 0; i < SMAA_MAX_SEARCH_STEPS; i ++ ) { // WebGL port note: Changed while to for
				e = texture2D( edgesTex, texcoord, 0.0 ).rg;
				texcoord += vec2( 2.0, 0.0 ) * resolution;
				if ( ! ( texcoord.x < end && e.g > 0.8281 && e.r == 0.0 ) ) break;
			}

			texcoord.x -= 0.25 * resolution.x;
			texcoord.x -= resolution.x;
			texcoord.x -= 2.0 * resolution.x;
			texcoord.x += resolution.x * SMAASearchLength( searchTex, e, 0.5, 0.5 );

			return texcoord.x;
		}

		float SMAASearchYUp( sampler2D edgesTex, sampler2D searchTex, vec2 texcoord, float end ) {
			vec2 e = vec2( 1.0, 0.0 );

			for ( int i = 0; i < SMAA_MAX_SEARCH_STEPS; i ++ ) { // WebGL port note: Changed while to for
				e = texture2D( edgesTex, texcoord, 0.0 ).rg;
				texcoord += vec2( 0.0, 2.0 ) * resolution; // WebGL port note: Changed sign
				if ( ! ( texcoord.y > end && e.r > 0.8281 && e.g == 0.0 ) ) break;
			}

			texcoord.y -= 0.25 * resolution.y; // WebGL port note: Changed sign
			texcoord.y -= resolution.y; // WebGL port note: Changed sign
			texcoord.y -= 2.0 * resolution.y; // WebGL port note: Changed sign
			texcoord.y += resolution.y * SMAASearchLength( searchTex, e.gr, 0.0, 0.5 ); // WebGL port note: Changed sign

			return texcoord.y;
		}

		float SMAASearchYDown( sampler2D edgesTex, sampler2D searchTex, vec2 texcoord, float end ) {
			vec2 e = vec2( 1.0, 0.0 );

			for ( int i = 0; i < SMAA_MAX_SEARCH_STEPS; i ++ ) { // WebGL port note: Changed while to for
				e = texture2D( edgesTex, texcoord, 0.0 ).rg;
				texcoord -= vec2( 0.0, 2.0 ) * resolution; // WebGL port note: Changed sign
				if ( ! ( texcoord.y < end && e.r > 0.8281 && e.g == 0.0 ) ) break;
			}

			texcoord.y += 0.25 * resolution.y; // WebGL port note: Changed sign
			texcoord.y += resolution.y; // WebGL port note: Changed sign
			texcoord.y += 2.0 * resolution.y; // WebGL port note: Changed sign
			texcoord.y -= resolution.y * SMAASearchLength( searchTex, e.gr, 0.5, 0.5 ); // WebGL port note: Changed sign

			return texcoord.y;
		}

		vec2 SMAAArea( sampler2D areaTex, vec2 dist, float e1, float e2, float offset ) {
			// Rounding prevents precision errors of bilinear filtering:
			vec2 texcoord = float( SMAA_AREATEX_MAX_DISTANCE ) * round( 4.0 * vec2( e1, e2 ) ) + dist;

			// We do a scale and bias for mapping to texel space:
			texcoord = SMAA_AREATEX_PIXEL_SIZE * texcoord + ( 0.5 * SMAA_AREATEX_PIXEL_SIZE );

			// Move to proper place, according to the subpixel offset:
			texcoord.y += SMAA_AREATEX_SUBTEX_SIZE * offset;

			return texture2D( areaTex, texcoord, 0.0 ).rg;
		}

		vec4 SMAABlendingWeightCalculationPS( vec2 texcoord, vec2 pixcoord, vec4 offset[ 3 ], sampler2D edgesTex, sampler2D areaTex, sampler2D searchTex, ivec4 subsampleIndices ) {
			vec4 weights = vec4( 0.0, 0.0, 0.0, 0.0 );

			vec2 e = texture2D( edgesTex, texcoord ).rg;

			if ( e.g > 0.0 ) { // Edge at north
				vec2 d;

				// Find the distance to the left:
				vec2 coords;
				coords.x = SMAASearchXLeft( edgesTex, searchTex, offset[ 0 ].xy, offset[ 2 ].x );
				coords.y = offset[ 1 ].y; // offset[1].y = texcoord.y - 0.25 * resolution.y (@CROSSING_OFFSET)
				d.x = coords.x;

				// Now fetch the left crossing edges, two at a time using bilinear
				// filtering. Sampling at -0.25 (see @CROSSING_OFFSET) enables to
				// discern what value each edge has:
				float e1 = texture2D( edgesTex, coords, 0.0 ).r;

				// Find the distance to the right:
				coords.x = SMAASearchXRight( edgesTex, searchTex, offset[ 0 ].zw, offset[ 2 ].y );
				d.y = coords.x;

				// We want the distances to be in pixel units (doing this here allow to
				// better interleave arithmetic and memory accesses):
				d = d / resolution.x - pixcoord.x;

				// SMAAArea below needs a sqrt, as the areas texture is compressed
				// quadratically:
				vec2 sqrt_d = sqrt( abs( d ) );

				// Fetch the right crossing edges:
				coords.y -= 1.0 * resolution.y; // WebGL port note: Added
				float e2 = SMAASampleLevelZeroOffset( edgesTex, coords, ivec2( 1, 0 ) ).r;

				// Ok, we know how this pattern looks like, now it is time for getting
				// the actual area:
				weights.rg = SMAAArea( areaTex, sqrt_d, e1, e2, float( subsampleIndices.y ) );
			}

			if ( e.r > 0.0 ) { // Edge at west
				vec2 d;

				// Find the distance to the top:
				vec2 coords;

				coords.y = SMAASearchYUp( edgesTex, searchTex, offset[ 1 ].xy, offset[ 2 ].z );
				coords.x = offset[ 0 ].x; // offset[1].x = texcoord.x - 0.25 * resolution.x;
				d.x = coords.y;

				// Fetch the top crossing edges:
				float e1 = texture2D( edgesTex, coords, 0.0 ).g;

				// Find the distance to the bottom:
				coords.y = SMAASearchYDown( edgesTex, searchTex, offset[ 1 ].zw, offset[ 2 ].w );
				d.y = coords.y;

				// We want the distances to be in pixel units:
				d = d / resolution.y - pixcoord.y;

				// SMAAArea below needs a sqrt, as the areas texture is compressed
				// quadratically:
				vec2 sqrt_d = sqrt( abs( d ) );

				// Fetch the bottom crossing edges:
				coords.y -= 1.0 * resolution.y; // WebGL port note: Added
				float e2 = SMAASampleLevelZeroOffset( edgesTex, coords, ivec2( 0, 1 ) ).g;

				// Get the area for this direction:
				weights.ba = SMAAArea( areaTex, sqrt_d, e1, e2, float( subsampleIndices.x ) );
			}

			return weights;
		}

		void main() {

			gl_FragColor = SMAABlendingWeightCalculationPS( vUv, vPixcoord, vOffset, tDiffuse, tArea, tSearch, ivec4( 0.0 ) );

		}`
    )
  };
  var SMAABlendShader = {
    name: "SMAABlendShader",
    uniforms: {
      "tDiffuse": { value: null },
      "tColor": { value: null },
      "resolution": { value: new Vector2(1 / 1024, 1 / 512) }
    },
    vertexShader: (
      /* glsl */
      `

		uniform vec2 resolution;

		varying vec2 vUv;
		varying vec4 vOffset[ 2 ];

		void SMAANeighborhoodBlendingVS( vec2 texcoord ) {
			vOffset[ 0 ] = texcoord.xyxy + resolution.xyxy * vec4( -1.0, 0.0, 0.0, 1.0 ); // WebGL port note: Changed sign in W component
			vOffset[ 1 ] = texcoord.xyxy + resolution.xyxy * vec4( 1.0, 0.0, 0.0, -1.0 ); // WebGL port note: Changed sign in W component
		}

		void main() {

			vUv = uv;

			SMAANeighborhoodBlendingVS( vUv );

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`
    ),
    fragmentShader: (
      /* glsl */
      `

		uniform sampler2D tDiffuse;
		uniform sampler2D tColor;
		uniform vec2 resolution;

		varying vec2 vUv;
		varying vec4 vOffset[ 2 ];

		vec4 SMAANeighborhoodBlendingPS( vec2 texcoord, vec4 offset[ 2 ], sampler2D colorTex, sampler2D blendTex ) {
			// Fetch the blending weights for current pixel:
			vec4 a;
			a.xz = texture2D( blendTex, texcoord ).xz;
			a.y = texture2D( blendTex, offset[ 1 ].zw ).g;
			a.w = texture2D( blendTex, offset[ 1 ].xy ).a;

			// Is there any blending weight with a value greater than 0.0?
			if ( dot(a, vec4( 1.0, 1.0, 1.0, 1.0 )) < 1e-5 ) {
				return texture2D( colorTex, texcoord, 0.0 );
			} else {
				// Up to 4 lines can be crossing a pixel (one through each edge). We
				// favor blending by choosing the line with the maximum weight for each
				// direction:
				vec2 offset;
				offset.x = a.a > a.b ? a.a : -a.b; // left vs. right
				offset.y = a.g > a.r ? -a.g : a.r; // top vs. bottom // WebGL port note: Changed signs

				// Then we go in the direction that has the maximum weight:
				if ( abs( offset.x ) > abs( offset.y )) { // horizontal vs. vertical
					offset.y = 0.0;
				} else {
					offset.x = 0.0;
				}

				// Fetch the opposite color and lerp by hand:
				vec4 C = texture2D( colorTex, texcoord, 0.0 );
				texcoord += sign( offset ) * resolution;
				vec4 Cop = texture2D( colorTex, texcoord, 0.0 );
				float s = abs( offset.x ) > abs( offset.y ) ? abs( offset.x ) : abs( offset.y );

				// WebGL port note: Added gamma correction
				C.xyz = pow(C.xyz, vec3(2.2));
				Cop.xyz = pow(Cop.xyz, vec3(2.2));
				vec4 mixed = mix(C, Cop, s);
				mixed.xyz = pow(mixed.xyz, vec3(1.0 / 2.2));

				return mixed;
			}
		}

		void main() {

			gl_FragColor = SMAANeighborhoodBlendingPS( vUv, vOffset, tColor, tDiffuse );

		}`
    )
  };
  var Pass = class {
    /**
     * Constructs a new pass.
     */
    constructor() {
      this.isPass = true;
      this.enabled = true;
      this.needsSwap = true;
      this.clear = false;
      this.renderToScreen = false;
    }
    /**
     * Sets the size of the pass.
     *
     * @abstract
     * @param {number} width - The width to set.
     * @param {number} height - The height to set.
     */
    setSize() {
    }
    /**
     * This method holds the render logic of a pass. It must be implemented in all derived classes.
     *
     * @abstract
     * @param {WebGLRenderer} renderer - The renderer.
     * @param {WebGLRenderTarget} writeBuffer - The write buffer. This buffer is intended as the rendering
     * destination for the pass.
     * @param {WebGLRenderTarget} readBuffer - The read buffer. The pass can access the result from the
     * previous pass from this buffer.
     * @param {number} deltaTime - The delta time in seconds.
     * @param {boolean} maskActive - Whether masking is active or not.
     */
    render() {
      console.error("THREE.Pass: .render() must be implemented in derived pass.");
    }
    /**
     * Frees the GPU-related resources allocated by this instance. Call this
     * method whenever the pass is no longer used in your app.
     *
     * @abstract
     */
    dispose() {
    }
  };
  var _camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
  var FullscreenTriangleGeometry = class extends BufferGeometry {
    constructor() {
      super();
      this.setAttribute("position", new Float32BufferAttribute([-1, 3, 0, -1, -1, 0, 3, -1, 0], 3));
      this.setAttribute("uv", new Float32BufferAttribute([0, 2, 0, 0, 2, 0], 2));
    }
  };
  var _geometry = new FullscreenTriangleGeometry();
  var FullScreenQuad = class {
    /**
     * Constructs a new full screen quad.
     *
     * @param {?Material} material - The material to render te full screen quad with.
     */
    constructor(material) {
      this._mesh = new Mesh(_geometry, material);
    }
    /**
     * Frees the GPU-related resources allocated by this instance. Call this
     * method whenever the instance is no longer used in your app.
     */
    dispose() {
      this._mesh.geometry.dispose();
    }
    /**
     * Renders the full screen quad.
     *
     * @param {WebGLRenderer} renderer - The renderer.
     */
    render(renderer2) {
      renderer2.render(this._mesh, _camera);
    }
    /**
     * The quad's material.
     *
     * @type {?Material}
     */
    get material() {
      return this._mesh.material;
    }
    set material(value) {
      this._mesh.material = value;
    }
  };
  var MaskPass = class extends Pass {
    /**
     * Constructs a new mask pass.
     *
     * @param {Scene} scene - The 3D objects in this scene will define the mask.
     * @param {Camera} camera - The camera.
     */
    constructor(scene, camera2) {
      super();
      this.scene = scene;
      this.camera = camera2;
      this.clear = true;
      this.needsSwap = false;
      this.inverse = false;
    }
    /**
     * Performs a mask pass with the configured scene and camera.
     *
     * @param {WebGLRenderer} renderer - The renderer.
     * @param {WebGLRenderTarget} writeBuffer - The write buffer. This buffer is intended as the rendering
     * destination for the pass.
     * @param {WebGLRenderTarget} readBuffer - The read buffer. The pass can access the result from the
     * previous pass from this buffer.
     * @param {number} deltaTime - The delta time in seconds.
     * @param {boolean} maskActive - Whether masking is active or not.
     */
    render(renderer2, writeBuffer, readBuffer) {
      const context = renderer2.getContext();
      const state = renderer2.state;
      state.buffers.color.setMask(false);
      state.buffers.depth.setMask(false);
      state.buffers.color.setLocked(true);
      state.buffers.depth.setLocked(true);
      let writeValue, clearValue;
      if (this.inverse) {
        writeValue = 0;
        clearValue = 1;
      } else {
        writeValue = 1;
        clearValue = 0;
      }
      state.buffers.stencil.setTest(true);
      state.buffers.stencil.setOp(context.REPLACE, context.REPLACE, context.REPLACE);
      state.buffers.stencil.setFunc(context.ALWAYS, writeValue, 4294967295);
      state.buffers.stencil.setClear(clearValue);
      state.buffers.stencil.setLocked(true);
      renderer2.setRenderTarget(readBuffer);
      if (this.clear) renderer2.clear();
      renderer2.render(this.scene, this.camera);
      renderer2.setRenderTarget(writeBuffer);
      if (this.clear) renderer2.clear();
      renderer2.render(this.scene, this.camera);
      state.buffers.color.setLocked(false);
      state.buffers.depth.setLocked(false);
      state.buffers.color.setMask(true);
      state.buffers.depth.setMask(true);
      state.buffers.stencil.setLocked(false);
      state.buffers.stencil.setFunc(context.EQUAL, 1, 4294967295);
      state.buffers.stencil.setOp(context.KEEP, context.KEEP, context.KEEP);
      state.buffers.stencil.setLocked(true);
    }
  };
  var ClearMaskPass = class extends Pass {
    /**
     * Constructs a new clear mask pass.
     */
    constructor() {
      super();
      this.needsSwap = false;
    }
    /**
     * Performs the clear of the currently defined mask.
     *
     * @param {WebGLRenderer} renderer - The renderer.
     * @param {WebGLRenderTarget} writeBuffer - The write buffer. This buffer is intended as the rendering
     * destination for the pass.
     * @param {WebGLRenderTarget} readBuffer - The read buffer. The pass can access the result from the
     * previous pass from this buffer.
     * @param {number} deltaTime - The delta time in seconds.
     * @param {boolean} maskActive - Whether masking is active or not.
     */
    render(renderer2) {
      renderer2.state.buffers.stencil.setLocked(false);
      renderer2.state.buffers.stencil.setTest(false);
    }
  };
  var RenderPass = class extends Pass {
    /**
     * Constructs a new render pass.
     *
     * @param {Scene} scene - The scene to render.
     * @param {Camera} camera - The camera.
     * @param {?Material} [overrideMaterial=null] - The override material. If set, this material is used
     * for all objects in the scene.
     * @param {?(number|Color|string)} [clearColor=null] - The clear color of the render pass.
     * @param {?number} [clearAlpha=null] - The clear alpha of the render pass.
     */
    constructor(scene, camera2, overrideMaterial = null, clearColor = null, clearAlpha = null) {
      super();
      this.scene = scene;
      this.camera = camera2;
      this.overrideMaterial = overrideMaterial;
      this.clearColor = clearColor;
      this.clearAlpha = clearAlpha;
      this.clear = true;
      this.clearDepth = false;
      this.needsSwap = false;
      this.isRenderPass = true;
      this._oldClearColor = new Color();
    }
    /**
     * Performs a beauty pass with the configured scene and camera.
     *
     * @param {WebGLRenderer} renderer - The renderer.
     * @param {WebGLRenderTarget} writeBuffer - The write buffer. This buffer is intended as the rendering
     * destination for the pass.
     * @param {WebGLRenderTarget} readBuffer - The read buffer. The pass can access the result from the
     * previous pass from this buffer.
     * @param {number} deltaTime - The delta time in seconds.
     * @param {boolean} maskActive - Whether masking is active or not.
     */
    render(renderer2, writeBuffer, readBuffer) {
      const oldAutoClear = renderer2.autoClear;
      renderer2.autoClear = false;
      let oldClearAlpha, oldOverrideMaterial;
      if (this.overrideMaterial !== null) {
        oldOverrideMaterial = this.scene.overrideMaterial;
        this.scene.overrideMaterial = this.overrideMaterial;
      }
      if (this.clearColor !== null) {
        renderer2.getClearColor(this._oldClearColor);
        renderer2.setClearColor(this.clearColor, renderer2.getClearAlpha());
      }
      if (this.clearAlpha !== null) {
        oldClearAlpha = renderer2.getClearAlpha();
        renderer2.setClearAlpha(this.clearAlpha);
      }
      if (this.clearDepth == true) {
        renderer2.clearDepth();
      }
      renderer2.setRenderTarget(this.renderToScreen ? null : readBuffer);
      if (this.clear === true) {
        renderer2.clear(renderer2.autoClearColor, renderer2.autoClearDepth, renderer2.autoClearStencil);
      }
      renderer2.render(this.scene, this.camera);
      if (this.clearColor !== null) {
        renderer2.setClearColor(this._oldClearColor);
      }
      if (this.clearAlpha !== null) {
        renderer2.setClearAlpha(oldClearAlpha);
      }
      if (this.overrideMaterial !== null) {
        this.scene.overrideMaterial = oldOverrideMaterial;
      }
      renderer2.autoClear = oldAutoClear;
    }
  };
  var ShaderPass = class extends Pass {
    /**
     * Constructs a new shader pass.
     *
     * @param {Object|ShaderMaterial} [shader] - A shader object holding vertex and fragment shader as well as
     * defines and uniforms. It's also valid to pass a custom shader material.
     * @param {string} [textureID='tDiffuse'] - The name of the texture uniform that should sample
     * the read buffer.
     */
    constructor(shader, textureID = "tDiffuse") {
      super();
      this.textureID = textureID;
      this.uniforms = null;
      this.material = null;
      if (shader instanceof ShaderMaterial) {
        this.uniforms = shader.uniforms;
        this.material = shader;
      } else if (shader) {
        this.uniforms = UniformsUtils.clone(shader.uniforms);
        this.material = new ShaderMaterial({
          name: shader.name !== void 0 ? shader.name : "unspecified",
          defines: Object.assign({}, shader.defines),
          uniforms: this.uniforms,
          vertexShader: shader.vertexShader,
          fragmentShader: shader.fragmentShader
        });
      }
      this._fsQuad = new FullScreenQuad(this.material);
    }
    /**
     * Performs the shader pass.
     *
     * @param {WebGLRenderer} renderer - The renderer.
     * @param {WebGLRenderTarget} writeBuffer - The write buffer. This buffer is intended as the rendering
     * destination for the pass.
     * @param {WebGLRenderTarget} readBuffer - The read buffer. The pass can access the result from the
     * previous pass from this buffer.
     * @param {number} deltaTime - The delta time in seconds.
     * @param {boolean} maskActive - Whether masking is active or not.
     */
    render(renderer2, writeBuffer, readBuffer) {
      if (this.uniforms[this.textureID]) {
        this.uniforms[this.textureID].value = readBuffer.texture;
      }
      this._fsQuad.material = this.material;
      if (this.renderToScreen) {
        renderer2.setRenderTarget(null);
        this._fsQuad.render(renderer2);
      } else {
        renderer2.setRenderTarget(writeBuffer);
        if (this.clear) renderer2.clear(renderer2.autoClearColor, renderer2.autoClearDepth, renderer2.autoClearStencil);
        this._fsQuad.render(renderer2);
      }
    }
    /**
     * Frees the GPU-related resources allocated by this instance. Call this
     * method whenever the pass is no longer used in your app.
     */
    dispose() {
      this.material.dispose();
      this._fsQuad.dispose();
    }
  };
  var EffectComposer = class {
    /**
     * Constructs a new effect composer.
     *
     * @param {WebGLRenderer} renderer - The renderer.
     * @param {WebGLRenderTarget} [renderTarget] - This render target and a clone will
     * be used as the internal read and write buffers. If not given, the composer creates
     * the buffers automatically.
     */
    constructor(renderer2, renderTarget) {
      this.renderer = renderer2;
      this._pixelRatio = renderer2.getPixelRatio();
      if (renderTarget === void 0) {
        const size = renderer2.getSize(new Vector2());
        this._width = size.width;
        this._height = size.height;
        renderTarget = new WebGLRenderTarget(this._width * this._pixelRatio, this._height * this._pixelRatio, { type: HalfFloatType });
        renderTarget.texture.name = "EffectComposer.rt1";
      } else {
        this._width = renderTarget.width;
        this._height = renderTarget.height;
      }
      this.renderTarget1 = renderTarget;
      this.renderTarget2 = renderTarget.clone();
      this.renderTarget2.texture.name = "EffectComposer.rt2";
      this.writeBuffer = this.renderTarget1;
      this.readBuffer = this.renderTarget2;
      this.renderToScreen = true;
      this.passes = [];
      this.copyPass = new ShaderPass(CopyShader);
      this.copyPass.material.blending = NoBlending;
      this.timer = new Timer();
    }
    /**
     * Swaps the internal read/write buffers.
     */
    swapBuffers() {
      const tmp = this.readBuffer;
      this.readBuffer = this.writeBuffer;
      this.writeBuffer = tmp;
    }
    /**
     * Adds the given pass to the pass chain.
     *
     * @param {Pass} pass - The pass to add.
     */
    addPass(pass) {
      this.passes.push(pass);
      pass.setSize(this._width * this._pixelRatio, this._height * this._pixelRatio);
    }
    /**
     * Inserts the given pass at a given index.
     *
     * @param {Pass} pass - The pass to insert.
     * @param {number} index - The index into the pass chain.
     */
    insertPass(pass, index) {
      this.passes.splice(index, 0, pass);
      pass.setSize(this._width * this._pixelRatio, this._height * this._pixelRatio);
    }
    /**
     * Removes the given pass from the pass chain.
     *
     * @param {Pass} pass - The pass to remove.
     */
    removePass(pass) {
      const index = this.passes.indexOf(pass);
      if (index !== -1) {
        this.passes.splice(index, 1);
      }
    }
    /**
     * Returns `true` if the pass for the given index is the last enabled pass in the pass chain.
     *
     * @param {number} passIndex - The pass index.
     * @return {boolean} Whether the pass for the given index is the last pass in the pass chain.
     */
    isLastEnabledPass(passIndex) {
      for (let i = passIndex + 1; i < this.passes.length; i++) {
        if (this.passes[i].enabled) {
          return false;
        }
      }
      return true;
    }
    /**
     * Executes all enabled post-processing passes in order to produce the final frame.
     *
     * @param {number} deltaTime - The delta time in seconds. If not given, the composer computes
     * its own time delta value.
     */
    render(deltaTime) {
      this.timer.update();
      if (deltaTime === void 0) {
        deltaTime = this.timer.getDelta();
      }
      const currentRenderTarget = this.renderer.getRenderTarget();
      let maskActive = false;
      for (let i = 0, il = this.passes.length; i < il; i++) {
        const pass = this.passes[i];
        if (pass.enabled === false) continue;
        pass.renderToScreen = this.renderToScreen && this.isLastEnabledPass(i);
        pass.render(this.renderer, this.writeBuffer, this.readBuffer, deltaTime, maskActive);
        if (pass.needsSwap) {
          if (maskActive) {
            const context = this.renderer.getContext();
            const stencil = this.renderer.state.buffers.stencil;
            stencil.setFunc(context.NOTEQUAL, 1, 4294967295);
            this.copyPass.render(this.renderer, this.writeBuffer, this.readBuffer, deltaTime);
            stencil.setFunc(context.EQUAL, 1, 4294967295);
          }
          this.swapBuffers();
        }
        if (MaskPass !== void 0) {
          if (pass instanceof MaskPass) {
            maskActive = true;
          } else if (pass instanceof ClearMaskPass) {
            maskActive = false;
          }
        }
      }
      this.renderer.setRenderTarget(currentRenderTarget);
    }
    /**
     * Resets the internal state of the EffectComposer.
     *
     * @param {WebGLRenderTarget} [renderTarget] - This render target has the same purpose like
     * the one from the constructor. If set, it is used to setup the read and write buffers.
     */
    reset(renderTarget) {
      if (renderTarget === void 0) {
        const size = this.renderer.getSize(new Vector2());
        this._pixelRatio = this.renderer.getPixelRatio();
        this._width = size.width;
        this._height = size.height;
        renderTarget = this.renderTarget1.clone();
        renderTarget.setSize(this._width * this._pixelRatio, this._height * this._pixelRatio);
      }
      this.renderTarget1.dispose();
      this.renderTarget2.dispose();
      this.renderTarget1 = renderTarget;
      this.renderTarget2 = renderTarget.clone();
      this.writeBuffer = this.renderTarget1;
      this.readBuffer = this.renderTarget2;
    }
    /**
     * Resizes the internal read and write buffers as well as all passes. Similar to {@link WebGLRenderer#setSize},
     * this method honors the current pixel ration.
     *
     * @param {number} width - The width in logical pixels.
     * @param {number} height - The height in logical pixels.
     */
    setSize(width, height) {
      this._width = width;
      this._height = height;
      const effectiveWidth = this._width * this._pixelRatio;
      const effectiveHeight = this._height * this._pixelRatio;
      this.renderTarget1.setSize(effectiveWidth, effectiveHeight);
      this.renderTarget2.setSize(effectiveWidth, effectiveHeight);
      for (let i = 0; i < this.passes.length; i++) {
        this.passes[i].setSize(effectiveWidth, effectiveHeight);
      }
    }
    /**
     * Sets device pixel ratio. This is usually used for HiDPI device to prevent blurring output.
     * Setting the pixel ratio will automatically resize the composer.
     *
     * @param {number} pixelRatio - The pixel ratio to set.
     */
    setPixelRatio(pixelRatio) {
      this._pixelRatio = pixelRatio;
      this.setSize(this._width, this._height);
    }
    /**
     * Frees the GPU-related resources allocated by this instance. Call this
     * method whenever the composer is no longer used in your app.
     */
    dispose() {
      this.renderTarget1.dispose();
      this.renderTarget2.dispose();
      this.copyPass.dispose();
    }
  };
  var OutputPass = class extends Pass {
    /**
     * Constructs a new output pass.
     */
    constructor() {
      super();
      this.isOutputPass = true;
      this.uniforms = UniformsUtils.clone(OutputShader.uniforms);
      this.material = new RawShaderMaterial({
        name: OutputShader.name,
        uniforms: this.uniforms,
        vertexShader: OutputShader.vertexShader,
        fragmentShader: OutputShader.fragmentShader
      });
      this._fsQuad = new FullScreenQuad(this.material);
      this._outputColorSpace = null;
      this._toneMapping = null;
    }
    /**
     * Performs the output pass.
     *
     * @param {WebGLRenderer} renderer - The renderer.
     * @param {WebGLRenderTarget} writeBuffer - The write buffer. This buffer is intended as the rendering
     * destination for the pass.
     * @param {WebGLRenderTarget} readBuffer - The read buffer. The pass can access the result from the
     * previous pass from this buffer.
     * @param {number} deltaTime - The delta time in seconds.
     * @param {boolean} maskActive - Whether masking is active or not.
     */
    render(renderer2, writeBuffer, readBuffer) {
      this.uniforms["tDiffuse"].value = readBuffer.texture;
      this.uniforms["toneMappingExposure"].value = renderer2.toneMappingExposure;
      if (this._outputColorSpace !== renderer2.outputColorSpace || this._toneMapping !== renderer2.toneMapping) {
        this._outputColorSpace = renderer2.outputColorSpace;
        this._toneMapping = renderer2.toneMapping;
        this.material.defines = {};
        if (ColorManagement.getTransfer(this._outputColorSpace) === SRGBTransfer) this.material.defines.SRGB_TRANSFER = "";
        if (this._toneMapping === LinearToneMapping) this.material.defines.LINEAR_TONE_MAPPING = "";
        else if (this._toneMapping === ReinhardToneMapping) this.material.defines.REINHARD_TONE_MAPPING = "";
        else if (this._toneMapping === CineonToneMapping) this.material.defines.CINEON_TONE_MAPPING = "";
        else if (this._toneMapping === ACESFilmicToneMapping) this.material.defines.ACES_FILMIC_TONE_MAPPING = "";
        else if (this._toneMapping === AgXToneMapping) this.material.defines.AGX_TONE_MAPPING = "";
        else if (this._toneMapping === NeutralToneMapping) this.material.defines.NEUTRAL_TONE_MAPPING = "";
        else if (this._toneMapping === CustomToneMapping) this.material.defines.CUSTOM_TONE_MAPPING = "";
        this.material.needsUpdate = true;
      }
      if (this.renderToScreen === true) {
        renderer2.setRenderTarget(null);
        this._fsQuad.render(renderer2);
      } else {
        renderer2.setRenderTarget(writeBuffer);
        if (this.clear) renderer2.clear(renderer2.autoClearColor, renderer2.autoClearDepth, renderer2.autoClearStencil);
        this._fsQuad.render(renderer2);
      }
    }
    /**
     * Frees the GPU-related resources allocated by this instance. Call this
     * method whenever the pass is no longer used in your app.
     */
    dispose() {
      this.material.dispose();
      this._fsQuad.dispose();
    }
  };
  var UnrealBloomPass = class _UnrealBloomPass extends Pass {
    /**
     * Constructs a new Unreal Bloom pass.
     *
     * @param {Vector2} [resolution] - The effect's resolution.
     * @param {number} [strength=1] - The Bloom strength.
     * @param {number} radius - The Bloom radius.
     * @param {number} threshold - The luminance threshold limits which bright areas contribute to the Bloom effect.
     */
    constructor(resolution, strength = 1, radius, threshold) {
      super();
      this.strength = strength;
      this.radius = radius;
      this.threshold = threshold;
      this.resolution = resolution !== void 0 ? new Vector2(resolution.x, resolution.y) : new Vector2(256, 256);
      this.clearColor = new Color(0, 0, 0);
      this.needsSwap = false;
      this.renderTargetsHorizontal = [];
      this.renderTargetsVertical = [];
      this.nMips = 5;
      let resx = Math.round(this.resolution.x / 2);
      let resy = Math.round(this.resolution.y / 2);
      this.renderTargetBright = new WebGLRenderTarget(resx, resy, { type: HalfFloatType, depthBuffer: false });
      this.renderTargetBright.texture.name = "UnrealBloomPass.bright";
      this.renderTargetBright.texture.generateMipmaps = false;
      for (let i = 0; i < this.nMips; i++) {
        const renderTargetHorizontal = new WebGLRenderTarget(resx, resy, { type: HalfFloatType, depthBuffer: false });
        renderTargetHorizontal.texture.name = "UnrealBloomPass.h" + i;
        renderTargetHorizontal.texture.generateMipmaps = false;
        this.renderTargetsHorizontal.push(renderTargetHorizontal);
        const renderTargetVertical = new WebGLRenderTarget(resx, resy, { type: HalfFloatType, depthBuffer: false });
        renderTargetVertical.texture.name = "UnrealBloomPass.v" + i;
        renderTargetVertical.texture.generateMipmaps = false;
        this.renderTargetsVertical.push(renderTargetVertical);
        resx = Math.round(resx / 2);
        resy = Math.round(resy / 2);
      }
      const highPassShader = LuminosityHighPassShader;
      this.highPassUniforms = UniformsUtils.clone(highPassShader.uniforms);
      this.highPassUniforms["luminosityThreshold"].value = threshold;
      this.highPassUniforms["smoothWidth"].value = 0.01;
      this.materialHighPassFilter = new ShaderMaterial({
        uniforms: this.highPassUniforms,
        vertexShader: highPassShader.vertexShader,
        fragmentShader: highPassShader.fragmentShader
      });
      this.separableBlurMaterials = [];
      const kernelSizeArray = [6, 10, 14, 18, 22];
      resx = Math.round(this.resolution.x / 2);
      resy = Math.round(this.resolution.y / 2);
      for (let i = 0; i < this.nMips; i++) {
        this.separableBlurMaterials.push(this._getSeparableBlurMaterial(kernelSizeArray[i]));
        this.separableBlurMaterials[i].uniforms["invSize"].value = new Vector2(1 / resx, 1 / resy);
        resx = Math.round(resx / 2);
        resy = Math.round(resy / 2);
      }
      this.compositeMaterial = this._getCompositeMaterial(this.nMips);
      this.compositeMaterial.uniforms["blurTexture1"].value = this.renderTargetsVertical[0].texture;
      this.compositeMaterial.uniforms["blurTexture2"].value = this.renderTargetsVertical[1].texture;
      this.compositeMaterial.uniforms["blurTexture3"].value = this.renderTargetsVertical[2].texture;
      this.compositeMaterial.uniforms["blurTexture4"].value = this.renderTargetsVertical[3].texture;
      this.compositeMaterial.uniforms["blurTexture5"].value = this.renderTargetsVertical[4].texture;
      this.compositeMaterial.uniforms["bloomStrength"].value = strength;
      this.compositeMaterial.uniforms["bloomRadius"].value = 0.1;
      const bloomFactors = [1, 0.8, 0.6, 0.4, 0.2];
      this.compositeMaterial.uniforms["bloomFactors"].value = bloomFactors;
      this.bloomTintColors = [new Vector3(1, 1, 1), new Vector3(1, 1, 1), new Vector3(1, 1, 1), new Vector3(1, 1, 1), new Vector3(1, 1, 1)];
      this.compositeMaterial.uniforms["bloomTintColors"].value = this.bloomTintColors;
      this.copyUniforms = UniformsUtils.clone(CopyShader.uniforms);
      this.blendMaterial = new ShaderMaterial({
        uniforms: this.copyUniforms,
        vertexShader: CopyShader.vertexShader,
        fragmentShader: CopyShader.fragmentShader,
        premultipliedAlpha: true,
        blending: AdditiveBlending,
        depthTest: false,
        depthWrite: false,
        transparent: true
      });
      this._oldClearColor = new Color();
      this._oldClearAlpha = 1;
      this._basic = new MeshBasicMaterial();
      this._fsQuad = new FullScreenQuad(null);
    }
    /**
     * Frees the GPU-related resources allocated by this instance. Call this
     * method whenever the pass is no longer used in your app.
     */
    dispose() {
      for (let i = 0; i < this.renderTargetsHorizontal.length; i++) {
        this.renderTargetsHorizontal[i].dispose();
      }
      for (let i = 0; i < this.renderTargetsVertical.length; i++) {
        this.renderTargetsVertical[i].dispose();
      }
      this.renderTargetBright.dispose();
      for (let i = 0; i < this.separableBlurMaterials.length; i++) {
        this.separableBlurMaterials[i].dispose();
      }
      this.compositeMaterial.dispose();
      this.blendMaterial.dispose();
      this._basic.dispose();
      this._fsQuad.dispose();
    }
    /**
     * Sets the size of the pass.
     *
     * @param {number} width - The width to set.
     * @param {number} height - The height to set.
     */
    setSize(width, height) {
      let resx = Math.round(width / 2);
      let resy = Math.round(height / 2);
      this.renderTargetBright.setSize(resx, resy);
      for (let i = 0; i < this.nMips; i++) {
        this.renderTargetsHorizontal[i].setSize(resx, resy);
        this.renderTargetsVertical[i].setSize(resx, resy);
        this.separableBlurMaterials[i].uniforms["invSize"].value = new Vector2(1 / resx, 1 / resy);
        resx = Math.round(resx / 2);
        resy = Math.round(resy / 2);
      }
    }
    /**
     * Performs the Bloom pass.
     *
     * @param {WebGLRenderer} renderer - The renderer.
     * @param {WebGLRenderTarget} writeBuffer - The write buffer. This buffer is intended as the rendering
     * destination for the pass.
     * @param {WebGLRenderTarget} readBuffer - The read buffer. The pass can access the result from the
     * previous pass from this buffer.
     * @param {number} deltaTime - The delta time in seconds.
     * @param {boolean} maskActive - Whether masking is active or not.
     */
    render(renderer2, writeBuffer, readBuffer, deltaTime, maskActive) {
      renderer2.getClearColor(this._oldClearColor);
      this._oldClearAlpha = renderer2.getClearAlpha();
      const oldAutoClear = renderer2.autoClear;
      renderer2.autoClear = false;
      renderer2.setClearColor(this.clearColor, 0);
      if (maskActive) renderer2.state.buffers.stencil.setTest(false);
      if (this.renderToScreen) {
        this._fsQuad.material = this._basic;
        this._basic.map = readBuffer.texture;
        renderer2.setRenderTarget(null);
        renderer2.clear();
        this._fsQuad.render(renderer2);
      }
      this.highPassUniforms["tDiffuse"].value = readBuffer.texture;
      this.highPassUniforms["luminosityThreshold"].value = this.threshold;
      this._fsQuad.material = this.materialHighPassFilter;
      renderer2.setRenderTarget(this.renderTargetBright);
      renderer2.clear();
      this._fsQuad.render(renderer2);
      let inputRenderTarget = this.renderTargetBright;
      for (let i = 0; i < this.nMips; i++) {
        this._fsQuad.material = this.separableBlurMaterials[i];
        this.separableBlurMaterials[i].uniforms["colorTexture"].value = inputRenderTarget.texture;
        this.separableBlurMaterials[i].uniforms["direction"].value = _UnrealBloomPass.BlurDirectionX;
        renderer2.setRenderTarget(this.renderTargetsHorizontal[i]);
        renderer2.clear();
        this._fsQuad.render(renderer2);
        this.separableBlurMaterials[i].uniforms["colorTexture"].value = this.renderTargetsHorizontal[i].texture;
        this.separableBlurMaterials[i].uniforms["direction"].value = _UnrealBloomPass.BlurDirectionY;
        renderer2.setRenderTarget(this.renderTargetsVertical[i]);
        renderer2.clear();
        this._fsQuad.render(renderer2);
        inputRenderTarget = this.renderTargetsVertical[i];
      }
      this._fsQuad.material = this.compositeMaterial;
      this.compositeMaterial.uniforms["bloomStrength"].value = this.strength;
      this.compositeMaterial.uniforms["bloomRadius"].value = this.radius;
      this.compositeMaterial.uniforms["bloomTintColors"].value = this.bloomTintColors;
      renderer2.setRenderTarget(this.renderTargetsHorizontal[0]);
      renderer2.clear();
      this._fsQuad.render(renderer2);
      this._fsQuad.material = this.blendMaterial;
      this.copyUniforms["tDiffuse"].value = this.renderTargetsHorizontal[0].texture;
      if (maskActive) renderer2.state.buffers.stencil.setTest(true);
      if (this.renderToScreen) {
        renderer2.setRenderTarget(null);
        this._fsQuad.render(renderer2);
      } else {
        renderer2.setRenderTarget(readBuffer);
        this._fsQuad.render(renderer2);
      }
      renderer2.setClearColor(this._oldClearColor, this._oldClearAlpha);
      renderer2.autoClear = oldAutoClear;
    }
    // internals
    _getSeparableBlurMaterial(kernelRadius) {
      const coefficients = [];
      const sigma = kernelRadius / 3;
      for (let i = 0; i < kernelRadius; i++) {
        coefficients.push(0.39894 * Math.exp(-0.5 * i * i / (sigma * sigma)) / sigma);
      }
      const offsets = [];
      const weights = [];
      for (let i = 1; i < kernelRadius; i += 2) {
        const wa = coefficients[i];
        const wb = i + 1 < kernelRadius ? coefficients[i + 1] : 0;
        const w = wa + wb;
        offsets.push((i * wa + (i + 1) * wb) / w);
        weights.push(w);
      }
      return new ShaderMaterial({
        defines: {
          "KERNEL_PAIRS": offsets.length
        },
        uniforms: {
          "colorTexture": { value: null },
          "invSize": { value: new Vector2(0.5, 0.5) },
          // inverse texture size
          "direction": { value: new Vector2(0.5, 0.5) },
          "centerWeight": { value: coefficients[0] },
          "gaussianOffsets": { value: offsets },
          "gaussianWeights": { value: weights }
        },
        vertexShader: (
          /* glsl */
          `

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`
        ),
        fragmentShader: (
          /* glsl */
          `

				#include <common>

				varying vec2 vUv;

				uniform sampler2D colorTexture;
				uniform vec2 invSize;
				uniform vec2 direction;
				uniform float centerWeight;
				uniform float gaussianOffsets[KERNEL_PAIRS];
				uniform float gaussianWeights[KERNEL_PAIRS];

				void main() {

					vec3 diffuseSum = texture2D( colorTexture, vUv ).rgb * centerWeight;

					for ( int i = 0; i < KERNEL_PAIRS; i ++ ) {

						vec2 uvOffset = direction * invSize * gaussianOffsets[ i ];
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset ).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset ).rgb;
						diffuseSum += ( sample1 + sample2 ) * gaussianWeights[ i ];

					}

					gl_FragColor = vec4( diffuseSum, 1.0 );

				}`
        )
      });
    }
    _getCompositeMaterial(nMips) {
      return new ShaderMaterial({
        defines: {
          "NUM_MIPS": nMips
        },
        uniforms: {
          "blurTexture1": { value: null },
          "blurTexture2": { value: null },
          "blurTexture3": { value: null },
          "blurTexture4": { value: null },
          "blurTexture5": { value: null },
          "bloomStrength": { value: 1 },
          "bloomFactors": { value: null },
          "bloomTintColors": { value: null },
          "bloomRadius": { value: 0 }
        },
        vertexShader: (
          /* glsl */
          `

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`
        ),
        fragmentShader: (
          /* glsl */
          `

				varying vec2 vUv;

				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor( const in float factor ) {

					float mirrorFactor = 1.2 - factor;
					return mix( factor, mirrorFactor, bloomRadius );

				}

				void main() {

					// 3.0 for backwards compatibility with previous alpha-based intensity
					vec3 bloom = 3.0 * bloomStrength * (
						lerpBloomFactor( bloomFactors[ 0 ] ) * bloomTintColors[ 0 ] * texture2D( blurTexture1, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 1 ] ) * bloomTintColors[ 1 ] * texture2D( blurTexture2, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 2 ] ) * bloomTintColors[ 2 ] * texture2D( blurTexture3, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 3 ] ) * bloomTintColors[ 3 ] * texture2D( blurTexture4, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 4 ] ) * bloomTintColors[ 4 ] * texture2D( blurTexture5, vUv ).rgb
					);

					float bloomAlpha = max( bloom.r, max( bloom.g, bloom.b ) );
					gl_FragColor = vec4( bloom, bloomAlpha );

				}`
        )
      });
    }
  };
  UnrealBloomPass.BlurDirectionX = new Vector2(1, 0);
  UnrealBloomPass.BlurDirectionY = new Vector2(0, 1);

  // three/world.source.js
  var W = 1920;
  var H = 1080;
  var FPS = 30;
  var RENDER_SCALE = 2;
  var USE_FXAA = true;
  var OUTPUT_PASS_ONLY = false;
  var TWO_PI = Math.PI * 2;
  var canvas = jsr.three.createCanvas("main", { width: W, height: H, pixelRatio: RENDER_SCALE });
  var renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(RENDER_SCALE);
  renderer.setSize(W, H, false);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMappingExposure = 1;
  var world = new THREE.Scene();
  world.background = new THREE.Color(328970);
  world.fog = new THREE.FogExp2(328970, 0.017);
  var camera = new THREE.PerspectiveCamera(42, W / H, 0.1, 180);
  var cameraTarget = new THREE.Vector3();
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  camera.position.set(0, 0, 15);
  var fxaaComposer = null;
  var fxaaPass = null;
  function resizeFxaa(width, height) {
    if (!fxaaComposer) return;
    var pixelRatio = renderer.getPixelRatio();
    fxaaComposer.setSize(width, height);
    fxaaPass.uniforms.resolution.value.set(
      1 / Math.max(1, Math.floor(width * pixelRatio)),
      1 / Math.max(1, Math.floor(height * pixelRatio))
    );
  }
  if (USE_FXAA) {
    composerSize = renderer.getSize(new THREE.Vector2());
    composerTarget = new THREE.WebGLRenderTarget(
      Math.max(1, composerSize.x | 0),
      Math.max(1, composerSize.y | 0),
      { type: THREE.UnsignedByteType }
    );
    fxaaComposer = new EffectComposer(renderer, composerTarget);
    fxaaComposer.addPass(new RenderPass(world, camera));
    fxaaComposer.addPass(new OutputPass());
    fxaaMaterial = new THREE.ShaderMaterial({
      name: FXAAShader.name,
      defines: Object.assign({}, FXAAShader.defines),
      uniforms: FXAAShader.uniforms,
      vertexShader: FXAAShader.vertexShader,
      fragmentShader: FXAAShader.fragmentShader
    });
    fxaaPass = new ShaderPass(fxaaMaterial);
    fxaaPass.enabled = !OUTPUT_PASS_ONLY;
    fxaaComposer.addPass(fxaaPass);
    resizeFxaa(composerSize.x, composerSize.y);
  }
  var composerSize;
  var composerTarget;
  var fxaaMaterial;
  var VIOLET = 8141549;
  var LILAC = 10980346;
  var CYAN = 2282478;
  var WHITE = 16316415;
  var ORANGE = 16734774;
  var dummy = new THREE.Object3D();
  var tempColor = new THREE.Color();
  function clamp(v, a, b) {
    return Math.max(a, Math.min(b, v));
  }
  function out3(t) {
    var u = 1 - clamp(t, 0, 1);
    return 1 - u * u * u;
  }
  function inOut(t) {
    t = clamp(t, 0, 1);
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }
  function rnd(i, salt) {
    var x = Math.sin(i * 12.9898 + (salt || 0) * 78.233) * 43758.5453;
    return x - Math.floor(x);
  }
  function standard(color, emissive, intensity, roughness, metalness) {
    return new THREE.MeshStandardMaterial({
      color,
      emissive: emissive || 0,
      emissiveIntensity: intensity || 0,
      roughness: roughness === void 0 ? 0.35 : roughness,
      metalness: metalness === void 0 ? 0.55 : metalness
    });
  }
  function glow(color, opacity) {
    return new THREE.MeshBasicMaterial({ color, transparent: true, opacity, blending: THREE.AdditiveBlending, depthWrite: false });
  }
  function makeRadialTexture() {
    var data = new Uint8Array(64 * 64 * 4);
    for (var y = 0; y < 64; y++) for (var x = 0; x < 64; x++) {
      var dx = (x - 31.5) / 31.5, dy = (y - 31.5) / 31.5;
      var falloff = Math.max(0, 1 - Math.sqrt(dx * dx + dy * dy));
      var index = (y * 64 + x) * 4, alpha = Math.round(Math.pow(falloff, 2.2) * 255);
      data[index] = 255;
      data[index + 1] = 255;
      data[index + 2] = 255;
      data[index + 3] = alpha;
    }
    var texture = new THREE.DataTexture(data, 64, 64, THREE.RGBAFormat);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.needsUpdate = true;
    return texture;
  }
  var radialTexture = makeRadialTexture();
  function softGlow(color, opacity) {
    return new THREE.MeshBasicMaterial({ color, map: radialTexture, transparent: true, opacity, blending: THREE.AdditiveBlending, depthWrite: false });
  }
  function makeAsphaltTexture() {
    var data = new Uint8Array(128 * 128 * 4);
    for (var i = 0; i < 128 * 128; i++) {
      var value = 105 + Math.floor(rnd(i, 207) * 55), index = i * 4;
      data[index] = value;
      data[index + 1] = value;
      data[index + 2] = value + 3;
      data[index + 3] = 255;
    }
    var texture = new THREE.DataTexture(data, 128, 128, THREE.RGBAFormat);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(5, 60);
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = true;
    texture.needsUpdate = true;
    return texture;
  }
  function mesh(geometry, material, parent) {
    var m = new THREE.Mesh(geometry, material);
    if (parent) parent.add(m);
    return m;
  }
  function setMatrix(target, i, x, y, z, sx, sy, sz, rx, ry, rz) {
    dummy.position.set(x, y, z);
    dummy.scale.set(sx, sy, sz);
    dummy.rotation.set(rx || 0, ry || 0, rz || 0);
    dummy.updateMatrix();
    target.setMatrixAt(i, dummy.matrix);
  }
  function roundedRectShape(w, h, r) {
    var s = new THREE.Shape(), x = -w / 2, y = -h / 2;
    s.moveTo(x + r, y);
    s.lineTo(x + w - r, y);
    s.quadraticCurveTo(x + w, y, x + w, y + r);
    s.lineTo(x + w, y + h - r);
    s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    s.lineTo(x + r, y + h);
    s.quadraticCurveTo(x, y + h, x, y + h - r);
    s.lineTo(x, y + r);
    s.quadraticCurveTo(x, y, x + r, y);
    return s;
  }
  world.add(new THREE.HemisphereLight(11187455, 526352, 0.75));
  var key = new THREE.DirectionalLight(16777215, 2.3);
  key.position.set(3, 6, 8);
  world.add(key);
  key.castShadow = true;
  key.shadow.mapSize.width = 2048;
  key.shadow.mapSize.height = 2048;
  key.shadow.camera.left = -18;
  key.shadow.camera.right = 18;
  key.shadow.camera.top = 18;
  key.shadow.camera.bottom = -18;
  key.shadow.camera.near = 1;
  key.shadow.camera.far = 60;
  key.shadow.bias = -8e-4;
  key.shadow.normalBias = 0.03;
  key.shadow.radius = 3;
  key.shadow.camera.updateProjectionMatrix();
  key.target.position.set(0, 0, -8);
  world.add(key.target);
  var violetLight = new THREE.PointLight(VIOLET, 52, 34, 2);
  world.add(violetLight);
  var cyanLight = new THREE.PointLight(CYAN, 58, 32, 2);
  world.add(cyanLight);
  var orangeLight = new THREE.PointLight(ORANGE, 0, 25, 2);
  world.add(orangeLight);
  var carKey = new THREE.PointLight(16774376, 34, 18, 2);
  carKey.visible = false;
  world.add(carKey);
  var STAR_COUNT = 650;
  var starPositions = new Float32Array(STAR_COUNT * 3);
  var starColors = new Float32Array(STAR_COUNT * 3);
  for (si = 0; si < STAR_COUNT; si++) {
    sr = 10 + rnd(si, 1) * 58, sa = rnd(si, 2) * Math.PI * 2;
    starPositions[si * 3] = Math.cos(sa) * sr;
    starPositions[si * 3 + 1] = (rnd(si, 3) - 0.5) * 38;
    starPositions[si * 3 + 2] = Math.sin(sa) * sr - 16;
    tempColor.setHex(si % 9 === 0 ? ORANGE : si % 4 === 0 ? CYAN : WHITE);
    sb = 0.2 + rnd(si, 4) * 0.55;
    starColors[si * 3] = tempColor.r * sb;
    starColors[si * 3 + 1] = tempColor.g * sb;
    starColors[si * 3 + 2] = tempColor.b * sb;
  }
  var sr;
  var sa;
  var sb;
  var si;
  var starGeometry = new THREE.BufferGeometry();
  starGeometry.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
  starGeometry.setAttribute("color", new THREE.BufferAttribute(starColors, 3));
  var stars = new THREE.Points(starGeometry, new THREE.PointsMaterial({ size: 0.045, sizeAttenuation: true, vertexColors: true, transparent: true, opacity: 0.32, blending: THREE.AdditiveBlending, depthWrite: false }));
  world.add(stars);
  var bot = new THREE.Group();
  world.add(bot);
  var botBody = mesh(new THREE.ExtrudeGeometry(roundedRectShape(2.25, 1.6, 0.38), { depth: 0.44, bevelEnabled: true, bevelSegments: 6, bevelSize: 0.08, bevelThickness: 0.07, curveSegments: 20 }), standard(VIOLET, VIOLET, 0.22, 0.38, 0.48), bot);
  var face = mesh(new THREE.ShapeGeometry(roundedRectShape(1.78, 1.08, 0.18), 16), new THREE.MeshBasicMaterial({ color: 526349 }), bot);
  face.position.set(0, 0.05, 0.54);
  var eyeGeo = new THREE.ShapeGeometry(roundedRectShape(0.2, 0.32, 0.045), 10);
  var eyeMat = new THREE.MeshBasicMaterial({ color: CYAN });
  var eyeL = mesh(eyeGeo, eyeMat, bot);
  var eyeR = mesh(eyeGeo, eyeMat, bot);
  eyeL.position.set(-0.38, 0.18, 0.59);
  eyeR.position.set(0.38, 0.18, 0.59);
  var mouth = mesh(new THREE.ShapeGeometry(roundedRectShape(0.56, 0.07, 0.03), 8), new THREE.MeshBasicMaterial({ color: WHITE }), bot);
  mouth.position.set(0, -0.28, 0.6);
  var antenna = mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.52, 16), standard(LILAC, VIOLET, 0.2, 0.4, 0.6), bot);
  antenna.position.set(0, 1.02, 0.05);
  var antennaTip = mesh(new THREE.SphereGeometry(0.14, 24, 18), glow(ORANGE, 0.9), bot);
  antennaTip.position.set(0, 1.34, 0.05);
  bot.traverse(function(node) {
    if (node.isMesh && node.material && node.material.isMeshStandardMaterial) {
      node.castShadow = true;
      node.receiveShadow = true;
    }
  });
  var armGeo = new THREE.CylinderGeometry(0.07, 0.09, 1.05, 16);
  var armL = mesh(armGeo, standard(LILAC, VIOLET, 0.15, 0.4, 0.5), bot);
  var armR = mesh(armGeo, standard(LILAC, VIOLET, 0.15, 0.4, 0.5), bot);
  armL.position.set(-1.38, -0.03, 0.05);
  armR.position.set(1.38, -0.03, 0.05);
  armL.rotation.z = -0.82;
  armR.rotation.z = 0.82;
  var legL = mesh(new THREE.BoxGeometry(0.28, 0.62, 0.34), standard(LILAC, VIOLET, 0.1, 0.45, 0.45), bot);
  var legR = mesh(new THREE.BoxGeometry(0.28, 0.62, 0.34), standard(LILAC, VIOLET, 0.1, 0.45, 0.45), bot);
  legL.position.set(-0.5, -1.04, 0);
  legR.position.set(0.5, -1.04, 0);
  var footL = mesh(new THREE.BoxGeometry(0.52, 0.18, 0.62), standard(VIOLET, VIOLET, 0.1, 0.42, 0.5), bot);
  var footR = mesh(new THREE.BoxGeometry(0.52, 0.18, 0.62), standard(VIOLET, VIOLET, 0.1, 0.42, 0.5), bot);
  footL.position.set(-0.55, -1.4, 0.15);
  footR.position.set(0.55, -1.4, 0.15);
  var CODE_COUNT = 72;
  var codeMesh = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 0.035), standard(WHITE, VIOLET, 0.25, 0.5, 0.25), CODE_COUNT);
  codeMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  world.add(codeMesh);
  for (ci = 0; ci < CODE_COUNT; ci++) codeMesh.setColorAt(ci, new THREE.Color(ci % 11 === 0 ? ORANGE : ci % 4 === 0 ? CYAN : LILAC));
  var ci;
  if (codeMesh.instanceColor) codeMesh.instanceColor.needsUpdate = true;
  var brand = new THREE.Group();
  world.add(brand);
  var arc = mesh(new THREE.TorusGeometry(2.2, 0.16, 18, 128, Math.PI * 1.63), standard(LILAC, VIOLET, 0.25, 0.38, 0.62), brand);
  arc.rotation.z = -0.19;
  var arcGlow = mesh(new THREE.TorusGeometry(2.2, 0.025, 8, 128, Math.PI * 1.63), glow(CYAN, 0.45), brand);
  arcGlow.rotation.z = -0.19;
  arcGlow.position.z = 0.23;
  var bubble = mesh(new THREE.ExtrudeGeometry(roundedRectShape(2.45, 1.55, 0.42), { depth: 0.38, bevelEnabled: true, bevelSegments: 4, bevelSize: 0.09, bevelThickness: 0.08, curveSegments: 16 }), standard(VIOLET, VIOLET, 0.32, 0.36, 0.48), brand);
  bubble.position.set(0.42, 0, 0.18);
  var playShape = new THREE.Shape();
  playShape.moveTo(-0.28, -0.43);
  playShape.lineTo(0.48, 0);
  playShape.lineTo(-0.28, 0.43);
  playShape.closePath();
  var play = mesh(new THREE.ExtrudeGeometry(playShape, { depth: 0.12, bevelEnabled: true, bevelSegments: 2, bevelSize: 0.035, bevelThickness: 0.03 }), standard(WHITE, CYAN, 0.2, 0.42, 0.45), brand);
  play.position.set(0.42, 0, 0.72);
  var halo = mesh(new THREE.TorusGeometry(3.1, 0.018, 6, 144), glow(CYAN, 0.3), brand);
  halo.position.z = -0.5;
  var brandChrome = mesh(new THREE.ExtrudeGeometry(roundedRectShape(2.78, 1.88, 0.5), { depth: 0.24, bevelEnabled: true, bevelSegments: 5, bevelSize: 0.11, bevelThickness: 0.1, curveSegments: 20 }), standard(16316415, CYAN, 0.16, 0.16, 0.94), brand);
  brandChrome.position.set(0.42, 0, -0.06);
  var brandInset = mesh(new THREE.ExtrudeGeometry(roundedRectShape(2.14, 1.24, 0.34), { depth: 0.055, bevelEnabled: true, bevelSegments: 3, bevelSize: 0.045, bevelThickness: 0.035 }), standard(1051676, VIOLET, 0.4, 0.13, 0.72), brand);
  brandInset.position.set(0.42, 0, 0.61);
  var playEdge = mesh(new THREE.ExtrudeGeometry(playShape, { depth: 0.1, bevelEnabled: true, bevelSegments: 3, bevelSize: 0.055, bevelThickness: 0.045 }), standard(ORANGE, ORANGE, 0.38, 0.18, 0.82), brand);
  playEdge.position.set(0.42, 0, 0.68);
  playEdge.scale.setScalar(1.18);
  var brandOrbit = new THREE.Group();
  brand.add(brandOrbit);
  var orbitA = mesh(new THREE.TorusGeometry(2.86, 0.045, 8, 128), standard(16316415, CYAN, 0.32, 0.16, 0.92), brandOrbit);
  orbitA.rotation.x = 0.72;
  var orbitB = mesh(new THREE.TorusGeometry(2.66, 0.026, 8, 128), glow(VIOLET, 0.48), brandOrbit);
  orbitB.rotation.y = 0.92;
  var orbitC = mesh(new THREE.TorusGeometry(3.28, 0.012, 6, 128), glow(ORANGE, 0.35), brandOrbit);
  orbitC.rotation.set(0.35, 0.55, 0.2);
  var BRAND_GEMS = 24;
  var brandGems = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(0.095, 1), standard(WHITE, CYAN, 0.55, 0.18, 0.8), BRAND_GEMS);
  brandGems.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  brand.add(brandGems);
  for (bgm = 0; bgm < BRAND_GEMS; bgm++) brandGems.setColorAt(bgm, new THREE.Color(bgm % 5 === 0 ? ORANGE : bgm % 2 ? CYAN : LILAC));
  var bgm;
  if (brandGems.instanceColor) brandGems.instanceColor.needsUpdate = true;
  var brandSweep = mesh(new THREE.PlaneGeometry(0.13, 3.3), glow(WHITE, 0.34), brand);
  brandSweep.position.z = 1.02;
  brandSweep.rotation.z = -0.42;
  function updateBrand(frame, pulse) {
    brandOrbit.rotation.set(Math.sin(frame * 6e-3) * 0.12, frame * 45e-4, frame * 3e-3);
    arcGlow.material.opacity = 0.35 + pulse * 0.35;
    halo.material.opacity = 0.2 + pulse * 0.22;
    brandSweep.position.x = -2.4 + frame % 150 / 150 * 5.4;
    brandSweep.material.opacity = 0.12 + pulse * 0.25;
    play.scale.setScalar(1 + pulse * 0.045);
    playEdge.scale.setScalar(1.18 + pulse * 0.05);
    for (var i = 0; i < BRAND_GEMS; i++) {
      var a = i / BRAND_GEMS * Math.PI * 2 + frame * (4e-3 + i % 3 * 1e-3);
      var r = 2.75 + i % 4 * 0.19, y = Math.sin(a * 2 + i) * 0.72;
      var s = 0.65 + i % 3 * 0.18 + pulse * 0.22;
      setMatrix(brandGems, i, Math.cos(a) * r, y, Math.sin(a) * r * 0.55, s, s, s, frame * 0.01, a, 0);
    }
    brandGems.instanceMatrix.needsUpdate = true;
  }
  var knotGroup = new THREE.Group();
  world.add(knotGroup);
  var carRig = new THREE.Group();
  knotGroup.add(carRig);
  var carAssetState = "loading";
  var carWheels = [];
  var carScale = 1;
  var carOffset = new THREE.Vector3();
  var carBottomLocal = 0;
  var carGlassNodes = [];
  var driverRig = new THREE.Group();
  carRig.add(driverRig);
  driverRig.visible = false;
  var carDriver = null;
  var driverMixer = null;
  var driverFace = null;
  var driverHead = null;
  var driverActions = {};
  var driverAssetState = "loading";
  var driverRim = new THREE.PointLight(10475775, 10, 4, 2);
  driverRim.position.set(0.3, 1, 0.75);
  driverRig.add(driverRim);
  function positionDriver() {
    if (!carDriver || carAssetState !== "ready") return;
    driverRig.position.set(-0.3 + carOffset.x, -0.03 + carOffset.y, -0.3 + carOffset.z);
    driverRig.rotation.y = Math.PI;
  }
  var latestFrame = 0;
  var latestFps = FPS;
  var latestParams = {};
  var worldReady = false;
  function renderLatestFrame() {
    if (!worldReady) return;
    renderFrame(latestFrame, latestFps, latestParams);
    jsr.render({ type: "three", canvasId: "main", width: W, height: H, pixelRatio: RENDER_SCALE });
  }
  var studioRig = new THREE.Group();
  world.add(studioRig);
  studioRig.visible = false;
  new THREE.GLTFLoader().load("three/RobotExpressive.glb", function(gltf) {
    carDriver = gltf.scene;
    carDriver.scale.setScalar(0.3);
    carDriver.traverse(function(node) {
      if (node.isMesh) {
        node.castShadow = false;
        node.receiveShadow = true;
        if (/^(Foot|LowerLeg|Leg)/.test(node.name || "")) node.visible = false;
      }
    });
    driverRig.add(carDriver);
    var sitting = gltf.animations.find(function(item) {
      return item.name === "Sitting";
    });
    if (sitting) {
      var restMixer = new THREE.AnimationMixer(carDriver);
      restMixer.clipAction(sitting).play();
      restMixer.setTime(0);
      var gestureTracks = sitting.tracks.filter(function(track) {
        return /^(Head|Neck|Shoulder|UpperArm|LowerArm|Arm|Hand|Palm|Thumb|Index|Middle|Ring|Pinky)/.test(track.name);
      });
      driverMixer = new THREE.AnimationMixer(carDriver);
      driverActions.Sitting = driverMixer.clipAction(new THREE.AnimationClip("DriverGestures", sitting.duration, gestureTracks));
      driverActions.Sitting.play();
    }
    driverHead = carDriver.getObjectByName("Head");
    carDriver.traverse(function(node) {
      if (node.morphTargetDictionary && node.morphTargetDictionary.Smile !== void 0) driverFace = node;
    });
    driverAssetState = "ready";
    positionDriver();
    renderLatestFrame();
  }, void 0, function(error2) {
    driverAssetState = "error";
    console.error("Ferrari driver: " + error2);
  });
  function updateCarDrive(frame, progress, pulse) {
    knotGroup.visible = true;
    nodes.visible = false;
    driverRig.visible = true;
    driverRig.rotation.y = Math.PI;
    knotGroup.scale.setScalar(1.15);
    knotGroup.rotation.set(0, 0, 0);
    carRig.rotation.set(0, Math.sin(frame * 0.025) * 8e-3, Math.sin(frame * 0.07) * 6e-3);
    carRig.position.y = Math.sin(frame * 0.18) * 0.012;
    knotGroup.position.set(
      Math.sin(frame * 0.018) * 0.22,
      -0.04 - (carBottomLocal + carRig.position.y) * 1.15 + 0.012,
      0.8
    );
    updateRoad(frame);
    for (var w = 0; w < carWheels.length; w++) carWheels[w].rotation.x = -frame * 0.32;
    var talk = clamp((progress - 0.52) / 0.2, 0, 1) * (0.5 + Math.sin(frame * 0.32) * 0.5);
    if (driverActions.Yes) driverActions.Yes.setEffectiveWeight(talk * 0.18);
    if (driverActions.Sitting) driverActions.Sitting.setEffectiveWeight(1 - talk * 0.18);
    if (driverMixer) driverMixer.setTime(frame / Math.max(1, FPS));
    if (driverFace && driverFace.morphTargetDictionary && driverFace.morphTargetDictionary.Smile !== void 0) {
      driverFace.morphTargetInfluences[driverFace.morphTargetDictionary.Smile] = 0.45 + talk * 0.5;
    }
  }
  function carDriveShot(progress) {
    var p = progress;
    if (latestParams.act >= 14 && latestParams.act <= 15) p = (latestParams.beat % 2 + (latestParams.beatPhase || 0)) / 2;
    var x = knotGroup.position.x, z = knotGroup.position.z;
    if (p < 0.34) {
      var chase = p / 0.34;
      shotCamera(x + 4.4 - chase * 0.7, 1.35 + chase * 0.18, z + 7.2 - chase * 0.8, x, 0.86, z - 1.4, 56);
    } else if (p < 0.67) {
      var track = (p - 0.34) / 0.33;
      shotCamera(x + 7.4 - track * 1.1, 1.02, z + 1.7 - track * 3.2, x, 0.88, z - 0.65, 50);
    } else {
      var front = (p - 0.67) / 0.33;
      shotCamera(x - 3.6 + front * 0.8, 1.08 + front * 0.15, z - 7 + front * 0.55, x, 0.9, z + 0.1, 52);
    }
  }
  function carDetailShot(progress) {
    var wheel = carWheels[1] || carWheels[0];
    if (!wheel) {
      carDriveShot(progress);
      return;
    }
    var focus = wheel.getWorldPosition(new THREE.Vector3());
    var close = focus.clone().add(new THREE.Vector3(1.15, 0.3, 0.82));
    var closeTarget = focus.clone().add(new THREE.Vector3(-0.18, 0, 0.12));
    var startTarget = focus.clone().add(new THREE.Vector3(-0.55, 0.05, 0.35));
    var wide = new THREE.Vector3(knotGroup.position.x + 4.5, 1.45, knotGroup.position.z + 6.5);
    var carTarget = new THREE.Vector3(knotGroup.position.x, 0.88, knotGroup.position.z);
    if (progress < 0.52) {
      var q = inOut(progress / 0.52);
      var start = focus.clone().add(new THREE.Vector3(3.1, 1.05, 2.45));
      shotCamera(
        start.x + (close.x - start.x) * q,
        start.y + (close.y - start.y) * q,
        start.z + (close.z - start.z) * q,
        startTarget.x + (closeTarget.x - startTarget.x) * q,
        startTarget.y + (closeTarget.y - startTarget.y) * q,
        startTarget.z + (closeTarget.z - startTarget.z) * q,
        48 - q * 9
      );
    } else {
      var pull = inOut((progress - 0.52) / 0.48);
      shotCamera(
        close.x + (wide.x - close.x) * pull,
        close.y + (wide.y - close.y) * pull,
        close.z + (wide.z - close.z) * pull,
        closeTarget.x + (carTarget.x - closeTarget.x) * pull,
        closeTarget.y + (carTarget.y - closeTarget.y) * pull,
        closeTarget.z + (carTarget.z - closeTarget.z) * pull,
        39 + pull * 13
      );
    }
  }
  function driftPose(progress) {
    var drift = inOut(clamp(progress / 0.72, 0, 1));
    var park = inOut(clamp((progress - 0.68) / 0.32, 0, 1));
    return {
      drift,
      park,
      x: -3.4 + drift * 4.5 - park * 0.8,
      z: 0.8 - drift * 1.1 - park * 2,
      yaw: drift * 1.18 * (1 - park) + park * 0.03
    };
  }
  var activeDriftPose = null;
  function updateCarDrift(frame, progress, pulse) {
    updateCarDrive(frame, progress, pulse);
    var pose = driftPose(progress);
    var outroDrift = frame / FPS >= 199.32;
    if (outroDrift) {
      var exit = inOut(clamp((progress - 0.42) / 0.58, 0, 1));
      knotGroup.position.x = pose.x - exit * 9;
      knotGroup.position.z = pose.z + exit * 0.8;
      carRig.rotation.y = pose.yaw - exit * 0.22;
      activeDriftPose = pose;
    } else {
      var stop = inOut(clamp((progress - 0.42) / 0.34, 0, 1));
      var action = clamp((progress - 0.76) / 0.12, 0, 1);
      var sway = Math.sin(frame * 0.21) * 0.18 * action;
      knotGroup.position.x = pose.x * (1 - stop) + sway;
      knotGroup.position.z = pose.z + (0.9 - pose.z) * stop;
      carRig.rotation.y = pose.yaw + (0.03 - pose.yaw) * stop + Math.sin(frame * 0.21 + 0.8) * 0.025 * action;
      activeDriftPose = { x: knotGroup.position.x, z: knotGroup.position.z, yaw: carRig.rotation.y };
    }
    carRig.rotation.z = Math.sin(pose.drift * Math.PI) * 0.045 * (1 - pose.park);
    if (!outroDrift) carRig.rotation.z += Math.sin(frame * 0.21) * 8e-3 * clamp((progress - 0.76) / 0.12, 0, 1);
    if (progress > 0.68) {
      var brake = clamp((progress - 0.68) / 0.32, 0, 1);
      var brakeFrames = (progress - 0.68) * 0.68 * FPS;
      wheelSpin = (frame - brakeFrames) * 0.12 + brakeFrames * 0.12 * (brake - brake * brake * 0.5);
    }
    tailReflection.position.x = knotGroup.position.x;
    tailReflection.rotation.z = carRig.rotation.y;
    carContactShadow.position.x = knotGroup.position.x;
    carContactShadow.rotation.z = carRig.rotation.y * 0.5;
    var logoStart = outroDrift ? 0.34 : 0.38;
    var logoDuration = outroDrift ? 0.56 : 0.38;
    studioRig.visible = progress > logoStart;
    var logoIn = out3(clamp((progress - logoStart) / logoDuration, 0, 1));
    studioRig.scale.setScalar(outroDrift ? 0.72 + logoIn * 0.18 : 0.66 + logoIn * 0.16);
    studioRig.position.x = outroDrift ? (1 - logoIn) * 3.4 : 0;
    studioRig.position.y = outroDrift ? 1.65 + logoIn * 0.5 : 2.55 + logoIn * 0.55;
    studioRig.rotation.y = (1 - logoIn) * (outroDrift ? -0.28 : -0.18);
  }
  function carDriftShot(progress) {
    var outroDrift = latestParams.act === 17;
    var follow = inOut(clamp(progress / 0.75, 0, 1));
    var reveal = outroDrift ? inOut(clamp((progress - 0.44) / 0.56, 0, 1)) : inOut(clamp((progress - 0.28) / 0.32, 0, 1));
    var arc2 = Math.sin(reveal * Math.PI);
    var roadX = 4.8 - follow * 2, roadY = 1.1 + follow * 0.5, roadZ = 7.4 + follow * 1.2;
    var endX = outroDrift ? 1.5 : 1.4;
    var endY = outroDrift ? 3.5 : 3.4;
    var endZ = outroDrift ? 6.4 : 8.4;
    var targetX = outroDrift ? 1.25 : 0;
    var targetY = outroDrift ? 1.5 : 1.35;
    var targetZ = outroDrift ? -1.8 : -0.8;
    shotCamera(
      roadX + (endX - roadX) * reveal,
      roadY + (endY - roadY) * reveal + arc2 * 1.7,
      roadZ + (endZ - roadZ) * reveal - arc2 * 4.8,
      knotGroup.position.x * (1 - reveal) + targetX * reveal,
      0.85 + reveal * (targetY - 0.85),
      -0.4 + reveal * (targetZ + 0.4),
      54 - reveal * 8
    );
    updateDriftEffects(progress);
  }
  var DRIFT_SMOKE_COUNT = 48;
  var rearWheelLocalLeft = null;
  var rearWheelLocalRight = null;
  var driftSmokeMaterial = new THREE.MeshBasicMaterial({
    color: 10135221,
    map: radialTexture,
    transparent: true,
    opacity: 0,
    depthWrite: false
  });
  var driftSmoke = new THREE.InstancedMesh(new THREE.PlaneGeometry(1, 1), driftSmokeMaterial, DRIFT_SMOKE_COUNT);
  driftSmoke.visible = false;
  driftSmoke.frustumCulled = false;
  world.add(driftSmoke);
  function driftWheelPosition(pose, side) {
    var local = side < 0 ? rearWheelLocalLeft : rearWheelLocalRight;
    var localX = local ? local.x : side * 0.82, localZ = local ? local.z : 1.28;
    var c = Math.cos(pose.yaw), s = Math.sin(pose.yaw);
    return {
      x: pose.x + (localX * c + localZ * s) * 1.15,
      z: pose.z + (-localX * s + localZ * c) * 1.15
    };
  }
  function updateDriftEffects(progress) {
    var smokeIn = clamp((progress - 0.06) / 0.12, 0, 1);
    var smokeOut = latestParams.act === 17 ? 1 - clamp((progress - 0.72) / 0.2, 0, 1) : 1 - clamp((progress - 0.44) / 0.22, 0, 1);
    var smokeStrength = smokeIn * smokeOut;
    driftSmoke.visible = smokeStrength > 0.015;
    driftSmokeMaterial.opacity = 0.48 * smokeStrength;
    var pose = activeDriftPose || driftPose(progress);
    var backX = Math.sin(pose.yaw), backZ = Math.cos(pose.yaw);
    var sideX = -backZ, sideZ = backX;
    for (var i = 0; i < DRIFT_SMOKE_COUNT; i++) {
      var side = i % 2 === 0 ? -1 : 1;
      var age = (progress * 2.2 + Math.floor(i / 2) / (DRIFT_SMOKE_COUNT / 2) + rnd(i, 301) * 0.06) % 1;
      var base = driftWheelPosition(pose, side);
      var spread = (rnd(i, 302) - 0.5) * 0.6 * age;
      var size = (0.42 + age * 1.05) * (0.72 + rnd(i, 303) * 0.5);
      var outwardX = Math.cos(pose.yaw) * side * 0.28;
      var outwardZ = -Math.sin(pose.yaw) * side * 0.28;
      dummy.position.set(
        base.x + outwardX + backX * age * 1.15 + sideX * spread,
        0.24 + age * 0.6 + rnd(i, 304) * 0.1,
        base.z + outwardZ + backZ * age * 1.15 + sideZ * spread
      );
      var cameraDx = dummy.position.x - camera.position.x;
      var cameraDy = dummy.position.y - camera.position.y;
      var cameraDz = dummy.position.z - camera.position.z;
      var cameraDistance = Math.sqrt(cameraDx * cameraDx + cameraDy * cameraDy + cameraDz * cameraDz);
      size *= clamp((cameraDistance - 1.4) / 2.2, 0, 1);
      dummy.scale.set(size, size, 1);
      dummy.quaternion.copy(camera.quaternion);
      dummy.updateMatrix();
      driftSmoke.setMatrixAt(i, dummy.matrix);
    }
    driftSmoke.instanceMatrix.needsUpdate = true;
  }
  new THREE.GLTFLoader().load("three/Ferrari.glb", function(gltf) {
    var model = gltf.scene;
    var bounds = new THREE.Box3().setFromObject(model);
    var center = bounds.getCenter(new THREE.Vector3());
    var size = bounds.getSize(new THREE.Vector3());
    var scale = 5.4 / Math.max(size.x, size.y, size.z);
    carScale = scale;
    model.scale.setScalar(scale);
    model.position.set(-center.x * scale, -center.y * scale, -center.z * scale);
    carOffset.copy(model.position);
    carBottomLocal = bounds.min.y * scale + model.position.y;
    carWheels = ["wheel_fl", "wheel_fr", "wheel_rl", "wheel_rr"].map(function(name) {
      return model.getObjectByName(name);
    }).filter(Boolean);
    model.traverse(function(node) {
      var glassName = (node.name || "").toLowerCase();
      var materials = node.material ? Array.isArray(node.material) ? node.material : [node.material] : [];
      for (var mi = 0; mi < materials.length; mi++) {
        var material = materials[mi], materialName = (material.name || "").toLowerCase();
        if (glassName.indexOf("glass") >= 0 || materialName === "glass_gray" || material.transmission > 0) carGlassNodes.push(node);
        if (materialName === "body_color") {
          material.roughness = 0.26;
          material.metalness = 0.48;
        } else if (materialName === "taillight_glass") {
          material.roughness = 0.2;
          material.metalness = 0.08;
          material.emissive.setHex(16717832);
          material.emissiveIntensity = 2.4;
        } else if (materialName === "projector_glass") {
          material.roughness = 0.16;
          material.metalness = 0.16;
          material.emissive.setHex(12573951);
          material.emissiveIntensity = 0.5;
        } else if (materialName === "metal_chrome") {
          material.roughness = 0.18;
          material.metalness = 0.92;
        } else if (materialName === "tires") {
          material.roughness = 0.88;
          material.metalness = 0.02;
        } else if (materialName.indexOf("leather") >= 0 || materialName.indexOf("interior") >= 0) {
          material.roughness = 0.68;
          material.metalness = 0.04;
        } else if (material.isMeshStandardMaterial) {
          material.roughness = Math.min(material.roughness, 0.58);
        }
        material.needsUpdate = true;
      }
      if (node.isMesh) {
        node.castShadow = carGlassNodes.indexOf(node) < 0;
        node.receiveShadow = true;
      }
    });
    for (var glassIndex = 0; glassIndex < carGlassNodes.length; glassIndex++) {
      if (carGlassNodes[glassIndex].parent) carGlassNodes[glassIndex].parent.remove(carGlassNodes[glassIndex]);
    }
    console.log("Ferrari open cockpit until native glass alpha lands: removed nodes = " + carGlassNodes.length);
    carRig.add(model);
    knotGroup.updateMatrixWorld(true);
    var rearLeft = carRig.getObjectByName("wheel_rl"), rearRight = carRig.getObjectByName("wheel_rr");
    if (rearLeft && rearRight) {
      var rearLeftPosition = new THREE.Vector3(), rearRightPosition = new THREE.Vector3();
      rearLeft.getWorldPosition(rearLeftPosition);
      rearRight.getWorldPosition(rearRightPosition);
      rearWheelLocalLeft = { x: rearLeftPosition.x / 1.15, z: rearLeftPosition.z / 1.15 };
      rearWheelLocalRight = { x: rearRightPosition.x / 1.15, z: rearRightPosition.z / 1.15 };
      console.log("Drift wheel rigs: L " + rearWheelLocalLeft.x.toFixed(3) + "," + rearWheelLocalLeft.z.toFixed(3) + " R " + rearWheelLocalRight.x.toFixed(3) + "," + rearWheelLocalRight.z.toFixed(3));
    }
    carAssetState = "ready";
    positionDriver();
    renderLatestFrame();
  }, void 0, function(error2) {
    carAssetState = "error";
    console.error("Ferrari: " + error2);
  });
  var NODE_COUNT = 42;
  var nodePositions = [];
  var nodes = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(0.09, 1), standard(WHITE, CYAN, 0.35, 0.35, 0.55), NODE_COUNT);
  nodes.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  knotGroup.add(nodes);
  for (ni = 0; ni < NODE_COUNT; ni++) {
    ny = 1 - ni / (NODE_COUNT - 1) * 2, nr = Math.sqrt(Math.max(0, 1 - ny * ny)), nt = ni * Math.PI * (3 - Math.sqrt(5));
    nodePositions.push(new THREE.Vector3(Math.cos(nt) * nr * 4.4, ny * 3.2, Math.sin(nt) * nr * 3.4));
    nodes.setColorAt(ni, new THREE.Color(ni % 6 === 0 ? ORANGE : ni % 2 ? CYAN : LILAC));
  }
  var ny;
  var nr;
  var nt;
  var ni;
  if (nodes.instanceColor) nodes.instanceColor.needsUpdate = true;
  var PARTICLE_COUNT = 900;
  var particlePositions = new Float32Array(PARTICLE_COUNT * 3);
  var particleColors = new Float32Array(PARTICLE_COUNT * 3);
  for (pi = 0; pi < PARTICLE_COUNT; pi++) {
    tempColor.setHex(pi % 13 === 0 ? ORANGE : pi % 4 === 0 ? CYAN : LILAC);
    particleColors[pi * 3] = tempColor.r;
    particleColors[pi * 3 + 1] = tempColor.g;
    particleColors[pi * 3 + 2] = tempColor.b;
  }
  var pi;
  var particleGeometry = new THREE.BufferGeometry();
  particleGeometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
  particleGeometry.setAttribute("color", new THREE.BufferAttribute(particleColors, 3));
  var particles = new THREE.Points(particleGeometry, new THREE.PointsMaterial({ size: 0.065, sizeAttenuation: true, vertexColors: true, transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending, depthWrite: false }));
  world.add(particles);
  var beams = new THREE.Group();
  world.add(beams);
  for (bi = 0; bi < 8; bi++) {
    beam = mesh(new THREE.PlaneGeometry(0.055, 18), glow(bi % 3 === 0 ? ORANGE : bi % 2 ? CYAN : VIOLET, 0.24), beams);
    beam.position.set((bi - 3.5) * 1.8, 0, -3 - bi * 0.25);
    beam.rotation.z = -0.48 + bi * 0.13;
  }
  var beam;
  var bi;
  var grid = new THREE.GridHelper(40, 40, CYAN, 2433074);
  grid.position.y = -4;
  grid.material.transparent = true;
  grid.material.opacity = 0.16;
  world.add(grid);
  var shockwaves = new THREE.Group();
  world.add(shockwaves);
  var shockRings = [];
  for (sw = 0; sw < 4; sw++) {
    ring = mesh(new THREE.TorusGeometry(1, 0.025, 6, 96), glow(sw % 2 ? CYAN : ORANGE, 0.25), shockwaves);
    ring.position.z = -1.5 - sw * 0.12;
    shockRings.push(ring);
  }
  var ring;
  var sw;
  var SHARD_COUNT = 84;
  var shards = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), glow(LILAC, 0.42), SHARD_COUNT);
  shards.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  world.add(shards);
  for (shi = 0; shi < SHARD_COUNT; shi++) shards.setColorAt(shi, new THREE.Color(shi % 7 === 0 ? ORANGE : shi % 3 === 0 ? CYAN : LILAC));
  var shi;
  if (shards.instanceColor) shards.instanceColor.needsUpdate = true;
  var IMPACT_COUNT = 48;
  var impactLines = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), glow(CYAN, 0.25), IMPACT_COUNT);
  impactLines.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  world.add(impactLines);
  function updateEnergyEffects(frame, beatPhase, pulse, intensity) {
    for (var i = 0; i < shockRings.length; i++) {
      var phase = (beatPhase + i * 0.22) % 1;
      shockRings[i].scale.setScalar(0.5 + phase * 5.8 * intensity);
      shockRings[i].material.opacity = (1 - phase) * 0.28 * intensity;
      shockRings[i].rotation.set(0.2 + i * 0.17, i * 0.24, frame * 2e-3 * (i % 2 ? 1 : -1));
    }
    for (var s = 0; s < SHARD_COUNT; s++) {
      var angle = rnd(s, 61) * Math.PI * 2 + frame * (3e-3 + rnd(s, 62) * 8e-3);
      var radius = 2.2 + rnd(s, 63) * 5.5 + pulse * 0.8;
      var x = Math.cos(angle) * radius, y = Math.sin(angle) * radius * 0.65, z = -2 + (rnd(s, 64) - 0.5) * 7;
      var length = 0.15 + rnd(s, 65) * 0.65;
      setMatrix(shards, s, x, y, z, 0.035, 0.035, length * intensity, frame * 0.02 + s, angle, angle * 0.5);
    }
    shards.instanceMatrix.needsUpdate = true;
    impactLines.material.opacity = (0.035 + pulse * 0.24) * intensity;
    for (var a = 0; a < IMPACT_COUNT; a++) {
      var ia = a / IMPACT_COUNT * Math.PI * 2 + frame * 15e-4;
      var ir = 3 + rnd(a, 67) * 2;
      setMatrix(impactLines, a, Math.cos(ia) * ir, Math.sin(ia) * ir, -2.4, 0.018, 0.35 + pulse * (0.7 + rnd(a, 68) * 1.4), 0.018, 0, 0, -ia);
    }
    impactLines.instanceMatrix.needsUpdate = true;
  }
  var city = new THREE.Group();
  world.add(city);
  var CITY_COUNT = 56;
  var WINDOWS_PER_BUILDING = 5;
  var cityData = [];
  var buildings = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), standard(1512741, VIOLET, 0.08, 0.58, 0.45), CITY_COUNT);
  var windows = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 0.035), glow(CYAN, 0.7), CITY_COUNT * WINDOWS_PER_BUILDING);
  buildings.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  windows.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  city.add(buildings);
  city.add(windows);
  for (cityIndex = 0; cityIndex < CITY_COUNT; cityIndex++) {
    side = cityIndex % 2 ? 1 : -1;
    cityData.push({
      // Keep the fly-by camera corridor (x = -4.5…4.5) free of solid towers.
      x: side * (8.2 + rnd(cityIndex, 31) * 7),
      z: -5 - Math.floor(cityIndex / 2) * 2.7,
      w: 1.5 + rnd(cityIndex, 32) * 2.1,
      h: 3.5 + rnd(cityIndex, 33) * 8.5,
      d: 1.6 + rnd(cityIndex, 34) * 2.2
    });
    buildings.setColorAt(cityIndex, new THREE.Color(cityIndex % 7 === 0 ? 2564164 : 1512741));
    for (cw = 0; cw < WINDOWS_PER_BUILDING; cw++) windows.setColorAt(cityIndex * WINDOWS_PER_BUILDING + cw, new THREE.Color((cityIndex + cw) % 9 === 0 ? ORANGE : (cityIndex + cw) % 3 === 0 ? LILAC : CYAN));
  }
  var side;
  var cw;
  var cityIndex;
  if (buildings.instanceColor) buildings.instanceColor.needsUpdate = true;
  if (windows.instanceColor) windows.instanceColor.needsUpdate = true;
  var cityGround = mesh(new THREE.PlaneGeometry(42, 130), standard(592145, 592145, 0.05, 0.32, 0.7), city);
  cityGround.rotation.x = -Math.PI / 2;
  cityGround.position.set(0, -0.04, -45);
  cityGround.receiveShadow = true;
  var cityGrid = new THREE.GridHelper(110, 55, VIOLET, 1581624);
  cityGrid.position.set(0, 0, -35);
  cityGrid.material.transparent = true;
  cityGrid.material.opacity = 0.22;
  city.add(cityGrid);
  var road = new THREE.Group();
  world.add(road);
  road.visible = false;
  var roadSurface = mesh(new THREE.PlaneGeometry(14, 180), standard(3159617, 329483, 0.02, 0.3, 0.58), road);
  roadSurface.material.map = makeAsphaltTexture();
  roadSurface.material.needsUpdate = true;
  roadSurface.rotation.x = -Math.PI / 2;
  roadSurface.position.set(0, 2e-3, -62);
  roadSurface.receiveShadow = true;
  var ROAD_DASHES = 40;
  var roadDashes = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), standard(12371404, 12109268, 0.04, 0.48, 0.08), ROAD_DASHES);
  roadDashes.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  road.add(roadDashes);
  var ROAD_POSTS = 24;
  var roadPosts = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), standard(3422531, 0, 0, 0.34, 0.78), ROAD_POSTS);
  var roadLamps = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), glow(16757610, 0.9), ROAD_POSTS);
  var roadPools = new THREE.InstancedMesh(new THREE.PlaneGeometry(4.5, 8), softGlow(16751180, 0.22), ROAD_POSTS);
  roadPosts.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  roadLamps.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  roadPools.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  road.add(roadPosts);
  road.add(roadLamps);
  road.add(roadPools);
  var railMat = standard(5857645, 0, 0, 0.28, 0.86);
  for (roadSide = -1; roadSide <= 1; roadSide += 2) {
    rail = mesh(new THREE.BoxGeometry(0.13, 0.16, 180), railMat, road);
    rail.position.set(roadSide * 7.15, 0.62, -62);
    edge = mesh(new THREE.BoxGeometry(0.09, 0.018, 180), standard(13226712, 9149612, 0.06, 0.4, 0.1), road);
    edge.position.set(roadSide * 6.55, 0.018, -62);
  }
  var rail;
  var edge;
  var roadSide;
  var carShadowMaterial = new THREE.MeshBasicMaterial({ color: 0, map: radialTexture, transparent: true, opacity: 0.55, depthWrite: false });
  var carContactShadow = mesh(new THREE.PlaneGeometry(6.2, 7.2), carShadowMaterial, road);
  carContactShadow.rotation.x = -Math.PI / 2;
  var tailReflection = mesh(new THREE.PlaneGeometry(2.4, 7.5), softGlow(16717832, 0.32), road);
  tailReflection.rotation.x = -Math.PI / 2;
  tailReflection.position.set(0, 0.026, 4);
  tailReflection.visible = false;
  var headlightReflection = mesh(new THREE.PlaneGeometry(3.6, 10), softGlow(12573951, 0.16), road);
  headlightReflection.visible = false;
  headlightReflection.rotation.x = -Math.PI / 2;
  headlightReflection.position.set(0, 0.024, -5.2);
  function updateRoad(frame) {
    for (var i = 0; i < ROAD_DASHES; i++) {
      var lane = i % 2 ? 1 : -1, index = Math.floor(i / 2);
      var z = (index * 9 + frame * 0.48 + 140) % 180 - 140;
      setMatrix(roadDashes, i, lane * 2.45, 0.025, z, 0.11, 0.025, 3.4, 0, 0, 0);
    }
    roadDashes.instanceMatrix.needsUpdate = true;
    for (var p = 0; p < ROAD_POSTS; p++) {
      var side = p % 2 ? 1 : -1, row = Math.floor(p / 2);
      var pz = (row * 15 + frame * 0.48 + 140) % 180 - 140;
      setMatrix(roadPosts, p, side * 7.65, 2.85, pz, 0.11, 5.7, 0.11, 0, 0, 0);
      setMatrix(roadLamps, p, side * 7.15, 5.65, pz, 1.1, 0.09, 0.24, 0, 0, 0);
      setMatrix(roadPools, p, side * 5.3, 0.022, pz, 1, 1, 1, -Math.PI / 2, 0, 0);
    }
    roadPosts.instanceMatrix.needsUpdate = true;
    roadLamps.instanceMatrix.needsUpdate = true;
    roadPools.instanceMatrix.needsUpdate = true;
    carContactShadow.position.set(knotGroup.position.x, 0.018, knotGroup.position.z + 0.2);
    carContactShadow.rotation.z = carRig.rotation.y * 0.5;
    tailReflection.position.x = knotGroup.position.x;
    tailReflection.rotation.z = 0;
    headlightReflection.position.x = knotGroup.position.x;
  }
  var moon = mesh(new THREE.SphereGeometry(3.3, 32, 20), new THREE.MeshBasicMaterial({ color: 14473471 }), city);
  moon.position.set(-12, 12, -48);
  var moonGlow = mesh(new THREE.SphereGeometry(4.4, 24, 16), glow(VIOLET, 0.12), city);
  moonGlow.position.copy(moon.position);
  var GATE_COUNT = 6;
  var gates = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), standard(ORANGE, ORANGE, 0.35, 0.42, 0.35), GATE_COUNT * 3);
  gates.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  city.add(gates);
  var SPEED_COUNT = 96;
  var speedLines = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), glow(CYAN, 0.35), SPEED_COUNT);
  speedLines.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  city.add(speedLines);
  function updateCity(frame, growth, running, towerScale) {
    var towerAmount = towerScale === void 0 ? 1 : Math.max(0.04, towerScale);
    gates.visible = running;
    speedLines.visible = running;
    var travel = frame * (running ? 0.16 : 0.025);
    for (var i = 0; i < CITY_COUNT; i++) {
      var b = cityData[i], g = clamp(growth * 1.55 - i / CITY_COUNT * 0.55, 0.02, 1) * towerAmount;
      var z = ((b.z + travel + 70) % 90 + 90) % 90 - 70;
      setMatrix(buildings, i, b.x, b.h * g / 2, z, b.w, b.h * g, b.d, 0, 0, 0);
      for (var w = 0; w < WINDOWS_PER_BUILDING; w++) {
        var wy = 0.65 + (w + 1) * (b.h - 1.3) / (WINDOWS_PER_BUILDING + 1) * g;
        setMatrix(windows, i * WINDOWS_PER_BUILDING + w, b.x, wy, z + b.d / 2 + 0.03, b.w * (w % 2 ? 0.55 : 0.72), 0.075, 1, 0, 0, 0);
      }
    }
    buildings.instanceMatrix.needsUpdate = true;
    windows.instanceMatrix.needsUpdate = true;
    var gateSpan = running ? 9 : 6.2;
    var gateHeight = running ? 7.5 : 4.2;
    for (var gi = 0; gi < GATE_COUNT; gi++) {
      var gz = ((-(gi * 15 + 7) + travel + 70) % 90 + 90) % 90 - 70;
      setMatrix(gates, gi * 3, -gateSpan, gateHeight / 2, gz, 0.22, gateHeight, 0.25, 0, 0, 0);
      setMatrix(gates, gi * 3 + 1, gateSpan, gateHeight / 2, gz, 0.22, gateHeight, 0.25, 0, 0, 0);
      setMatrix(gates, gi * 3 + 2, 0, gateHeight - 0.05, gz, gateSpan * 2 + 1, 0.24, 0.32, 0, 0, 0);
    }
    gates.instanceMatrix.needsUpdate = true;
    for (var si2 = 0; si2 < SPEED_COUNT; si2++) {
      var sx = (rnd(si2, 40) - 0.5) * 24, sy = 0.4 + rnd(si2, 41) * 8;
      var sz = ((-55 + rnd(si2, 42) * 75 + frame * (running ? 0.65 : 0.12) + 70) % 90 + 90) % 90 - 70;
      setMatrix(speedLines, si2, sx, sy, sz, 0.018, 0.018, 0.6 + rnd(si2, 43) * 2.8, 0, 0, 0);
    }
    speedLines.instanceMatrix.needsUpdate = true;
  }
  var flight = new THREE.Group();
  world.add(flight);
  flight.visible = false;
  var FLIGHT_SEGMENTS = 22;
  var flightFrames = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), standard(1514534, 0, 0, 0.3, 0.72), FLIGHT_SEGMENTS * 3);
  var flightStrips = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), glow(WHITE, 0.52), FLIGHT_SEGMENTS * 3);
  flightFrames.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  flightStrips.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  flight.add(flightFrames);
  flight.add(flightStrips);
  for (fc = 0; fc < FLIGHT_SEGMENTS; fc++) {
    flightColor = new THREE.Color(fc % 6 === 0 ? 16751202 : 9418751);
    flightStrips.setColorAt(fc * 3, flightColor);
    flightStrips.setColorAt(fc * 3 + 1, flightColor);
    flightStrips.setColorAt(fc * 3 + 2, flightColor);
  }
  var flightColor;
  var fc;
  if (flightStrips.instanceColor) flightStrips.instanceColor.needsUpdate = true;
  var flightFloor = mesh(new THREE.PlaneGeometry(15, 180), standard(856603, 329485, 0.03, 0.2, 0.76), flight);
  flightFloor.rotation.x = -Math.PI / 2;
  flightFloor.position.set(0, -0.02, -65);
  flightFloor.receiveShadow = true;
  flightFloor.material.map = roadSurface.material.map;
  flightFloor.material.roughness = 0.28;
  flightFloor.material.needsUpdate = true;
  var flightLaneLights = new THREE.InstancedMesh(new THREE.PlaneGeometry(1, 1), glow(12901631, 0.18), FLIGHT_SEGMENTS * 2);
  flightLaneLights.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  flight.add(flightLaneLights);
  flightLaneLights.visible = false;
  var flightContact = mesh(new THREE.PlaneGeometry(5.4, 7.4), softGlow(9418751, 0.1), flight);
  flightContact.rotation.x = -Math.PI / 2;
  flightContact.visible = false;
  var flightShadow = mesh(new THREE.PlaneGeometry(6.2, 7.2), carShadowMaterial, flight);
  flightShadow.rotation.x = -Math.PI / 2;
  var flightTailReflection = mesh(new THREE.PlaneGeometry(2.4, 5.8), softGlow(16726056, 0.2), flight);
  flightTailReflection.rotation.x = -Math.PI / 2;
  flightTailReflection.visible = false;
  var flightVanishingLight = mesh(new THREE.PlaneGeometry(11, 5.5), softGlow(7380479, 0.52), flight);
  flightVanishingLight.position.set(0, 3, -132);
  flightVanishingLight.material.fog = false;
  function updateFlight(frame, progress, pulse) {
    updateCarDrive(frame, progress, pulse);
    for (var i = 0; i < FLIGHT_SEGMENTS; i++) {
      var z = (-i * 7 + frame * 0.23 + 140) % 154 - 140;
      setMatrix(flightFrames, i * 3, -6.4, 3.1, z, 0.42, 6.2, 0.65, 0, 0, 0);
      setMatrix(flightFrames, i * 3 + 1, 6.4, 3.1, z, 0.42, 6.2, 0.65, 0, 0, 0);
      setMatrix(flightFrames, i * 3 + 2, 0, 6.1, z, 13.2, 0.36, 0.65, 0, 0, 0);
      setMatrix(flightStrips, i * 3, -6.13, 3.15, z + 0.04, 0.07, 5.1, 0.1, 0, 0, 0);
      setMatrix(flightStrips, i * 3 + 1, 6.13, 3.15, z + 0.04, 0.07, 5.1, 0.1, 0, 0, 0);
      setMatrix(flightStrips, i * 3 + 2, 0, 5.88, z + 0.04, 10.8, 0.07, 0.1, 0, 0, 0);
      setMatrix(flightLaneLights, i * 2, -1.8, 0.025, z, 0.035, 2.8, 1, -Math.PI / 2, 0, 0);
      setMatrix(flightLaneLights, i * 2 + 1, 1.8, 0.025, z, 0.035, 2.8, 1, -Math.PI / 2, 0, 0);
    }
    flightFrames.instanceMatrix.needsUpdate = true;
    flightStrips.instanceMatrix.needsUpdate = true;
    flightLaneLights.instanceMatrix.needsUpdate = true;
    flightStrips.material.opacity = 0.66 + pulse * 0.14;
    flightContact.position.set(knotGroup.position.x, 0.028, knotGroup.position.z);
    flightShadow.position.set(knotGroup.position.x, 0.024, knotGroup.position.z + 0.2);
    flightTailReflection.position.set(knotGroup.position.x, 0.032, knotGroup.position.z + 3);
    shotCamera(knotGroup.position.x + 3.5 + Math.sin(frame * 9e-3) * 0.3, 1.18 + Math.sin(frame * 6e-3) * 0.08, knotGroup.position.z + 7.1 - progress * 0.5, knotGroup.position.x, 0.68, knotGroup.position.z - 1.6, 54);
  }
  var studioText = null;
  var studioAssetState = "loading";
  function typefaceShapes(text, data, size) {
    var scale = size / data.resolution, paths = [], offsetX = 0, offsetY = 0;
    var lineHeight = (data.boundingBox.yMax - data.boundingBox.yMin + data.underlineThickness) * scale;
    for (var i = 0; i < text.length; i++) {
      var character = text[i];
      if (character === "\n") {
        offsetX = 0;
        offsetY -= lineHeight;
        continue;
      }
      var glyph = data.glyphs[character] || data.glyphs["?"];
      if (!glyph) continue;
      var path = new THREE.ShapePath();
      if (glyph.o) {
        var outline = glyph.o.split(" ");
        for (var j = 0; j < outline.length; ) {
          var action = outline[j++];
          if (action === "m") {
            path.moveTo(outline[j++] * scale + offsetX, outline[j++] * scale + offsetY);
          } else if (action === "l") {
            path.lineTo(outline[j++] * scale + offsetX, outline[j++] * scale + offsetY);
          } else if (action === "q") {
            var qx = outline[j++] * scale + offsetX, qy = outline[j++] * scale + offsetY;
            var qcx = outline[j++] * scale + offsetX, qcy = outline[j++] * scale + offsetY;
            path.quadraticCurveTo(qcx, qcy, qx, qy);
          } else if (action === "b") {
            var bx = outline[j++] * scale + offsetX, by = outline[j++] * scale + offsetY;
            var bc1x = outline[j++] * scale + offsetX, bc1y = outline[j++] * scale + offsetY;
            var bc2x = outline[j++] * scale + offsetX, bc2y = outline[j++] * scale + offsetY;
            path.bezierCurveTo(bc1x, bc1y, bc2x, bc2y, bx, by);
          }
        }
      }
      offsetX += glyph.ha * scale;
      paths.push(path);
    }
    var shapes = [];
    for (var p = 0; p < paths.length; p++) shapes = shapes.concat(paths[p].toShapes());
    return shapes;
  }
  jsr.three.loadAsset("three/helvetiker_bold.typeface.json").then(function(record) {
    var data = JSON.parse(new TextDecoder().decode(record.bytes));
    studioText = new THREE.Group();
    studioRig.add(studioText);
    var brandWhite = standard(16316415, 11062015, 0.12, 0.22, 0.42);
    var brandBlue = standard(1472511, 483300, 0.32, 0.3, 0.22);
    function word(text, size, material, x, y, z, depth) {
      var geometry = new THREE.ExtrudeGeometry(typefaceShapes(text, data, size), {
        depth: depth || 0.12,
        curveSegments: 8,
        bevelEnabled: true,
        bevelThickness: 0.035,
        bevelSize: 0.018,
        bevelSegments: 3
      });
      geometry.center();
      var item = mesh(geometry, material, studioText);
      item.position.set(x, y, z);
      item.castShadow = true;
      item.receiveShadow = true;
      return item;
    }
    function gradientGeometry(geometry) {
      geometry.computeBoundingBox();
      var box = geometry.boundingBox, positions = geometry.attributes.position;
      var colors = [], left = new THREE.Color(8141549), middle = new THREE.Color(5195493), right = new THREE.Color(1472511);
      for (var i = 0; i < positions.count; i++) {
        var t = clamp((positions.getX(i) - box.min.x) / Math.max(1e-3, box.max.x - box.min.x), 0, 1);
        var color = t < 0.55 ? left.clone().lerp(middle, t / 0.55) : middle.clone().lerp(right, (t - 0.55) / 0.45);
        colors.push(color.r, color.g, color.b);
      }
      geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
      return geometry;
    }
    var bubbleMaterial = new THREE.MeshStandardMaterial({
      color: 16777215,
      vertexColors: true,
      emissive: 1443903,
      emissiveIntensity: 0.16,
      roughness: 0.3,
      metalness: 0.28
    });
    var ring = mesh(new THREE.TorusGeometry(2, 0.17, 20, 128, Math.PI * 1.64), brandWhite, studioText);
    ring.position.set(-1.75, 0.12, -0.18);
    ring.castShadow = true;
    var bubbleGeometry = gradientGeometry(new THREE.ExtrudeGeometry(roundedRectShape(3.05, 1.86, 0.44), {
      depth: 0.3,
      curveSegments: 20,
      bevelEnabled: true,
      bevelThickness: 0.075,
      bevelSize: 0.065,
      bevelSegments: 5
    }));
    var bubble2 = mesh(bubbleGeometry, bubbleMaterial, studioText);
    bubble2.position.set(-0.85, 0.1, 0.28);
    bubble2.castShadow = true;
    var tailShape = new THREE.Shape();
    tailShape.moveTo(-0.05, -0.78);
    tailShape.lineTo(0.45, -1.38);
    tailShape.lineTo(0.9, -0.72);
    tailShape.closePath();
    var tail = mesh(gradientGeometry(new THREE.ExtrudeGeometry(tailShape, {
      depth: 0.28,
      bevelEnabled: true,
      bevelThickness: 0.045,
      bevelSize: 0.035,
      bevelSegments: 3
    })), bubbleMaterial, studioText);
    tail.position.set(-0.85, 0.1, 0.3);
    tail.castShadow = true;
    word("Yo", 0.98, brandWhite, -1.2, 0.12, 0.76, 0.07);
    for (var dot = 0; dot < 2; dot++) {
      var dotMesh = mesh(new THREE.ExtrudeGeometry(roundedRectShape(0.23, 0.23, 0.055), {
        depth: 0.07,
        bevelEnabled: true,
        bevelThickness: 0.025,
        bevelSize: 0.018,
        bevelSegments: 3
      }), brandWhite, studioText);
      dotMesh.position.set(0.22, 0.4 - dot * 0.55, 0.76);
    }
    word("lip", 1.7, brandWhite, 2.15, -0.02, 0.12, 0.2);
    word(".studio", 0.36, brandBlue, 2.35, -1.12, 0.9, 0.09);
    var studioShadow = mesh(new THREE.PlaneGeometry(10, 4.2), new THREE.MeshBasicMaterial({ color: 0, map: radialTexture, transparent: true, opacity: 0.48, depthWrite: false }), studioRig);
    studioShadow.rotation.x = -Math.PI / 2;
    studioShadow.position.set(0, -2.02, 0);
    var studioReflection = mesh(new THREE.PlaneGeometry(9, 4.8), softGlow(6514417, 0.06), studioRig);
    studioReflection.rotation.x = -Math.PI / 2;
    studioReflection.position.set(0, -2, 0);
    var studioKey = new THREE.PointLight(15068671, 95, 28, 2);
    studioKey.position.set(0, 3.2, 5);
    studioRig.add(studioKey);
    var studioRim = new THREE.PointLight(9133302, 65, 22, 2);
    studioRim.position.set(-4, 1.5, 1.5);
    studioRig.add(studioRim);
    studioRig.position.set(0, 1.2, -2.2);
    studioAssetState = "ready";
    renderLatestFrame();
  }).catch(function(error2) {
    studioAssetState = "error";
    console.error("Studio wordmark: " + error2);
  });
  var dj = new THREE.Group();
  world.add(dj);
  var djBooth = mesh(new THREE.BoxGeometry(5.8, 1.35, 1.7), standard(1380896, VIOLET, 0.25, 0.3, 0.55), dj);
  djBooth.position.set(0, -1.05, 0.6);
  var boothRail = mesh(new THREE.BoxGeometry(6.1, 0.1, 1.85), glow(CYAN, 0.65), dj);
  boothRail.position.set(0, -0.35, 0.6);
  var djDecks = [];
  for (d = 0; d < 2; d++) {
    deck = new THREE.Group();
    dj.add(deck);
    deck.position.set(d ? 1.65 : -1.65, -0.25, 0.65);
    platter = mesh(new THREE.CylinderGeometry(0.92, 0.92, 0.15, 32), standard(526349, VIOLET, 0.2, 0.3, 0.6), deck);
    vinylRing = mesh(new THREE.TorusGeometry(0.64, 0.045, 8, 48), glow(d ? ORANGE : CYAN, 0.72), deck);
    vinylRing.rotation.x = Math.PI / 2;
    vinylRing.position.y = 0.1;
    spindle = mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.22, 16), glow(WHITE, 0.8), deck);
    spindle.position.y = 0.12;
    djDecks.push(deck);
  }
  var deck;
  var platter;
  var vinylRing;
  var spindle;
  var d;
  var EQ_COUNT = 36;
  var djEqualizer = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), glow(VIOLET, 0.65), EQ_COUNT);
  djEqualizer.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  dj.add(djEqualizer);
  for (eq = 0; eq < EQ_COUNT; eq++) djEqualizer.setColorAt(eq, new THREE.Color(eq % 5 === 0 ? ORANGE : eq % 2 ? CYAN : VIOLET));
  var eq;
  if (djEqualizer.instanceColor) djEqualizer.instanceColor.needsUpdate = true;
  var headphones = new THREE.Group();
  bot.add(headphones);
  var headband = mesh(new THREE.TorusGeometry(1.02, 0.1, 8, 32, Math.PI), glow(ORANGE, 0.75), headphones);
  headband.position.set(0, 0.25, 0.12);
  for (hp = 0; hp < 2; hp++) {
    cup = mesh(new THREE.BoxGeometry(0.34, 0.68, 0.38), standard(ORANGE, ORANGE, 0.3, 0.35, 0.45), headphones);
    cup.position.set(hp ? 1.14 : -1.14, 0.1, 0.12);
  }
  var cup;
  var hp;
  function updateDJ(frame, pulse) {
    dj.position.set(0, 0.2, -1.5);
    dj.rotation.y = Math.sin(frame * 9e-3) * 0.08;
    for (var i = 0; i < djDecks.length; i++) djDecks[i].rotation.y = frame * (i ? -0.19 : 0.23);
    for (var b = 0; b < EQ_COUNT; b++) {
      var wave = 0.3 + Math.abs(Math.sin(frame * 0.12 + b * 0.63)) * (0.5 + pulse * 2.4) + rnd(b, 101) * 0.35;
      var x = (b - (EQ_COUNT - 1) / 2) * 0.24;
      setMatrix(djEqualizer, b, x, -1.45 + wave / 2, -1.6, 0.12, wave, 0.12, 0, 0, 0);
    }
    djEqualizer.instanceMatrix.needsUpdate = true;
    bot.position.set(Math.sin(frame * 0.04) * 0.12, 1.05 + Math.abs(Math.sin(frame * 0.16)) * 0.18, -1.35);
    bot.scale.setScalar(0.78);
    headphones.visible = true;
  }
  var showcase = new THREE.Group();
  world.add(showcase);
  showcase.visible = false;
  var showcaseFloor = mesh(new THREE.CylinderGeometry(6.1, 6.45, 0.32, 72), standard(1119014, VIOLET, 0.09, 0.24, 0.78), showcase);
  showcaseFloor.position.y = -0.18;
  showcaseFloor.receiveShadow = true;
  for (sr = 0; sr < 3; sr++) {
    stageRing = mesh(new THREE.TorusGeometry(4.4 + sr * 0.65, 0.035 + sr * 8e-3, 10, 128), glow(sr === 1 ? ORANGE : sr === 2 ? VIOLET : CYAN, 0.72), showcase);
    stageRing.rotation.x = Math.PI / 2;
    stageRing.position.y = 0.015 + sr * 0.012;
  }
  var stageRing;
  var sr;
  var danceRig = new THREE.Group();
  showcase.add(danceRig);
  danceRig.position.set(-1.65, 0.06, 0.35);
  danceRig.scale.setScalar(1.25);
  var danceMixer = null;
  var danceFace = null;
  var danceAssetState = "loading";
  var danceActions = {};
  new THREE.GLTFLoader().load("three/RobotExpressive.glb", function(gltf) {
    var model = gltf.scene;
    model.traverse(function(node) {
      if (node.isMesh) {
        node.castShadow = true;
        node.receiveShadow = true;
        if (node.material && node.material.roughness !== void 0) node.material.roughness = Math.max(0.28, node.material.roughness);
      }
    });
    danceRig.add(model);
    danceMixer = new THREE.AnimationMixer(model);
    ["Dance", "Jump", "Wave", "Yes", "ThumbsUp"].forEach(function(name) {
      var clip = gltf.animations.find(function(item) {
        return item.name === name;
      });
      if (!clip) return;
      var action = danceMixer.clipAction(clip);
      action.play();
      action.setEffectiveWeight(name === "Dance" ? 1 : 0);
      danceActions[name] = action;
    });
    danceFace = model.getObjectByName("Head_4");
    danceAssetState = "ready";
    renderLatestFrame();
  }, void 0, function(error2) {
    danceAssetState = "error";
    console.error("RobotExpressive: " + error2);
  });
  var legoRig = new THREE.Group();
  showcase.add(legoRig);
  legoRig.position.set(2.55, 2.7, -2.1);
  var legoModel = null;
  var legoNodes = [];
  var legoAssetState = "loading";
  function readJldrFloats(bytes, view, descriptor) {
    var count = descriptor.count * descriptor.itemSize;
    var width = descriptor.encoding === "float32" || descriptor.encoding === "int16" ? descriptor.encoding === "float32" ? 4 : 2 : 1;
    var values = new Float32Array(count);
    for (var i = 0; i < count; i++) {
      var offset = descriptor.offset + i * width;
      if (descriptor.encoding === "int16") {
        var channel = i % descriptor.itemSize;
        values[i] = view.getInt16(offset, true) * descriptor.scale[channel] + descriptor.center[channel];
      } else if (descriptor.encoding === "int8") values[i] = view.getInt8(offset) / 127;
      else if (descriptor.encoding === "uint8") values[i] = view.getUint8(offset) / 255;
      else values[i] = view.getFloat32(offset, true);
    }
    return values;
  }
  function parseJldrModel(bytes) {
    var view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    if (bytes.length < 12 || view.getUint32(0, true) !== 1380207690) throw new Error("invalid JLDR magic");
    var headerLength = view.getUint32(4, true);
    var data = JSON.parse(new TextDecoder().decode(bytes.subarray(8, 8 + headerLength)));
    if (data.magic !== "JLDR" || data.version !== 2) throw new Error("unsupported JLDR version");
    var materials = data.materials.map(function(source) {
      var material = source.kind === "standard" ? new THREE.MeshStandardMaterial() : new THREE.MeshBasicMaterial();
      material.name = source.name;
      material.color.setHex(source.color);
      if (material.isMeshStandardMaterial) {
        material.roughness = source.roughness;
        material.metalness = source.metalness;
      }
      material.opacity = source.opacity;
      material.transparent = source.transparent;
      material.depthWrite = source.depthWrite;
      material.side = source.side;
      material.vertexColors = source.vertexColors;
      material.polygonOffset = source.polygonOffset;
      material.polygonOffsetFactor = source.polygonOffsetFactor;
      material.polygonOffsetUnits = source.polygonOffsetUnits;
      return material;
    });
    var geometries = data.geometries.map(function(source) {
      var geometry = new THREE.BufferGeometry();
      Object.keys(source.attributes).forEach(function(name) {
        if (name === "smoothNormal") return;
        var descriptor = name === "normal" && source.attributes.smoothNormal ? source.attributes.smoothNormal : source.attributes[name];
        geometry.setAttribute(name, new THREE.BufferAttribute(readJldrFloats(bytes, view, descriptor), descriptor.itemSize));
      });
      if (source.index) {
        var indices = new Uint32Array(source.index.count);
        for (var i = 0; i < indices.length; i++) indices[i] = view.getUint32(source.index.offset + i * 4, true);
        geometry.setIndex(new THREE.BufferAttribute(indices, 1));
      }
      for (var g = 0; g < source.groups.length; g++) {
        var group = source.groups[g];
        geometry.addGroup(group.start, group.count, group.materialIndex);
      }
      return geometry;
    });
    var nodes2 = data.nodes.map(function(source) {
      var node = source.kind === "mesh" ? new THREE.Mesh() : source.kind === "line" ? new THREE.LineSegments() : new THREE.Group();
      node.name = source.name;
      node.matrix.fromArray(source.matrix);
      node.matrix.decompose(node.position, node.quaternion, node.scale);
      if (source.buildingStep !== void 0) node.userData.buildingStep = source.buildingStep;
      if (source.geometry >= 0) node.geometry = geometries[source.geometry];
      if (source.materials.length === 1) node.material = materials[source.materials[0]];
      else if (source.materials.length) node.material = source.materials.map(function(index) {
        return materials[index];
      });
      return node;
    });
    data.nodes.forEach(function(source, index) {
      if (source.parent >= 0) nodes2[source.parent].add(nodes2[index]);
    });
    nodes2[0].userData.numBuildingSteps = data.numBuildingSteps;
    return nodes2[0];
  }
  jsr.three.loadAsset("three/ldraw/30051-1-X-wingFighter-Mini.mpd_Packed.mpd.bin").then(function(record) {
    var model = parseJldrModel(record.bytes);
    model.rotation.x = Math.PI;
    var bounds = new THREE.Box3().setFromObject(model);
    var center = bounds.getCenter(new THREE.Vector3());
    var size = bounds.getSize(new THREE.Vector3());
    var scale = 5.6 / Math.max(size.x, size.y, size.z);
    model.scale.setScalar(scale);
    model.position.set(-center.x * scale, -center.y * scale, -center.z * scale);
    model.traverse(function(node) {
      legoNodes.push(node);
      if (node.isLineSegments) node.visible = false;
      if (node.isMesh) {
        node.castShadow = true;
        node.receiveShadow = true;
      }
    });
    legoRig.add(model);
    legoModel = model;
    legoAssetState = "ready";
    renderLatestFrame();
  }).catch(function(error2) {
    legoAssetState = "error";
    console.error("LDraw X-Wing: " + error2);
  });
  function updateShowcase(frame, progress, pulse) {
    if (latestParams.act >= 14) progress = (latestParams.beat % 2 + (latestParams.beatPhase || 0)) / 2;
    var buildProgress = clamp((progress - 0.16) / 0.66, 0, 1);
    var actionNames = ["Dance", "Jump", "Wave", "Yes", "ThumbsUp"];
    var actionPhase = clamp(progress, 0, 0.99999) * actionNames.length;
    var actionIndex = Math.floor(actionPhase);
    var actionBlend = clamp((actionPhase - actionIndex - 0.72) / 0.28, 0, 1);
    actionBlend = actionBlend * actionBlend * (3 - 2 * actionBlend);
    for (var ai = 0; ai < actionNames.length; ai++) {
      var action = danceActions[actionNames[ai]];
      if (!action) continue;
      var weight = ai === actionIndex ? 1 - actionBlend : ai === (actionIndex + 1) % actionNames.length ? actionBlend : 0;
      action.setEffectiveWeight(weight);
    }
    if (danceMixer) danceMixer.setTime(frame / Math.max(1, FPS));
    danceRig.position.x = -1.65 + Math.sin(progress * TWO_PI) * 0.55;
    danceRig.position.z = 0.35 + Math.sin(progress * TWO_PI * 2) * 0.32;
    danceRig.rotation.y = 0.28 + Math.sin(progress * TWO_PI) * 0.55;
    if (danceFace && danceFace.morphTargetDictionary && danceFace.morphTargetDictionary.Smile !== void 0) {
      danceFace.morphTargetInfluences[danceFace.morphTargetDictionary.Smile] = 0.55 + pulse * 0.35;
    }
    if (legoModel) {
      var steps = Math.max(1, legoModel.userData.numBuildingSteps || 1);
      var step = Math.min(steps - 1, Math.floor(buildProgress * steps));
      for (var i = 0; i < legoNodes.length; i++) {
        var node = legoNodes[i];
        if (node.isLineSegments) node.visible = false;
        else if (node.isGroup && node.userData.buildingStep !== void 0) node.visible = node.userData.buildingStep <= step;
      }
    }
    legoRig.rotation.set(0.08 + Math.sin(frame * 0.013) * 0.06, -0.55 + progress * 0.7, 0.05);
    legoRig.position.x = 2.3 + Math.cos(progress * TWO_PI) * 0.18;
    legoRig.position.y = 2.35 + Math.sin(frame * 0.035) * 0.1;
    legoRig.position.z = -1.8;
    showcase.rotation.y = Math.sin(frame * 6e-3) * 0.05;
  }
  function showcaseShot(progress) {
    if (latestParams.act >= 14) progress = (latestParams.beat % 2 + (latestParams.beatPhase || 0)) / 2;
    if (progress < 0.16) {
      var robotMove = inOut(progress / 0.16);
      shotCamera(0.8 - robotMove * 0.5, 2.45, 9.2 - robotMove * 0.8, danceRig.position.x, 2, 0.2, 45);
    } else if (progress < 0.82) {
      var build = clamp((progress - 0.16) / 0.66, 0, 1);
      var reveal = inOut(build);
      shotCamera(4.6 + reveal * 1.2, 3 + reveal * 0.65, 2.2 + reveal * 4, legoRig.position.x, legoRig.position.y, legoRig.position.z, 42);
    } else {
      var wide = inOut((progress - 0.82) / 0.18);
      shotCamera(4.8 - wide * 1, 3.4, 10.2 + wide * 1.3, 0.3, 1.55, -0.5, 45);
    }
  }
  function shotCamera(x, y, z, tx, ty, tz, fov) {
    cameraTarget.set(tx || 0, ty || 0, tz || 0);
    camera.position.set(x, y, z);
    camera.lookAt(cameraTarget);
    if (camera.fov !== fov) {
      camera.fov = fov;
      camera.updateProjectionMatrix();
    }
  }
  function updateBot(frame, act, beat, pulse, lyric) {
    var blink = frame % 89 < 6 ? 0.1 : 1;
    eyeL.scale.y = blink;
    eyeR.scale.y = blink;
    eyeMat.color.setHex(act === 16 ? ORANGE : CYAN);
    var talking = lyric ? 1 : 0;
    mouth.scale.x = 0.65 + talking * (0.35 + 0.25 * Math.sin(frame * 0.65));
    mouth.scale.y = act === 16 ? 4 : 1;
    eyeL.scale.x = act === 16 ? 1.5 : 1;
    eyeR.scale.x = act === 16 ? 1.5 : 1;
    bot.rotation.x = 0;
    bot.rotation.z = Math.sin(beat * 0.7) * 0.045;
    bot.rotation.y = Math.sin(frame * 0.018) * 0.18;
    armL.rotation.z = -0.82 - Math.sin(beat * 0.9) * 0.42;
    armR.rotation.z = 0.82 + Math.cos(beat * 0.9) * 0.42;
    legL.rotation.z = 0;
    legR.rotation.z = 0;
    antennaTip.scale.setScalar(0.85 + pulse * 0.5);
  }
  function updateCode(frame, act, progress, pulse) {
    for (var i = 0; i < CODE_COUNT; i++) {
      var row = Math.floor(i / 8), col = i % 8;
      var x = (col - 3.5) * 2.25 + (rnd(i, 2) - 0.5) * 0.6;
      var y = (row - 4) * 0.62;
      var z = -3 - rnd(i, 3) * 5;
      if (act === 3) {
        z += (1 - progress) * 10;
        y += Math.sin(frame * 0.035 + i) * 0.15;
      }
      if (act === 12) {
        var gather = 1 - progress * 0.82;
        x *= gather;
        y *= gather;
        z += progress * 4;
      }
      if (act === 14 || act === 15) {
        x += Math.sin(frame * 0.03 + i) * 1.2;
        y += Math.cos(frame * 0.025 + i) * 0.35;
      }
      var w = 0.5 + rnd(i, 5) * 1.55;
      setMatrix(codeMesh, i, x, y, z, w, 0.035 + pulse * 0.018, 1, 0, 0, 0);
    }
    codeMesh.instanceMatrix.needsUpdate = true;
  }
  function updateParticles(frame, act, progress, pulse) {
    var count = act === 7 ? 320 : act === 12 ? 500 : PARTICLE_COUNT;
    particleGeometry.setDrawRange(0, count);
    particles.material.size = act >= 14 ? 0.085 : 0.06;
    particles.material.opacity = act === 12 ? 0.35 : 0.58;
    for (var i = 0; i < count; i++) {
      var angle = rnd(i, 20) * Math.PI * 2 + frame * (3e-3 + rnd(i, 22) * 6e-3);
      var radius = 1.4 + rnd(i, 21) * 7;
      var z = (rnd(i, 23) - 0.5) * 14;
      if (act === 5 || act === 10 || act >= 14) z = -10 + (rnd(i, 23) * 24 + frame * (0.025 + rnd(i, 24) * 0.03)) % 24;
      if (act === 12) {
        var gather = 1 - progress * 0.9;
        radius *= gather;
        z *= gather;
      }
      particlePositions[i * 3] = Math.cos(angle) * radius;
      particlePositions[i * 3 + 1] = Math.sin(angle) * radius * 0.62;
      particlePositions[i * 3 + 2] = z;
    }
    particleGeometry.attributes.position.needsUpdate = true;
  }
  function renderFrame(frame, fps, params) {
    var act = params.act || 0, progress = params.actProgress || 0;
    var beat = params.beat || 0, pulse = params.beatPulse || 0, lyric = params.lyricStyle || "";
    var variant = params.variant || "auto";
    stars.visible = false;
    bot.visible = false;
    codeMesh.visible = false;
    brand.visible = false;
    knotGroup.visible = false;
    particles.visible = false;
    beams.visible = false;
    grid.visible = false;
    city.visible = false;
    driverRig.visible = false;
    nodes.visible = true;
    gates.visible = true;
    road.visible = false;
    flight.visible = false;
    cityGrid.visible = true;
    moon.visible = true;
    moonGlow.visible = true;
    dj.visible = false;
    headphones.visible = false;
    showcase.visible = false;
    studioRig.visible = false;
    shockwaves.visible = false;
    shards.visible = false;
    impactLines.visible = false;
    driftSmoke.visible = false;
    var bg = act === 16 ? 131588 : 328970;
    world.background.setHex(bg);
    world.fog.color.setHex(bg);
    world.fog.density = 0.017;
    stars.material.opacity = 0.32;
    brand.rotation.set(0, 0, 0);
    beams.rotation.set(0, 0, 0);
    carRig.rotation.set(0.08 + Math.sin(frame * 8e-3) * 0.05, frame * 0.012, Math.sin(frame * 0.01) * 0.04);
    carRig.position.y = Math.sin(frame * 0.02) * 0.16;
    violetLight.position.set(Math.cos(frame * 0.01) * 7, 2 + Math.sin(frame * 0.015) * 2, 5);
    violetLight.intensity = 52;
    cyanLight.position.set(Math.cos(frame * 9e-3 + Math.PI) * 7, -1 + Math.sin(frame * 0.012) * 2, 4);
    cyanLight.intensity = 58;
    orangeLight.position.set(0, 3, 5);
    orangeLight.intensity = act >= 14 ? 25 + pulse * 30 : act === 3 ? 8 + pulse * 10 : 0;
    var finalMode = Math.floor(beat / 2) % 8;
    var detailHero = act === 9 && frame / fps >= 108.18 || (act === 14 || act === 15) && variant === "auto" && finalMode === 1;
    var driftHero = (act === 5 || act === 10) && variant === "auto" || (act === 14 || act === 15) && variant === "auto" && finalMode === 0 || act === 17 && frame / fps >= 199.32;
    var carHero = act === 3 || detailHero || driftHero || (act === 14 || act === 15) && variant === "car_drive";
    var flightHero = variant === "flight" && (act === 5 || act === 10 || act === 14 || act === 15);
    carKey.visible = carHero || flightHero;
    carKey.intensity = 34 + pulse * 5;
    key.intensity = 2.1 + pulse * 0.35;
    stars.rotation.y = frame * 5e-4;
    if (act === 0) {
      stars.visible = true;
      stars.material.opacity = 0.12;
      shotCamera(0, 0, 16, 0, 0, 0, 42);
    } else if (act === 1) {
      codeMesh.visible = true;
      bot.visible = true;
      stars.visible = true;
      bot.position.set(3.8, -0.4, -1);
      bot.scale.setScalar(0.75 + progress * 0.3);
      updateBot(frame, act, beat, pulse, lyric);
      updateCode(frame, act, progress, pulse);
      shotCamera(-0.5, 0.5, 15 - progress * 2, 0.8, 0, 0, 42);
    } else if (act === 2) {
      codeMesh.visible = true;
      bot.visible = true;
      stars.visible = true;
      city.visible = true;
      bot.position.set(4.8, 1.55, -1);
      bot.scale.setScalar(1.05);
      updateBot(frame, act, beat, pulse, lyric);
      updateCode(frame, act, progress, pulse);
      updateCity(frame, 0.3 + progress * 0.45, false);
      shotCamera(Math.sin(frame * 8e-3) * 1.1, 0.4, 14.5, 0.7, 0, 0, 43);
    } else if (act === 3) {
      codeMesh.visible = true;
      particles.visible = true;
      stars.visible = true;
      city.visible = true;
      updateCarDrive(frame, progress, pulse);
      updateCode(frame, act, progress, pulse);
      updateParticles(frame, act, progress, pulse);
      updateCity(frame, 1, true, 1);
      carDriveShot(progress);
    } else if (act === 4 || act === 6) {
      shotCamera(0, 0, 16, 0, 0, 0, 42);
    } else if (act === 5) {
      particles.visible = true;
      beams.visible = true;
      stars.visible = true;
      updateParticles(frame, act, progress, pulse);
      if (variant === "flight") {
        flight.visible = true;
        particles.visible = false;
        beams.visible = false;
        stars.visible = false;
        updateFlight(frame, progress, pulse);
      } else if (variant === "dj") {
        dj.visible = true;
        bot.visible = true;
        updateDJ(frame, pulse);
        updateBot(frame, act, beat, pulse, lyric);
        shotCamera(3.8, 3.4, 12.2, 0, 0.2, -1, 43);
      } else if (variant === "car_drive") {
        city.visible = true;
        beams.visible = false;
        updateCarDrive(frame, progress, pulse);
        updateCity(frame, 1, true);
        carDriveShot(progress);
      } else if (variant === "city") {
        city.visible = true;
        updateCity(frame, 1, true);
        shotCamera(0, 3.2, 13.5, 0, 3, -16, 46);
      } else {
        city.visible = true;
        updateCarDrift(frame, progress, pulse);
        updateCity(frame, 1, true, 0.65);
        carDriftShot(progress);
      }
    } else if (act === 7) {
      particles.visible = true;
      stars.visible = true;
      beams.visible = true;
      showcase.visible = true;
      updateParticles(frame, act, progress, pulse);
      updateShowcase(frame, progress, pulse);
      showcaseShot(progress);
    } else if (act === 8) {
      particles.visible = true;
      stars.visible = true;
      beams.visible = true;
      codeMesh.visible = true;
      updateParticles(frame, act, progress, pulse);
      updateCode(frame, act, progress, pulse);
      beams.rotation.z = -0.18 + Math.sin(frame * 8e-3) * 0.12;
      shotCamera(Math.sin(frame * 9e-3) * 2.4, 1.4, 16 - progress * 2.5, 0, 0.4, -2, 44);
    } else if (act === 9) {
      if (detailHero) {
        city.visible = true;
        updateCarDrive(frame, progress, pulse);
        updateCity(frame, 1, true, 0.65);
        carDetailShot(clamp((frame / fps - 108.18) / 2.04, 0, 1));
      } else {
        codeMesh.visible = true;
        particles.visible = true;
        stars.visible = true;
        city.visible = true;
        updateCode(frame, act, progress, pulse);
        updateParticles(frame, act, progress, pulse);
        updateCity(frame, 1, false);
        shotCamera(0, 0.5, 15 - progress * 2, 0, 0, 0, 44);
      }
    } else if (act === 10) {
      particles.visible = true;
      beams.visible = true;
      updateParticles(frame, act, progress, pulse);
      if (variant === "flight") {
        flight.visible = true;
        particles.visible = false;
        beams.visible = false;
        stars.visible = false;
        updateFlight(frame, progress, pulse);
      } else if (variant === "dj") {
        dj.visible = true;
        bot.visible = true;
        updateDJ(frame, pulse);
        updateBot(frame, act, beat, pulse, lyric);
        shotCamera(-3.8, 3.4, 12.2, 0, 0.2, -1, 43);
      } else if (variant === "car_drive") {
        city.visible = true;
        beams.visible = false;
        updateCarDrive(frame, progress, pulse);
        updateCity(frame, 1, true);
        carDriveShot(progress);
      } else if (variant === "city") {
        city.visible = true;
        updateCity(frame, 1, true);
        shotCamera(0, 2.6, 12.5, 0, 3.2, -16, 48);
      } else {
        city.visible = true;
        updateCarDrift(frame, progress, pulse);
        updateCity(frame, 1, true, 0.65);
        carDriftShot(progress);
      }
    } else if (act === 11) {
      bot.visible = true;
      stars.visible = true;
      codeMesh.visible = true;
      city.visible = true;
      bot.position.set(0, -3.1, -1);
      bot.scale.setScalar(0.68);
      updateBot(frame, act, beat, pulse, lyric);
      updateCode(frame, act, progress, pulse);
      updateCity(frame, 1, false);
      shotCamera(0, 0.2, 15.5, 0, -0.8, 0, 42);
    } else if (act === 12) {
      particles.visible = true;
      codeMesh.visible = true;
      stars.visible = true;
      updateParticles(frame, act, progress, pulse);
      updateCode(frame, act, progress, pulse);
      shotCamera(0, 0, 15 - progress * 5, 0, 0, 0, 42);
    } else if (act === 13) {
      particles.visible = true;
      stars.visible = true;
      beams.visible = true;
      updateParticles(frame, act, progress, pulse);
      shotCamera(Math.sin(frame * 0.015) * 2.8, 0.4, 14.5 - progress * 2, 0, 0, -1, 44);
    } else if (act === 14 || act === 15) {
      var mode = Math.floor(beat / 2) % 8;
      if (variant === "car_drive") mode = 3;
      else if (variant === "city") mode = 4;
      else if (variant === "flight") mode = 5;
      else if (variant === "dj") mode = 6;
      else if (variant === "showcase") mode = 7;
      var segmentProgress = (beat % 2 + (params.beatPhase || 0)) / 2;
      brand.visible = false;
      knotGroup.visible = mode === 0 || mode === 1 || mode === 3;
      bot.visible = mode === 2 || mode === 6;
      city.visible = mode === 0 || mode === 1 || mode === 3 || mode === 4;
      flight.visible = mode === 5;
      dj.visible = mode === 6;
      showcase.visible = mode === 7;
      particles.visible = mode !== 5;
      beams.visible = mode > 1 && mode !== 3 && mode !== 5;
      codeMesh.visible = mode === 2 || mode === 4;
      stars.visible = mode !== 5;
      if (mode === 0) updateCarDrift(frame, segmentProgress, pulse);
      else if (mode === 1 || mode === 3) updateCarDrive(frame, segmentProgress, pulse);
      else if (mode !== 5 && mode !== 6) {
        bot.scale.setScalar(1.15 + pulse * 0.035);
        bot.position.set(0, -0.2, -2);
      }
      if (bot.visible) updateBot(frame, act, beat, pulse, lyric);
      if (mode === 5) updateFlight(frame, progress, pulse);
      if (mode === 6) updateDJ(frame, pulse);
      if (mode === 7) updateShowcase(frame, progress, pulse);
      if (codeMesh.visible) updateCode(frame, act, progress, pulse);
      if (city.visible) updateCity(frame, 1, true);
      updateParticles(frame, act, progress, pulse);
      if (mode === 0) carDriftShot(segmentProgress);
      else if (mode === 1) carDetailShot(segmentProgress);
      else if (mode === 3) carDriveShot(progress);
      else if (mode === 4) shotCamera(0, 3, 12.8, 0, 3, -16, 47);
      else if (mode === 6) shotCamera(3.8, 3.4, 12.2, 0, 0.2, -1, 43);
      else if (mode === 7) showcaseShot(progress);
      else shotCamera(Math.sin(frame * 0.018) * 3.5, 0.8 + Math.sin(frame * 0.012), 13.8, 0, 0, -1, 45);
    } else if (act === 16) {
      bot.visible = true;
      bot.position.set(0, -2.5, -2);
      bot.scale.setScalar(0.72);
      updateBot(frame, act, beat, 0, lyric);
      shotCamera(0, 0, 14, 0, -0.7, 0, 42);
    } else {
      if (driftHero) {
        var outroDrift = clamp((frame / fps - 199.32) / 0.68, 0, 1);
        city.visible = false;
        updateCarDrift(frame, outroDrift, pulse);
        carDriftShot(outroDrift);
      } else {
        brand.visible = true;
        particles.visible = true;
        beams.visible = true;
        stars.visible = true;
        brand.scale.setScalar(0.9 + pulse * 0.025);
        brand.position.set(0, 0.8, -2.5);
        brand.rotation.set(0, Math.sin(frame * 0.01) * 0.25, 0);
        updateParticles(frame, act, progress, pulse);
        shotCamera(0, 0.2, 15 - progress * 3.5, 0, 0.2, 0, 43);
      }
    }
    if (brand.visible) updateBrand(frame, pulse);
    if (carHero) {
      world.background.setHex(198157);
      world.fog.color.setHex(198157);
      world.fog.density = 0.011;
      road.visible = true;
      cityGrid.visible = false;
      moon.visible = false;
      moonGlow.visible = false;
      particles.visible = false;
      codeMesh.visible = false;
      speedLines.visible = false;
      gates.visible = false;
      beams.visible = false;
      nodes.visible = false;
      carKey.position.set(camera.position.x * 0.65, 4.4, camera.position.z * 0.65);
      carKey.intensity = 48 + pulse * 5;
      violetLight.intensity = 6;
      cyanLight.intensity = 6;
      orangeLight.position.set(0, 5.4, 7 - frame * 0.48 % 18);
      orangeLight.intensity = 10 + pulse * 2;
    }
    if (flightHero) {
      world.background.setHex(198417);
      world.fog.color.setHex(198417);
      world.fog.density = 8e-3;
      carKey.position.set(0, 4.5, 7);
      carKey.intensity = 48 + pulse * 5;
      violetLight.intensity = 7;
      cyanLight.intensity = 8;
      orangeLight.intensity = 0;
    }
    var energyAct = !carHero && !flightHero && (act === 5 || act === 7 || act === 10 || act === 14 || act === 15 || act === 17);
    if (energyAct) {
      var energy = act >= 14 && act <= 15 ? 1.25 : 0.8;
      shockwaves.visible = true;
      shards.visible = true;
      impactLines.visible = true;
      shockwaves.position.set(0, 0, 0);
      updateEnergyEffects(frame, params.beatPhase || 0, pulse, energy);
    }
    var wordProgress = params.wordProgress || 0;
    var focusPush = params.focusPush || 0;
    if (focusPush > 0) camera.position.lerp(cameraTarget, focusPush * 0.08);
    var hasWord = (params.wordIndex === void 0 ? -1 : params.wordIndex) >= 0;
    camera.zoom = 1 + focusPush * 0.12 + (hasWord ? Math.exp(-wordProgress * 5) * 0.035 : 0) + pulse * 8e-3 + (act === 12 ? progress * 0.08 : 0);
    camera.updateProjectionMatrix();
    camera.rotation.z += Math.sin(frame * 0.025) * (act >= 14 && act <= 15 ? 6e-3 : 25e-4);
    renderer.toneMappingExposure = 1 + pulse * 0.035;
    if (USE_FXAA) fxaaComposer.render(0);
    else renderer.render(world, camera);
  }
  function handleEvent(action, payload) {
    if (action !== "yoclip.frame") return;
    payload = payload || {};
    var nextW = Math.max(1, Math.round(payload.width || W)), nextH = Math.max(1, Math.round(payload.height || H));
    if (nextW !== W || nextH !== H) {
      W = nextW;
      H = nextH;
      renderer.setSize(W, H, false);
      camera.aspect = W / H;
      camera.updateProjectionMatrix();
    }
    FPS = payload.fps || FPS;
    var frame = Math.max(0, Math.round(payload.frame || 0));
    latestFrame = frame;
    latestFps = FPS;
    latestParams = payload.params || {};
    renderFrame(frame, FPS, latestParams);
    jsr.render({ type: "three", canvasId: "main", width: W, height: H, pixelRatio: RENDER_SCALE });
    jsr.exportState({ renderer: "THREE r186", backend: "Flutter GPU", frame, act: latestParams.act || 0, particles: PARTICLE_COUNT, carAsset: carAssetState, driverAsset: driverAssetState });
  }
  jsr.onEvent(handleEvent);
  worldReady = true;
  renderLatestFrame();
  console.log("WRITE THE LIGHT \u2014 THREE world ready / deterministic master frames");
})();
