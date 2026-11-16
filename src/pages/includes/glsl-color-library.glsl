// GLSL Color Library — 200 reusable colors
// Values are linear numeric RGB fractions in the 0.0–1.0 range,
// encoded from sRGB hex values. Use directly for palette/display work;
// apply sRGB-to-linear conversion if using them as physically linear light inputs.

// Usage:
// #include <colors.glsl>  (with your GLSL include system)
// vec3 color = nature_ForestGreen;
// vec3 sunset = paletteSunset(t); // t in [0, 1]

// ===== Nature =====
const vec3 nature_LeafGreen = vec3(0.1804, 0.5451, 0.3412); // #2E8B57
const vec3 nature_ForestGreen = vec3(0.1333, 0.5451, 0.1333); // #228B22
const vec3 nature_MossGreen = vec3(0.5412, 0.6039, 0.3569); // #8A9A5B
const vec3 nature_OliveGreen = vec3(0.4392, 0.5098, 0.2196); // #708238
const vec3 nature_FernGreen = vec3(0.3098, 0.4745, 0.2588); // #4F7942
const vec3 nature_SpringGreen = vec3(0.0000, 1.0000, 0.4980); // #00FF7F
const vec3 nature_Jade = vec3(0.0000, 0.6588, 0.4196); // #00A86B
const vec3 nature_MintLeaf = vec3(0.5961, 1.0000, 0.5961); // #98FF98
const vec3 nature_LimeGreen = vec3(0.1961, 0.8039, 0.1961); // #32CD32
const vec3 nature_PineGreen = vec3(0.0039, 0.4745, 0.4353); // #01796F
const vec3 nature_SageGreen = vec3(0.6118, 0.6863, 0.5333); // #9CAF88
const vec3 nature_Avocado = vec3(0.3373, 0.5098, 0.0118); // #568203
const vec3 nature_Basil = vec3(0.1961, 0.3804, 0.1765); // #32612D
const vec3 nature_Clover = vec3(0.2431, 0.6275, 0.3333); // #3EA055
const vec3 nature_Meadow = vec3(0.4196, 0.5569, 0.1373); // #6B8E23
const vec3 nature_Cactus = vec3(0.3451, 0.4902, 0.2431); // #587D3E
const vec3 nature_Eucalyptus = vec3(0.3725, 0.5216, 0.4588); // #5F8575
const vec3 nature_Peridot = vec3(0.7059, 0.7686, 0.1412); // #B4C424
const vec3 nature_Myrtle = vec3(0.1922, 0.4706, 0.4510); // #317873
const vec3 nature_GreenTea = vec3(0.8157, 0.9412, 0.7529); // #D0F0C0

// ===== Neon =====
const vec3 neon_NeonPink = vec3(1.0000, 0.0627, 0.9412); // #FF10F0
const vec3 neon_ElectricBlue = vec3(0.4902, 0.9765, 1.0000); // #7DF9FF
const vec3 neon_LaserLemon = vec3(1.0000, 1.0000, 0.4000); // #FFFF66
const vec3 neon_NeonGreen = vec3(0.2235, 1.0000, 0.0784); // #39FF14
const vec3 neon_HotMagenta = vec3(1.0000, 0.0000, 0.6588); // #FF00A8
const vec3 neon_CyberPurple = vec3(0.7490, 0.0000, 1.0000); // #BF00FF
const vec3 neon_NeonOrange = vec3(1.0000, 0.3725, 0.1216); // #FF5F1F
const vec3 neon_ElectricCyan = vec3(0.0000, 1.0000, 1.0000); // #00FFFF
const vec3 neon_AcidGreen = vec3(0.6902, 1.0000, 0.0000); // #B0FF00
const vec3 neon_Ultraviolet = vec3(0.4353, 0.0000, 1.0000); // #6F00FF
const vec3 neon_BrightFuchsia = vec3(1.0000, 0.0000, 1.0000); // #FF00FF
const vec3 neon_NeonRed = vec3(1.0000, 0.0275, 0.2275); // #FF073A
const vec3 neon_LaserBlue = vec3(0.1216, 0.3176, 1.0000); // #1F51FF
const vec3 neon_GlowYellow = vec3(0.8745, 1.0000, 0.0000); // #DFFF00
const vec3 neon_ToxicGreen = vec3(0.4980, 1.0000, 0.0000); // #7FFF00
const vec3 neon_Plasma = vec3(1.0000, 0.1765, 0.5843); // #FF2D95
const vec3 neon_VividViolet = vec3(0.6157, 0.0000, 1.0000); // #9D00FF
const vec3 neon_SignalOrange = vec3(1.0000, 0.2706, 0.0000); // #FF4500
const vec3 neon_Ion = vec3(0.0000, 0.8980, 1.0000); // #00E5FF
const vec3 neon_NeonCoral = vec3(1.0000, 0.2392, 0.4431); // #FF3D71

