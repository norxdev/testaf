// --- Armor Sets ---
const armorSetsData = [
  // Sunfire & Moon Sets
  {
    name: "Sunfire Fanatic Armour Set",
    items: [
      { name: "Sunfire Fanatic Helm", id: "28933", imgName: "Sunfire_fanatic_helm" },
      { name: "Sunfire Fanatic Cuirass", id: "28936", imgName: "Sunfire_fanatic_cuirass" },
      { name: "Sunfire Fanatic Chausses", id: "28939", imgName: "Sunfire_fanatic_chausses" }
    ],
    setId: "29424",
    setImgName: "Sunfire_fanatic_armour_set"
  },
  {
    name: "Blood Moon Armour Set",
    items: [
      { name: "Blood Moon Helm", id: "29028", imgName: "Blood_moon_helm_detail" },
      { name: "Blood Moon Chestplate", id: "29022", imgName: "Blood_moon_chestplate_detail" },
      { name: "Blood Moon Tassets", id: "29025", imgName: "Blood_moon_tassets_detail" },
      { name: "Dual Macuahuitl", id: "28997", imgName: "Dual_macuahuitl_detail" }
    ],
    setId: "31136",
    setImgName: "Blood_moon_armour_set_detail"
  },
  {
    name: "Blue Moon Armour Set",
    items: [
      { name: "Blue Moon Helm", id: "29019", imgName: "Blue_moon_helm_detail" },
      { name: "Blue Moon Chestplate", id: "29013", imgName: "Blue_moon_chestplate_detail" },
      { name: "Blue Moon Tassets", id: "29016", imgName: "Blue_moon_tassets_detail" },
	  { name: "Blue Moon Spear", id: "28988", imgName: "Blue_moon_spear_detail" }
    ],
    setId: "31139",
    setImgName: "Blue_moon_armour_set_detail"
  },
  {
    name: "Eclipse Moon Armour Set",
    items: [
      { name: "Eclipse Moon Helm", id: "29010", imgName: "Eclipse_moon_helm_detail" },
      { name: "Eclipse Moon Chestplate", id: "29004", imgName: "Eclipse_moon_chestplate_detail" },
      { name: "Eclipse Moon Tassets", id: "29007", imgName: "Eclipse_moon_tassets_detail" },
      { name: "Eclipse Atlatl", id: "29000", imgName: "Eclipse_atlatl_detail" }
    ],
    setId: "31142",
    setImgName: "Eclipse_moon_armour_set_detail"
  },

  // Ancestral Robes Set
  {
    name: "Ancestral Robes Set",
    items: [
      { name: "Ancestral hat", id: "21018", imgName: "Ancestral_hat" },
      { name: "Ancestral robe top", id: "21021", imgName: "Ancestral_robe_top" },
      { name: "Ancestral robe bottom", id: "21024", imgName: "Ancestral_robe_bottom" }
    ],
    setId: "21049",
    setImgName: "Ancestral_robes_set"
  },

// Inquisitor's Armour Set
{
  name: "Inquisitor's Armour Set",
  items: [
    { name: "Inquisitor's great helm", id: "24419", imgName: "Inquisitor's_great_helm" },
    { name: "Inquisitor's hauberk", id: "24420", imgName: "Inquisitor's_hauberk" },
    { name: "Inquisitor's plateskirt", id: "24421", imgName: "Inquisitor's_plateskirt" },
  ],
  setId: "24488",
  setImgName: "Inquisitor's_armour_set_detail",
  layout: "vertical" // optional flag for rendering vertically like wiki
},


  // Dagon'hai Robes Set
  {
    name: "Dagon'hai Robes Set",
    items: [
      { name: "Dagon'hai hat", id: "24288", imgName: "Dagon'hai_hat_detail" },
      { name: "Dagon'hai robe top", id: "24291", imgName: "Dagon'hai_robe_top_detail" },
      { name: "Dagon'hai robe bottom", id: "24294", imgName: "Dagon'hai_robe_bottom_detail" }
    ],
    setId: "24333",
    setImgName: "Dagon'hai_robes_set_detail"
  },

  // Justiciar Armour Set
  {
    name: "Justiciar Armour Set",
    items: [
      { name: "Justiciar faceguard", id: "22326", imgName: "Justiciar_faceguard" },
      { name: "Justiciar chestguard", id: "22327", imgName: "Justiciar_chestguard" },
      { name: "Justiciar legguards", id: "22328", imgName: "Justiciar_legguards" }
    ],
    setId: "22438",
    setImgName: "Justiciar_armour_set"
  },

  // Oathplate Armour Set
  {
    name: "Oathplate Armour Set",
    items: [
      { name: "Oathplate helm", id: "30750", imgName: "Oathplate_helm" },
      { name: "Oathplate chest", id: "30753", imgName: "Oathplate_chest" },
      { name: "Oathplate legs", id: "30756", imgName: "Oathplate_legs" }
    ],
    setId: "30744",
    setImgName: "Oathplate_armour_set"
  },

  // Obsidian Armour Set
  {
    name: "Obsidian Armour Set",
    items: [
      { name: "Obsidian helmet", id: "21298", imgName: "Obsidian_helmet" },
      { name: "Obsidian platebody", id: "21301", imgName: "Obsidian_platebody" },
      { name: "Obsidian platelegs", id: "21304", imgName: "Obsidian_platelegs" }
    ],
    setId: "21279",
    setImgName: "Obsidian_armour_set"
  },

  // Virtus Armour Set
  {
    name: "Virtus Armour Set",
    items: [
      { name: "Virtus mask", id: "26241", imgName: "Virtus_mask" },
      { name: "Virtus robe top", id: "26243", imgName: "Virtus_robe_top" },
      { name: "Virtus robe bottom", id: "26245", imgName: "Virtus_robe_bottom" }
    ],
    setId: "31148",
    setImgName: "Virtus_armour_set"
  },

  // Dragonstone Armour Set
  {
    name: "Dragonstone Armour Set",
    items: [
      { name: "Dragonstone full helm", id: "24034", imgName: "Dragonstone_full_helm" },
      { name: "Dragonstone platebody", id: "24037", imgName: "Dragonstone_platebody" },
      { name: "Dragonstone gauntlets", id: "24046", imgName: "Dragonstone_gauntlets" },
	  { name: "Dragonstone platelegs", id: "24040", imgName: "Dragonstone_platelegs" }

    ],
    setId: "23667",
    setImgName: "Dragonstone_armour_set"
  },

  // Masori Armour Set (f)
  {
    name: "Masori Armour Set (f)",
    items: [
      { name: "Masori mask (f)", id: "27235", imgName: "Masori_mask_(f)_detail" },
      { name: "Masori body (f)", id: "27238", imgName: "Masori_body_(f)_detail" },
      { name: "Masori chaps (f)", id: "27241", imgName: "Masori_chaps_(f)_detail" }
    ],
    setId: "27355",
    setImgName: "Masori_armour_set_(f)_detail"
  },

  // Hueycoatl Hide Armour Set
  {
    name: "Hueycoatl Hide Armour Set",
    items: [
      { name: "Hueycoatl hide coif", id: "30073", imgName: "Hueycoatl_hide_coif" },
      { name: "Hueycoatl hide body", id: "30076", imgName: "Hueycoatl_hide_body" },
      { name: "Hueycoatl hide chaps", id: "30079", imgName: "Hueycoatl_hide_chaps" },
      { name: "Hueycoatl hide vambraces", id: "30082", imgName: "Hueycoatl_hide_vambraces" }
    ],
    setId: "31169",
    setImgName: "Hueycoatl_hide_armour_set"
  },

  // Barrows Sets
  {
    name: "Ahrim's Armour Set",
    items: [
      { name: "Ahrim's hood", id: "4708", imgName: "Ahrim's_hood_detail" },
      { name: "Ahrim's robetop", id: "4712", imgName: "Ahrim's_robetop_detail" },
      { name: "Ahrim's robeskirt", id: "4714", imgName: "Ahrim's_robeskirt_detail" },
      { name: "Ahrim's staff", id: "4710", imgName: "Ahrim's_staff_detail" }
    ],
    setId: "12881",
    setImgName: "Ahrim's_armour_set_detail"
  },
  {
    name: "Dharok's Armour Set",
    items: [
      { name: "Dharok's helm", id: "4716", imgName: "Dharok's_helm_detail" },
      { name: "Dharok's platebody", id: "4720", imgName: "Dharok's_platebody" },
      { name: "Dharok's platelegs", id: "4722", imgName: "Dharok's_platelegs" },
      { name: "Dharok's greataxe", id: "4718", imgName: "Dharok's_greataxe" }
    ],
    setId: "12877",
    setImgName: "Dharok's_armour_set"
  },
  {
    name: "Guthan's Armour Set",
    items: [
      { name: "Guthan's helm", id: "4724", imgName: "Guthan's_helm" },
      { name: "Guthan's platebody", id: "4728", imgName: "Guthan's_platebody" },
      { name: "Guthan's chainskirt", id: "4730", imgName: "Guthan's_chainskirt" },
      { name: "Guthan's warspear", id: "4726", imgName: "Guthan's_warspear" }
    ],
    setId: "12873",
    setImgName: "Guthan's_armour_set"
  },
  {
    name: "Karil's Armour Set",
    items: [
      { name: "Karil's coif", id: "4732", imgName: "Karil's_coif" },
      { name: "Karil's leathertop", id: "4736", imgName: "Karil's_leathertop" },
      { name: "Karil's leatherskirt", id: "4738", imgName: "Karil's_leatherskirt" },
      { name: "Karil's crossbow", id: "4734", imgName: "Karil's_crossbow" }
    ],
    setId: "12883",
    setImgName: "Karil's_armour_set"
  },
  {
    name: "Torag's Armour Set",
    items: [
      { name: "Torag's helm", id: "4745", imgName: "Torag's_helm" },
      { name: "Torag's platebody", id: "4749", imgName: "Torag's_platebody" },
      { name: "Torag's platelegs", id: "4751", imgName: "Torag's_platelegs" },
      { name: "Torag's hammers", id: "4747", imgName: "Torag's_hammers" }
    ],
    setId: "12879",
    setImgName: "Torag's_armour_set"
  },
  {
    name: "Verac's Armour Set",
    items: [
      { name: "Verac's helm", id: "4753", imgName: "Verac's_helm" },
      { name: "Verac's brassard", id: "4757", imgName: "Verac's_brassard" },
      { name: "Verac's plateskirt", id: "4759", imgName: "Verac's_plateskirt" },
      { name: "Verac's flail", id: "4755", imgName: "Verac's_flail" }
    ],
    setId: "12875",
    setImgName: "Verac's_armour_set"
  },
  
//Gilded
{
  name: "Gilded Armour Set (lg)&nbsp;<img src='https://oldschool.runescape.wiki/images/Free-to-play_icon.png' alt='F2P' style='width:16px;height:16px;vertical-align:middle;'>&nbsp;",
  items: [
    { name: "Gilded Full Helm", id: "3486", imgName: "Gilded_full_helm_detail" },
    { name: "Gilded Platebody", id: "3481", imgName: "Gilded_platebody_detail" },
    { name: "Gilded Platelegs", id: "3483", imgName: "Gilded_platelegs_detail" },
    { name: "Gilded Kiteshield", id: "3488", imgName: "Gilded_kiteshield_detail" }
  ],
  setId: "13036",
  isF2P: true,
  setImgName: "Gilded_armour_set_(lg)_detail"
},

{
  name: "Gilded Dragonhide Set&nbsp;<img src='https://oldschool.runescape.wiki/images/Free-to-play_icon.png' alt='F2P' style='width:16px;height:16px;vertical-align:middle;'>&nbsp;",
  items: [
    { name: "Gilded D'hide Body", id: "23264", imgName: "Gilded_d'hide_body_detail" },
    { name: "Gilded D'hide Chaps", id: "23267", imgName: "Gilded_d'hide_chaps_detail" },
    { name: "Gilded D'hide Vambraces", id: "23261", imgName: "Gilded_d'hide_vambraces_detail" }
  ],
  setId: "23124",
  isF2P: true,
  setImgName: "Gilded_dragonhide_set_detail"
},

//F2P God Armour
  {
  name: "Guthix Armour Set (lg)&nbsp;<img src='https://oldschool.runescape.wiki/images/Free-to-play_icon.png' alt='F2P' style='width:16px;height:16px;vertical-align:middle;'>&nbsp;",
  items: [
    { name: "Guthix full helm", id: "2673", imgName: "Guthix_full_helm_detail" },
    { name: "Guthix platebody", id: "2669", imgName: "Guthix_platebody_detail" },
    { name: "Guthix platelegs", id: "2671", imgName: "Guthix_platelegs_detail" },
    { name: "Guthix kiteshield", id: "2675", imgName: "Guthix_kiteshield_detail" }
  ],
  setId: "13048",
  isF2P: true,
  setImgName: "Guthix_armour_set_(lg)_detail"
},
{
  name: "Saradomin Armour Set (lg)&nbsp;<img src='https://oldschool.runescape.wiki/images/Free-to-play_icon.png' alt='F2P' style='width:16px;height:16px;vertical-align:middle;'>&nbsp;",
  items: [
    { name: "Saradomin full helm", id: "2665", imgName: "Saradomin_full_helm_detail" },
    { name: "Saradomin platebody", id: "2661", imgName: "Saradomin_platebody_detail" },
    { name: "Saradomin platelegs", id: "2663", imgName: "Saradomin_platelegs_detail" },
    { name: "Saradomin kiteshield", id: "2667", imgName: "Saradomin_kiteshield_detail" }
  ],
  setId: "13040",
  isF2P: true,
  setImgName: "Saradomin_armour_set_(lg)_detail"
},
{
  name: "Zamorak Armour Set (lg)&nbsp;<img src='https://oldschool.runescape.wiki/images/Free-to-play_icon.png' alt='F2P' style='width:16px;height:16px;vertical-align:middle;'>&nbsp;",
  items: [
    { name: "Zamorak full helm", id: "2657", imgName: "Zamorak_full_helm_detail" },
    { name: "Zamorak platebody", id: "2653", imgName: "Zamorak_platebody_detail" },
    { name: "Zamorak platelegs", id: "2655", imgName: "Zamorak_platelegs_detail" },
    { name: "Zamorak kiteshield", id: "2659", imgName: "Zamorak_kiteshield_detail" }
  ],
  setId: "13044",
  isF2P: true,
  setImgName: "Zamorak_armour_set_(lg)_detail"
},

{
  name: "Rune Armour Set (lg)&nbsp;<img src='https://oldschool.runescape.wiki/images/Free-to-play_icon.png' alt='F2P' style='width:16px;height:16px;vertical-align:middle;'>&nbsp;",
  items: [
    { name: "Rune full helm", id: "1163", imgName: "Rune_full_helm_detail" },
    { name: "Rune platebody", id: "1127", imgName: "Rune_platebody_detail" },
    { name: "Rune platelegs", id: "1079", imgName: "Rune_platelegs_detail" },
    { name: "Rune kiteshield", id: "1201", imgName: "Rune_kiteshield_detail" }
  ],
  setId: "13024",
  isF2P: true,
  setImgName: "Rune_armour_set_(lg)_detail"
},
	{
  name: "Dragon Armour Set (lg)",
  items: [
    { name: "Dragon full helm", id: 11335, imgName: "Dragon_full_helm" },
    { name: "Dragon platebody", id: 21892, imgName: "Dragon_platebody" },
    { name: "Dragon platelegs", id: 4087, imgName: "Dragon_platelegs" },
    { name: "Dragon kiteshield", id: 21895, imgName: "Dragon_kiteshield" }
  ],
  setId: 21882,
  setImgName: "Dragon_armour_set_(lg)_detail",
  isF2P: false
},

{
  name: "Torva Armour Set",
  items: [
    { name: "Torva full helm", id: 26382, imgName: "Torva_full_helm" },
    { name: "Torva platebody", id: 26384, imgName: "Torva_platebody" },
    { name: "Torva platelegs", id: 26386, imgName: "Torva_platelegs" }
  ],
  setId: 31145,
  setImgName: "Torva_armour_set_detail",
  isF2P: false
},

{
  name: "Dwarf Cannon Set",
  items: [
    { name: "Cannon barrels", id: 10, imgName: "Cannon_barrels" },
    { name: "Cannon base", id: 6, imgName: "Cannon_base" },
    { name: "Cannon furnace", id: 12, imgName: "Cannon_furnace" },
    { name: "Cannon stand", id: 8, imgName: "Cannon_stand" }
  ],
  setId: 12863,
  setImgName: "Dwarf_cannon_set_detail",
  isF2P: false
},
{
  name: "Partyhat Set&nbsp;<img src='https://oldschool.runescape.wiki/images/Free-to-play_icon.png' alt='F2P' style='width:16px;height:16px;vertical-align:middle;'>&nbsp;",
  items: [
    { name: "Red partyhat", id: 1038, imgName: "Red_partyhat" },
    { name: "Yellow partyhat", id: 1040, imgName: "Yellow_partyhat" },
    { name: "Green partyhat", id: 1044, imgName: "Green_partyhat" },
    { name: "Blue partyhat", id: 1042, imgName: "Blue_partyhat" },
    { name: "Purple partyhat", id: 1046, imgName: "Purple_partyhat" },
    { name: "White partyhat", id: 1048, imgName: "White_partyhat" }
  ],
  setId: 13173,
  setImgName: "Partyhat_set_detail",
  isF2P: true
}

];

