import type { CourseSpec } from "../types";

const VALEM = "Valem Tutorials";
const UNITY_VR = { label: "Unity Learn: VR Development pathway", url: "https://learn.unity.com/pathway/vr-development" };
const XRI = { label: "XR Interaction Toolkit manual", url: "https://docs.unity3d.com/Packages/com.unity.xr.interaction.toolkit@3.0/manual/index.html" };
const META = { label: "Meta Horizon docs for Unity", url: "https://developers.meta.com/horizon/documentation/unity/" };

export const unityVr: CourseSpec = {
  slug: "unity-vr",
  title: "Unity VR Game Development",
  short: "Unity VR",
  priority: 2,
  unitLabel: "lessons",
  tagline: "Second priority: build and ship VR games for Meta Quest with Unity.",
  description:
    "Unity and C# basics, OpenXR and Quest setup, interaction, locomotion, VR UI and audio, the performance budget, game systems, multiplayer and store publishing, then three small projects.",
  bestVideo: [
    { label: "Valem Tutorials (VR in Unity, step by step)", url: "https://www.youtube.com/@ValemTutorials" },
    { label: "Justin P Barnett (XR toolkit, Quest)", url: "https://www.youtube.com/@JustinPBarnett" },
    { label: "Brackeys (Unity and C# basics)", url: "https://www.youtube.com/@Brackeys" },
  ],
  bestRead: [UNITY_VR, XRI, META],
  chapters: [
    {
      title: "Unity foundations",
      group: "Basics",
      blurb: "Editor, GameObjects, C# scripting and the physics you'll use everywhere.",
      vq: "Brackeys Unity",
      read: [{ label: "Unity Learn: Unity Essentials", url: "https://learn.unity.com/pathway/unity-essentials" }, { label: "Unity Manual", url: "https://docs.unity3d.com/Manual/index.html" }],
      lessons: [
        "Editor, GameObjects and components",
        "C# scripting and the MonoBehaviour lifecycle",
        "Prefabs and scenes",
        "Physics, rigidbodies and colliders",
        "The Input System",
        "URP setup",
      ],
    },
    {
      title: "XR setup",
      group: "Basics",
      blurb: "Get a scene running on a Quest, and test without putting the headset on.",
      vq: VALEM,
      read: [UNITY_VR, META],
      lessons: [
        "XR Plugin Management and OpenXR",
        "Meta Quest setup and Android builds",
        "Meta XR SDK vs XR Interaction Toolkit",
        "XR Device Simulator",
        "Quest Link and Air Link testing",
      ],
    },
    {
      title: "Interaction",
      group: "Core VR",
      blurb: "Grab, point, place and feel: the verbs every VR game needs.",
      vq: VALEM,
      read: [XRI],
      lessons: [
        "XR Origin and tracked controllers",
        "Grab interactables",
        "Ray and direct interactors",
        "Socket interactors",
        ["Hand tracking", { read: { label: "Meta: hand tracking in Unity", url: "https://developers.meta.com/horizon/documentation/unity/unity-handtracking-overview/" } }],
        "Haptics",
      ],
    },
    {
      title: "Locomotion and comfort",
      group: "Core VR",
      blurb: "Move players without making them sick.",
      vq: VALEM,
      read: [XRI, { label: "Meta: VR locomotion design guide", url: "https://developers.meta.com/horizon/resources/locomotion-design-techniques-best-practices/" }],
      lessons: ["Teleportation", "Continuous move and snap turn", "Comfort vignette and settings", "Climbing"],
    },
    {
      title: "VR UI and audio",
      group: "Core VR",
      blurb: "Interfaces that live in the world, and sound that tells you where things are.",
      vq: "Unity VR",
      read: [UNITY_VR],
      lessons: ["World-space UI with XR raycasts", "Diegetic UI", "Spatial audio"],
    },
    {
      title: "Performance",
      group: "Ship it",
      blurb: "Hold 72 or 90 fps on a mobile GPU, measured on the headset.",
      vq: "Unity Quest performance optimization",
      read: [{ label: "Meta: performance and optimization for Unity", url: "https://developers.meta.com/horizon/documentation/unity/unity-perf/" }],
      lessons: [
        "The frame budget at 72/90 Hz",
        "Draw calls, batching and SRP Batcher",
        "Single-pass instanced rendering",
        "Fixed foveated rendering",
        "Baked lighting and light probes",
        "Profiling on device",
      ],
    },
    {
      title: "Game systems",
      group: "Ship it",
      blurb: "The systems behind a real game: state, physics interactions, enemies and saves.",
      vq: "Unity",
      read: [{ label: "Unity Learn: game programming", url: "https://learn.unity.com" }],
      lessons: ["Game loop and state machines", "Physics-based weapons and doors", "Enemy AI with NavMesh", "Saving and loading"],
    },
    {
      title: "Multiplayer and publishing",
      group: "Ship it",
      blurb: "Play together, add passthrough, and get through store review.",
      vq: "Unity VR multiplayer",
      read: [{ label: "Netcode for GameObjects docs", url: "https://docs-multiplayer.unity3d.com" }, META],
      lessons: [
        "Netcode for GameObjects vs Photon Fusion",
        "Avatars and voice chat",
        ["Mixed reality and passthrough", { q: "Unity Meta Quest passthrough mixed reality tutorial" }],
        ["Publishing to the Meta Horizon Store", { q: "publish Meta Quest app store submission" }],
      ],
    },
    {
      title: "Projects",
      group: "Build",
      blurb: "Three small games, each one stretching the previous chapter's skills.",
      vq: VALEM,
      read: [UNITY_VR],
      lessons: ["Project: VR shooting gallery", "Project: VR escape room", "Project: mixed reality tabletop game"],
    },
  ],
};