// ===== Pastel =====
const vec3 pastel_BabyPink = vec3(0.9569, 0.7608, 0.7608); // #F4C2C2
const vec3 pastel_Lavender = vec3(0.9020, 0.9020, 0.9804); // #E6E6FA
const vec3 pastel_PowderBlue = vec3(0.6902, 0.8784, 0.9020); // #B0E0E6
const vec3 pastel_MintCream = vec3(0.9608, 1.0000, 0.9804); // #F5FFFA
const vec3 pastel_Peach = vec3(1.0000, 0.8980, 0.7059); // #FFE5B4
const vec3 pastel_Lilac = vec3(0.7843, 0.6353, 0.7843); // #C8A2C8
const vec3 pastel_ButterYellow = vec3(1.0000, 0.9451, 0.6588); // #FFF1A8
const vec3 pastel_Seafoam = vec3(0.6980, 0.8471, 0.7765); // #B2D8C6
const vec3 pastel_PastelCoral = vec3(0.9686, 0.6392, 0.6000); // #F7A399
const vec3 pastel_Periwinkle = vec3(0.8000, 0.8000, 1.0000); // #CCCCFF
const vec3 pastel_Pistachio = vec3(0.8431, 0.9098, 0.6588); // #D7E8A8
const vec3 pastel_Blush = vec3(0.8706, 0.5961, 0.6706); // #DE98AB
const vec3 pastel_SkyPastel = vec3(0.7804, 0.9059, 0.9608); // #C7E7F5
const vec3 pastel_Apricot = vec3(0.9804, 0.8392, 0.7490); // #FAD6BF
const vec3 pastel_Mauve = vec3(0.8784, 0.6902, 1.0000); // #E0B0FF
const vec3 pastel_IceBlue = vec3(0.8431, 0.9490, 0.9686); // #D7F2F7
const vec3 pastel_Rosewater = vec3(0.9804, 0.8549, 0.8667); // #FADADD
const vec3 pastel_Vanilla = vec3(0.9529, 0.8980, 0.6706); // #F3E5AB
const vec3 pastel_SoftTeal = vec3(0.6588, 0.8549, 0.8627); // #A8DADC
const vec3 pastel_CloudLilac = vec3(0.8941, 0.8431, 0.9608); // #E4D7F5

// ===== Earth =====
const vec3 earth_Terracotta = vec3(0.8863, 0.4471, 0.3569); // #E2725B
const vec3 earth_Clay = vec3(0.7137, 0.4157, 0.3137); // #B66A50
const vec3 earth_Umber = vec3(0.3882, 0.3176, 0.2784); // #635147
const vec3 earth_RawSienna = vec3(0.8392, 0.5412, 0.3490); // #D68A59
const vec3 earth_Ochre = vec3(0.8000, 0.4667, 0.1333); // #CC7722
const vec3 earth_Sandstone = vec3(0.7608, 0.6980, 0.5020); // #C2B280
const vec3 earth_Taupe = vec3(0.2824, 0.2353, 0.1961); // #483C32
const vec3 earth_Cocoa = vec3(0.4353, 0.3059, 0.2157); // #6F4E37
const vec3 earth_Walnut = vec3(0.3647, 0.2627, 0.1725); // #5D432C
const vec3 earth_Mushroom = vec3(0.6627, 0.5451, 0.4510); // #A98B73
const vec3 earth_DustyOlive = vec3(0.4196, 0.4392, 0.3608); // #6B705C
const vec3 earth_DesertSand = vec3(0.9294, 0.7882, 0.6863); // #EDC9AF
const vec3 earth_Rust = vec3(0.7176, 0.2549, 0.0549); // #B7410E
const vec3 earth_Brick = vec3(0.6196, 0.2314, 0.1804); // #9E3B2E
const vec3 earth_Dune = vec3(0.7843, 0.6784, 0.4980); // #C8AD7F
const vec3 earth_Bark = vec3(0.3961, 0.2627, 0.1294); // #654321
const vec3 earth_ClayBeige = vec3(0.8235, 0.7059, 0.5490); // #D2B48C
const vec3 earth_Cinnamon = vec3(0.4824, 0.2471, 0.0000); // #7B3F00
const vec3 earth_Pebble = vec3(0.5451, 0.5216, 0.5373); // #8B8589
const vec3 earth_EarthBrown = vec3(0.4745, 0.3333, 0.2824); // #795548

// ===== Ocean =====
const vec3 ocean_DeepOcean = vec3(0.0000, 0.2314, 0.3608); // #003B5C
const vec3 ocean_OceanBlue = vec3(0.0000, 0.4118, 0.5804); // #006994
const vec3 ocean_SeaBlue = vec3(0.0000, 0.4667, 0.7137); // #0077B6
const vec3 ocean_Aqua = vec3(0.0000, 1.0000, 1.0000); // #00FFFF
const vec3 ocean_Turquoise = vec3(0.2510, 0.8784, 0.8157); // #40E0D0
const vec3 ocean_Teal = vec3(0.0000, 0.5020, 0.5020); // #008080
const vec3 ocean_Lagoon = vec3(0.1804, 0.5451, 0.5451); // #2E8B8B
const vec3 ocean_Marine = vec3(0.0000, 0.3059, 0.3922); // #004E64
const vec3 ocean_SeafoamGreen = vec3(0.6235, 0.8863, 0.7490); // #9FE2BF
const vec3 ocean_Navy = vec3(0.0000, 0.0000, 0.5020); // #000080
const vec3 ocean_TropicalWater = vec3(0.0000, 0.7059, 0.8471); // #00B4D8
const vec3 ocean_CoralReef = vec3(1.0000, 0.4980, 0.3137); // #FF7F50
const vec3 ocean_BlueLagoon = vec3(0.2941, 0.7765, 0.7255); // #4BC6B9
const vec3 ocean_StormSea = vec3(0.2078, 0.3608, 0.4902); // #355C7D
const vec3 ocean_Arctic = vec3(0.8392, 0.9451, 0.9608); // #D6F1F5
const vec3 ocean_Kelp = vec3(0.2314, 0.4196, 0.3333); // #3B6B55
const vec3 ocean_DeepTeal = vec3(0.0000, 0.3725, 0.4510); // #005F73
const vec3 ocean_Wave = vec3(0.3647, 0.6784, 0.8863); // #5DADE2
const vec3 ocean_Abyss = vec3(0.0000, 0.1216, 0.2471); // #001F3F
const vec3 ocean_Shell = vec3(0.9686, 0.9059, 0.8078); // #F7E7CE

// ===== Sunset =====
const vec3 sunset_SunsetOrange = vec3(0.9922, 0.3686, 0.3255); // #FD5E53
const vec3 sunset_DuskPink = vec3(0.8784, 0.4784, 0.5529); // #E07A8D
const vec3 sunset_HorizonGold = vec3(0.9647, 0.6824, 0.1765); // #F6AE2D
const vec3 sunset_TwilightPurple = vec3(0.4157, 0.2980, 0.5765); // #6A4C93
const vec3 sunset_Sunrise = vec3(1.0000, 0.7020, 0.2784); // #FFB347
const vec3 sunset_Ember = vec3(0.9490, 0.3608, 0.3294); // #F25C54
const vec3 sunset_PeachGlow = vec3(1.0000, 0.8000, 0.6000); // #FFCC99
const vec3 sunset_RoseSky = vec3(0.9569, 0.6510, 0.6510); // #F4A6A6
const vec3 sunset_VioletDusk = vec3(0.4824, 0.1725, 0.7490); // #7B2CBF
const vec3 sunset_ApricotGlow = vec3(0.9843, 0.8078, 0.6941); // #FBCEB1
const vec3 sunset_GoldenHour = vec3(0.9569, 0.6627, 0.0000); // #F4A900
const vec3 sunset_CoralSun = vec3(1.0000, 0.4353, 0.3804); // #FF6F61
const vec3 sunset_Afterglow = vec3(0.8196, 0.4196, 0.6471); // #D16BA5
const vec3 sunset_MauveDusk = vec3(0.5882, 0.4784, 0.6314); // #967AA1
const vec3 sunset_Saffron = vec3(0.9569, 0.7686, 0.1882); // #F4C430
const vec3 sunset_Flame = vec3(0.8863, 0.3451, 0.1333); // #E25822
const vec3 sunset_PinkHorizon = vec3(1.0000, 0.5608, 0.6706); // #FF8FAB
const vec3 sunset_EveningBlue = vec3(0.3216, 0.4275, 0.5098); // #526D82
const vec3 sunset_AmberSky = vec3(1.0000, 0.7490, 0.0000); // #FFBF00
const vec3 sunset_RedHorizon = vec3(0.7686, 0.2706, 0.2118); // #C44536

// ===== Metallic =====
const vec3 metallic_Gold = vec3(1.0000, 0.8431, 0.0000); // #FFD700
const vec3 metallic_Silver = vec3(0.7529, 0.7529, 0.7529); // #C0C0C0
const vec3 metallic_Bronze = vec3(0.8039, 0.4980, 0.1961); // #CD7F32
const vec3 metallic_Copper = vec3(0.7216, 0.4510, 0.2000); // #B87333
const vec3 metallic_RoseGold = vec3(0.7176, 0.4314, 0.4745); // #B76E79
const vec3 metallic_Platinum = vec3(0.8980, 0.8941, 0.8863); // #E5E4E2
const vec3 metallic_Steel = vec3(0.4431, 0.4745, 0.4941); // #71797E
const vec3 metallic_Titanium = vec3(0.5294, 0.5255, 0.5059); // #878681
const vec3 metallic_Iron = vec3(0.2824, 0.2863, 0.2941); // #48494B
const vec3 metallic_Chrome = vec3(0.8588, 0.8863, 0.9137); // #DBE2E9
const vec3 metallic_Brass = vec3(0.7098, 0.6510, 0.2588); // #B5A642
const vec3 metallic_Pewter = vec3(0.5373, 0.5804, 0.6000); // #899499
const vec3 metallic_Gunmetal = vec3(0.1647, 0.2039, 0.2235); // #2A3439
const vec3 metallic_Champagne = vec3(0.9686, 0.9059, 0.8078); // #F7E7CE
const vec3 metallic_AntiqueGold = vec3(0.8118, 0.7098, 0.2314); // #CFB53B
const vec3 metallic_Nickel = vec3(0.4471, 0.4549, 0.4471); // #727472
const vec3 metallic_Mercury = vec3(0.9020, 0.9020, 0.9020); // #E6E6E6
const vec3 metallic_DarkBronze = vec3(0.5020, 0.2902, 0.0000); // #804A00
const vec3 metallic_Aluminium = vec3(0.6588, 0.6627, 0.6784); // #A8A9AD
const vec3 metallic_MetalBlue = vec3(0.2745, 0.5098, 0.7059); // #4682B4

// ===== GradientPalettes =====
const vec3 gradient_AuroraA = vec3(0.0000, 0.9608, 0.8314); // #00F5D4
const vec3 gradient_AuroraB = vec3(0.0000, 0.7333, 0.9765); // #00BBF9
const vec3 gradient_AuroraC = vec3(0.6078, 0.3647, 0.8980); // #9B5DE5
const vec3 gradient_AuroraD = vec3(0.9451, 0.3569, 0.7098); // #F15BB5
const vec3 gradient_FireA = vec3(1.0000, 0.2353, 0.0000); // #FF3C00
const vec3 gradient_FireB = vec3(1.0000, 0.5490, 0.0000); // #FF8C00
const vec3 gradient_FireC = vec3(1.0000, 0.8157, 0.0000); // #FFD000
const vec3 gradient_FireD = vec3(1.0000, 0.9529, 0.6902); // #FFF3B0
const vec3 gradient_IceA = vec3(0.0118, 0.0157, 0.3686); // #03045E
const vec3 gradient_IceB = vec3(0.0000, 0.4667, 0.7137); // #0077B6
const vec3 gradient_IceC = vec3(0.5647, 0.8784, 0.9373); // #90E0EF
const vec3 gradient_IceD = vec3(0.7922, 0.9412, 0.9725); // #CAF0F8
const vec3 gradient_CandyA = vec3(1.0000, 0.4392, 0.6510); // #FF70A6
const vec3 gradient_CandyB = vec3(1.0000, 0.5922, 0.4392); // #FF9770
const vec3 gradient_CandyC = vec3(1.0000, 0.8392, 0.4392); // #FFD670
const vec3 gradient_CandyD = vec3(0.9137, 1.0000, 0.4392); // #E9FF70
const vec3 gradient_ForestA = vec3(0.0314, 0.1098, 0.0824); // #081C15
const vec3 gradient_ForestB = vec3(0.1059, 0.2627, 0.1961); // #1B4332
const vec3 gradient_ForestC = vec3(0.2510, 0.5686, 0.4235); // #40916C
const vec3 gradient_ForestD = vec3(0.7176, 0.8941, 0.7804); // #B7E4C7

// ===== DarkMoody =====
const vec3 dark_Midnight = vec3(0.0980, 0.0980, 0.4392); // #191970
const vec3 dark_Charcoal = vec3(0.2118, 0.2706, 0.3098); // #36454F
const vec3 dark_Obsidian = vec3(0.0431, 0.0431, 0.0431); // #0B0B0B
const vec3 dark_Raven = vec3(0.1294, 0.1294, 0.1294); // #212121
const vec3 dark_DarkPlum = vec3(0.1882, 0.0980, 0.2039); // #301934
const vec3 dark_Wine = vec3(0.4471, 0.1843, 0.2157); // #722F37
const vec3 dark_Burgundy = vec3(0.5020, 0.0000, 0.1255); // #800020
const vec3 dark_DeepForest = vec3(0.0039, 0.1961, 0.1255); // #013220
const vec3 dark_Petrol = vec3(0.0000, 0.3725, 0.4157); // #005F6A
const vec3 dark_Slate = vec3(0.4392, 0.5020, 0.5647); // #708090
const vec3 dark_Graphite = vec3(0.2196, 0.2196, 0.2196); // #383838
const vec3 dark_InkBlue = vec3(0.0627, 0.1647, 0.2627); // #102A43
const vec3 dark_SmokyViolet = vec3(0.3176, 0.2549, 0.3098); // #51414F
const vec3 dark_DarkMoss = vec3(0.2078, 0.3098, 0.2118); // #354F36
const vec3 dark_Espresso = vec3(0.2353, 0.1412, 0.0824); // #3C2415
const vec3 dark_Storm = vec3(0.1843, 0.3098, 0.3098); // #2F4F4F
const vec3 dark_NightTeal = vec3(0.0706, 0.2353, 0.2392); // #123C3D
const vec3 dark_Ash = vec3(0.4118, 0.4118, 0.4118); // #696969
const vec3 dark_Shadow = vec3(0.1451, 0.1451, 0.1451); // #252525
const vec3 dark_DeepIndigo = vec3(0.1020, 0.1373, 0.4941); // #1A237E

// ===== GameFantasy =====
const vec3 fantasy_ManaBlue = vec3(0.2549, 0.4118, 0.8824); // #4169E1
const vec3 fantasy_MagicViolet = vec3(0.5412, 0.1686, 0.8863); // #8A2BE2
const vec3 fantasy_DragonRed = vec3(0.5451, 0.0000, 0.0000); // #8B0000
const vec3 fantasy_PotionGreen = vec3(0.3137, 0.7843, 0.4706); // #50C878
const vec3 fantasy_CrystalCyan = vec3(0.4980, 1.0000, 0.8314); // #7FFFD4
const vec3 fantasy_ArcaneGold = vec3(0.8549, 0.6471, 0.1255); // #DAA520
const vec3 fantasy_FairyPink = vec3(1.0000, 0.4118, 0.7059); // #FF69B4
const vec3 fantasy_GhostWhite = vec3(0.9725, 0.9725, 1.0000); // #F8F8FF
const vec3 fantasy_MysticTeal = vec3(0.0000, 0.6510, 0.6510); // #00A6A6
const vec3 fantasy_Lava = vec3(0.8118, 0.0627, 0.1255); // #CF1020
const vec3 fantasy_EnchantedLeaf = vec3(0.2980, 0.7333, 0.0902); // #4CBB17
const vec3 fantasy_RoyalPurple = vec3(0.4706, 0.3176, 0.6627); // #7851A9
const vec3 fantasy_SpellSilver = vec3(0.8471, 0.8667, 0.9020); // #D8DDE6
const vec3 fantasy_Phoenix = vec3(1.0000, 0.2706, 0.0000); // #FF4500
const vec3 fantasy_Moonstone = vec3(0.4824, 0.6196, 0.7020); // #7B9EB3
const vec3 fantasy_Void = vec3(0.0863, 0.0000, 0.1686); // #16002B
const vec3 fantasy_Rune = vec3(0.7843, 0.6353, 0.7843); // #C8A2C8
const vec3 fantasy_CursedRose = vec3(0.6196, 0.1059, 0.1961); // #9E1B32
const vec3 fantasy_Celestial = vec3(0.7216, 0.7529, 1.0000); // #B8C0FF
const vec3 fantasy_Treasure = vec3(0.9020, 0.7451, 0.5412); // #E6BE8A

// ===== Reusable helpers =====
vec3 colorLerp(vec3 a, vec3 b, float t) {
    return mix(a, b, clamp(t, 0.0, 1.0));
}

vec3 paletteSunset(float t) {
    t = clamp(t, 0.0, 1.0);
    if (t < 0.3333) return mix(sunset_SunsetOrange, sunset_HorizonGold, t * 3.0);
    if (t < 0.6667) return mix(sunset_HorizonGold, sunset_TwilightPurple, (t - 0.3333) * 3.0);
    return mix(sunset_TwilightPurple, sunset_EveningBlue, (t - 0.6667) * 3.0);
}

vec3 paletteOcean(float t) {
    t = clamp(t, 0.0, 1.0);
    if (t < 0.5) return mix(ocean_Abyss, ocean_OceanBlue, t * 2.0);
    return mix(ocean_OceanBlue, ocean_SeafoamGreen, (t - 0.5) * 2.0);
}

vec3 paletteAurora(float t) {
    t = clamp(t, 0.0, 1.0);
    if (t < 0.3333) return mix(gradient_AuroraA, gradient_AuroraB, t * 3.0);
    if (t < 0.6667) return mix(gradient_AuroraB, gradient_AuroraC, (t - 0.3333) * 3.0);
    return mix(gradient_AuroraC, gradient_AuroraD, (t - 0.6667) * 3.0);
}

// Simple procedural color ramp example:
// float t = smoothstep(-0.5, 0.8, vUv.y);
// vec3 color = paletteSunset(t);
// gl_FragColor = vec4(color, 1.0);

// Three.js ShaderMaterial note:
// In modern Three.js, provide this file through vite-plugin-glsl or your
// chosen GLSL import system. If using a custom output pipeline, handle
// color-space conversion consistently to avoid overly bright/dull colors.
